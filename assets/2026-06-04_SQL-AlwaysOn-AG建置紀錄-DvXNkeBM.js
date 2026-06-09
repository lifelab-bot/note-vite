var e=`# SQL Server AlwaysOn AG Lab 建置紀錄

## Lab 目標

在已有 SQL Server 2022 FCI 環境的基礎上，建立 **AlwaysOn Availability Group（AG）**，讓資料庫除了 FCI 節點間切換外，還能同步到獨立的 Secondary 節點，實現跨機器的高可用備援。

## 環境

| 項目 | 說明 |
|------|------|
| 平台 | VMware vSphere |
| 作業系統 | Windows Server 2022 |
| 資料庫 | SQL Server 2022 |
| Primary Replica | SQLFC（FCI，運行於 DB01/DB02 Cluster 上） |
| Secondary Replica | SQLAL01（獨立主機，SQL 實例：SQLAL01\\SQLSERVERBK） |
| AG 名稱 | SQL-HA |
| AG 同步資料庫 | AdventureWorks2022 |
| 備份共用路徑 | \`\\\\sqlal01\\bk\` |

## FCI vs AlwaysOn AG 架構差異

| 項目 | FCI | AlwaysOn AG |
|------|-----|------------|
| 磁碟 | 共用 iSCSI/SAN | 每個節點各自獨立 |
| 同步方式 | 共用磁碟所有權切換 | Log Streaming（即時傳輸） |
| 切換單位 | SQL 實例 | 資料庫群組 |
| 需要 WSFC | 是 | 是（所有節點都要加入） |

## 防火牆設定

FCI 與 AlwaysOn AG 需要開放的防火牆規則如下：

| Port | 用途 | 適用範圍 |
|------|------|---------|
| TCP 1433 | SQL Server 用戶端連線 | FCI + AlwaysOn AG |
| TCP 5022 | AG Endpoint（Log Streaming 傳輸） | AlwaysOn AG 專用 |

**Port 1433**：應用程式與 SSMS 連線 SQL Server 使用，所有 Replica 節點都需要開放。

**Port 5022**：AlwaysOn AG 的 Database Mirroring Endpoint，Primary 與 Secondary 之間傳輸 transaction log 走這個 port。FCI 本身不需要，但只要有設定 AG 就必須開，兩邊都要。

每台節點（DB01、DB02、SQLAL01）的 Windows Firewall 都需要新增這兩條 Inbound Rule。

---

## 建置前準備

### 1. 確認 Primary 資料庫狀態

AG 只能同步 **Recovery Model = Full** 的資料庫。在 Primary（SQLFC）確認：

\`\`\`sql
SELECT name, recovery_model_desc FROM sys.databases WHERE name = 'AdventureWorks2022'
-- 結果需為 FULL
\`\`\`

若為 SIMPLE，需先改為 Full：

\`\`\`sql
ALTER DATABASE AdventureWorks2022 SET RECOVERY FULL
\`\`\`

### 2. Secondary 加入 Windows Cluster

AlwaysOn AG 要求所有 Replica 節點都是同一個 WSFC 的成員，否則 AG Wizard 無法運作。

1. 在 SQLAL01 安裝 **Failover Clustering** 功能
2. Failover Cluster Manager → **加入現有叢集**，輸入叢集名稱加入
3. 驗證精靈若出現「驗證已啟用交換器的小組設定」失敗 → 可忽略，不影響 AG 功能

SQLAL01 加入 Cluster 只是取得「資格」，不需要存取共用磁碟。

### 3. Secondary 安裝 SQL Server 2022

在 SQLAL01 安裝獨立的 SQL Server 2022 執行個體：

1. 執行 SQL Server 2022 安裝程式 → **新增獨立的 SQL Server 安裝**
2. 版本：**Developer**
3. 功能：勾選**資料庫引擎服務**
4. 執行個體組態：
   - 類型：具名執行個體
   - 執行個體名稱：\`SQLSERVERBK\`
5. 伺服器組態：
   - SQL Server Database Engine：\`AFLAB\\sqlsvs\`（手動）
   - SQL Server Agent：\`AFLAB\\sqlsvs\`（手動）
6. 資料庫引擎組態：混合模式

### 4. 啟用 AlwaysOn High Availability（兩節點都要做）

在 **Primary（SQLFC）** 和 **Secondary（SQLAL01\\SQLSERVERBK）** 各自執行：

1. 開啟 **SQL Server Configuration Manager**
2. 左側 → SQL Server 服務 → 右鍵對應的 **SQL Server 服務** → 內容
3. 切換到 **AlwaysOn 高可用性** 分頁
4. 勾選「**啟用 AlwaysOn 可用性群組**」，確認 Cluster 名稱正確
5. 確定後重啟 SQL Server 服務

### 5. SQL Agent 設為自動（兩節點都要做）

AG 建立後 SQL Agent 負責監控工作，建議設為自動啟動：

1. SQL Server Configuration Manager → **SQL Server 代理程式**
2. 右鍵 → 內容 → 啟動模式：**自動**
3. 若尚未啟動，手動啟動服務

### 6. Secondary 建立資料目錄

AG Wizard 驗證時會檢查 Secondary 是否有與 Primary 相同的資料夾路徑。

在 SQLAL01 建立：
\`\`\`
F:\\MSSQL16.SQLFC\\MSSQL\\DATA
\`\`\`

路徑命名規則：\`F:\\MSSQL{版本}.{Primary實例名稱}\\MSSQL\\DATA\`

### 7. 啟用 SQL Server TCP/IP

在 SQLAL01 的 SQL Server Configuration Manager 確認 TCP/IP 已啟用，SQL Server Browser 服務正在執行。

### 8. 建立備份共用目錄

在 SQLAL01 建立 \`bk\` 資料夾並設為 Windows 共用，讓 Primary 可以把初始備份寫入，Secondary 再從中還原。

**服務帳號權限（兩者都要加）：**

| 帳號 | 需要的權限 | 原因 |
|------|----------|------|
| SQLFC 的 SQL 服務帳號（\`AFLAB\\sqlsvs\`） | 完全控制 | 要把備份寫進去 |
| SQLAL01 的 SQL 服務帳號（\`AFLAB\\sqlsvs\`） | 讀取 | 要從中還原備份 |

若兩台服務帳號相同，只需加一個帳號並給完全控制。

## AlwaysOn 初始同步流程

\`\`\`
Primary 完整備份 → 存到 \\\\sqlal01\\bk
                         ↓
         Secondary 從 \\\\sqlal01\\bk 還原備份
                         ↓
              兩邊資料一致，加入 AG
                         ↓
              Log Streaming 持續即時同步
\`\`\`

BK 目錄只用於初始化，同步完成後不再需要。

## 手動備份與 NORECOVERY 還原

AG Wizard 可自動執行備份還原（選 Full database and log backup），以下是手動步驟說明，有助排查問題。

### Primary（SQLFC）執行備份

\`\`\`sql
BACKUP DATABASE [AdventureWorks2022]
TO DISK = N'\\\\sqlal01\\bk\\W2022.bak'
WITH FORMAT, INIT, NAME = N'AdventureWorks2022-Full'
GO
\`\`\`

### Secondary（SQLAL01\\SQLSERVERBK）執行 NORECOVERY 還原

先確認備份中的邏輯名稱：

\`\`\`sql
RESTORE FILELISTONLY FROM DISK = N'\\\\sqlal01\\bk\\W2022.bak'
\`\`\`

再執行還原：

\`\`\`sql
RESTORE DATABASE [AdventureWorks2022]
FROM DISK = N'\\\\sqlal01\\bk\\W2022.bak'
WITH NORECOVERY,
     MOVE N'AdventureWorks2022_Data' TO N'F:\\MSSQL16.SQLFC\\MSSQL\\DATA\\AdventureWorks2022.mdf',
     MOVE N'AdventureWorks2022_Log'  TO N'F:\\MSSQL16.SQLFC\\MSSQL\\DATA\\AdventureWorks2022_log.ldf'
GO
\`\`\`

還原後 Secondary 的 AdventureWorks2022 顯示「**正在還原...**」（Restoring），這是正常現象。

> **為什麼要 NORECOVERY？**  
> RECOVERY 還原後資料庫可讀寫，但無法再套用後續 log。NORECOVERY 讓資料庫保持「待接收 log」狀態，AG 加入後才由 Primary 的 log streaming 接管同步。

若使用 Wizard 自動同步，上述步驟由 Wizard 代為執行，不需手動操作。

## AG Wizard 建立可用性群組

### 啟動精靈

SSMS 連線 Primary（SQLFC\\SQLFC）→ 展開 **AlwaysOn High Availability** → 右鍵「可用性群組」→ **新增可用性群組精靈**

### 指定選項

| 設定 | 值 |
|------|-----|
| 可用性群組名稱 | \`SQL-HA\` |
| 叢集類型 | Windows Server Failover Cluster |

### 選取資料庫

勾選 **AdventureWorks2022**（需為 Full Recovery Model，系統會驗證）。

### Specify Replicas（指定複本）

**Replicas 頁籤：**

| 設定 | Primary (SQLFC\\SQLFC) | Secondary (sqla01\\SQLSERVERBK) |
|------|----------------------|-------------------------------|
| 可用性模式 | 同步認可 | 非同步認可（Asynchronous commit） |
| 容錯移轉模式 | 自動 | 手動 |
| 可讀取次要複本 | 否 | 是（Yes） |

**Endpoints 頁籤：**

兩端 Endpoint port 預設皆為 **5022**，確認即可，不需修改。

**Backup Preferences 頁籤：**

設定備份偏好為 **Prefer Secondary**（偏好在次要複本執行備份，降低 Primary 負載）。

**Listener 頁籤：**

選「**Do not create an availability group listener now**」（不設 Listener，可事後另行建立）。

**Read-Only Routing：**

預設不設定，略過。

### Select Initial Data Synchronization

選「**Full database and log backup**」，指定共用路徑：

\`\`\`
\\\\sqla01\\BK
\`\`\`

Wizard 自動執行：Primary 備份 → 寫入共用路徑 → Secondary NORECOVERY 還原 → 兩端加入 AG → 啟動 Log Streaming。

若已手動做過 NORECOVERY 還原，可改選 **Join only**。

### Validation

| 驗證項目 | 預期結果 |
|---------|---------|
| 磁碟空間 | Success |
| 資料庫存在 Secondary | Success |
| 資料目錄存在 | Success |
| Endpoint 相容性 | Success |
| 共用網路位置 | Success |
| 可用性模式 | Success |
| Listener 設定 | Warning（未設 Listener，正常可忽略） |

### Summary 確認

摘要顯示關鍵設定：
- Availability group：\`SQL-HA\`
- Primary replica：\`SQLFC/SQLFC\`
- Cluster type：Windows Server Failover Cluster
- Backup location：\`\\\\sqla01\\BK\`

確認無誤後點 **Finish**。

### Results

成功後顯示：\`The wizard completed successfully.\`

Wizard 依序完成：建立 Login → 設定 Endpoints → 啟動 AlwaysOn_health session → 建立 AG → 驗證 WSFC 投票設定 → Secondary 加入 AG → 執行完整備份 → Secondary 還原備份與 Log。

---

## 驗證結果

建置完成後，Primary SSMS Object Explorer 中資料庫狀態顯示：

\`\`\`
AdventureWorks2022 (Synchronized)
\`\`\`

代表 Primary 與 Secondary 資料已完全同步，AG 正式運作。

### 實際資料同步驗證

除了觀察狀態欄位，可用以下方式做真實寫入驗證：

\`\`\`sql
-- 在 Primary（SQLFC）執行：故意產生除以零錯誤並記錄
BEGIN TRY
    SELECT 100/0
END TRY
BEGIN CATCH
    EXEC [dbo].[uspLogError]
END CATCH
GO

SELECT * FROM [dbo].[ErrorLog]
\`\`\`

執行後分別連線 SQLFC 和 SQLAL01，對兩台都執行：

\`\`\`sql
SELECT * FROM [dbo].[ErrorLog]
\`\`\`

兩邊查到同一筆錯誤紀錄 → Log Streaming 正常，AG 同步確認。

這比只看 \`(Synchronized)\` 狀態更直接，驗證的是真實資料寫入有被複製過去。

## 故障切換邏輯

| 狀態 | 說明 |
|------|------|
| 正常 | 所有讀寫走 Primary（SQLFC），Secondary 即時 Log Streaming 跟上 |
| SQLFC 故障 | AlwaysOn 偵測到 → 自動或手動切換 → SQLAL01 升格為 Primary |
| 切換後 | 資料幾乎無損失（依同步模式，Async 可能有少量延遲） |

---

## 建置過程排查紀錄

### [AG Wizard 驗證階段] 錯誤一：無法連線 Secondary

> 執行 AG 精靈時，精靈驗證 Secondary 節點連線失敗。

\`\`\`
Cannot connect to SQLAL01
Named Pipes Provider, error: 40
\`\`\`

**原因：** TCP/IP 未啟用，導致退而求其次用 Named Pipes 也失敗。

**解法：** 在 SQLAL01 的 SQL Server Configuration Manager 啟用 TCP/IP，確認防火牆開放 port 1433，重啟 SQL Server 服務。

---

### [AG Wizard 驗證階段] 錯誤二：目錄不存在

> 執行 AG 精靈時，精靈檢查 Secondary 資料目錄不符。

\`\`\`
The following required directories do not exist on replica sqlal01\\SQLSERVERBK:
F:\\MSSQL16.SQLFC\\MSSQL\\DATA
\`\`\`

**原因：** Secondary 沒有與 Primary 相同的資料夾路徑。

**解法：** 在 SQLAL01 手動建立 \`F:\\MSSQL16.SQLFC\\MSSQL\\DATA\`，並確認 SQL 服務帳號有完全控制權限。

---

### [初始同步階段] 錯誤三：共用路徑無法寫入

> AG 精靈執行初始備份還原時，Primary 無法寫入備份共用目錄。

\`\`\`
The primary server SQLFC\\SQLFC cannot write to '\\\\sqlal01\\BK\\...'
Backup failed for Server 'SQLFC'
\`\`\`

**原因：** SQLFC 的 SQL 服務帳號沒有寫入 \`\\\\sqlal01\\bk\` 的共用與 NTFS 權限。

**解法：**
1. 對 \`bk\` 資料夾右鍵 → 內容 → 共用 → 進階共用 → 權限 → 加入 SQL 服務帳號，給完全控制
2. 安全性（NTFS）→ 同樣加入服務帳號，給完全控制
`;export{e as default};