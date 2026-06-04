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

### 1. Secondary 加入 Windows Cluster

AlwaysOn AG 要求所有 Replica 節點都是同一個 WSFC 的成員，否則 AG Wizard 無法運作。

SQLAL01 加入 Cluster 只是取得「資格」，不需要存取共用磁碟。

### 2. Secondary 建立資料目錄

AG Wizard 驗證時會檢查 Secondary 是否有與 Primary 相同的資料夾路徑。

在 SQLAL01 建立：
\`\`\`
F:\\MSSQL16.SQLFC\\MSSQL\\DATA
\`\`\`

路徑命名規則：\`F:\\MSSQL{版本}.{Primary實例名稱}\\MSSQL\\DATA\`

### 3. 啟用 SQL Server TCP/IP

在 SQLAL01 的 SQL Server Configuration Manager 確認 TCP/IP 已啟用，SQL Server Browser 服務正在執行。

### 4. 建立備份共用目錄

在 SQLAL01 建立 \`bk\` 資料夾並設為 Windows 共用，讓 Primary 可以把初始備份寫入，Secondary 再從中還原。

**服務帳號權限（兩者都要加）：**

| 帳號 | 需要的權限 | 原因 |
|------|----------|------|
| SQLFC 的 SQL 服務帳號（\`AFLAB\\sqlsvs\`） | 完全控制 | 要把備份寫進去 |
| SQLAL01 的 SQL 服務帳號（\`AFLAB\\sqlsvs\`） | 讀取 | 要從中還原備份 |

若兩台服務帳號相同，只需加一個帳號並給完全控制。

## Validation 常見錯誤

### 錯誤一：無法連線 Secondary

\`\`\`
Cannot connect to SQLAL01
Named Pipes Provider, error: 40
\`\`\`

**原因：** TCP/IP 未啟用，導致退而求其次用 Named Pipes 也失敗。

**解法：** 在 SQLAL01 的 SQL Server Configuration Manager 啟用 TCP/IP，確認防火牆開放 port 1433，重啟 SQL Server 服務。

---

### 錯誤二：目錄不存在

\`\`\`
The following required directories do not exist on replica sqlal01\\SQLSERVERBK:
F:\\MSSQL16.SQLFC\\MSSQL\\DATA
\`\`\`

**原因：** Secondary 沒有與 Primary 相同的資料夾路徑。

**解法：** 在 SQLAL01 手動建立 \`F:\\MSSQL16.SQLFC\\MSSQL\\DATA\`，並確認 SQL 服務帳號有完全控制權限。

---

### 錯誤三：共用路徑無法寫入

\`\`\`
The primary server SQLFC\\SQLFC cannot write to '\\\\sqlal01\\BK\\...'
Backup failed for Server 'SQLFC'
\`\`\`

**原因：** SQLFC 的 SQL 服務帳號沒有寫入 \`\\\\sqlal01\\bk\` 的共用與 NTFS 權限。

**解法：**
1. 對 \`bk\` 資料夾右鍵 → 內容 → 共用 → 進階共用 → 權限 → 加入 SQL 服務帳號，給完全控制
2. 安全性（NTFS）→ 同樣加入服務帳號，給完全控制

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
`;export{e as default};