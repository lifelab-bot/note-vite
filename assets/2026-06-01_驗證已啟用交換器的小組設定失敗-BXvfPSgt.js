var e=`# Failover Cluster｜驗證已啟用交換器的小組設定 失敗排查

> 環境：Windows Server 2022 × VMware VM × 純 Failover Cluster（無 Hyper-V）

---

## 問題描述

在 Failover Cluster Manager 執行「驗證設定精靈」時，以下測試失敗：

\`\`\`
驗證已啟用交換器的小組設定
無法透過 WMI 連線到 DB01.aflab.lab，命名空間無效
\`\`\`

---

## 排查流程

### 1. 確認是否有 LBFO Teaming

\`\`\`powershell
Get-NetLbfoTeam
\`\`\`

無輸出 → 沒有 LBFO，排除 Teaming 設定問題。

### 2. 確認 Port 135 連通

\`\`\`powershell
Test-NetConnection DB02.aflab.lab -Port 135
\`\`\`

\`TcpTestSucceeded: True\` → 網路沒問題。

### 3. 確認 WMI 遠端連線

\`\`\`powershell
Get-WmiObject -Class Win32_ComputerSystem -ComputerName DB02.aflab.lab
\`\`\`

能正確回傳資料 → WMI 本身可用。

### 4. 確認 WMI Repository 狀態

\`\`\`powershell
winmgmt /verifyrepository
\`\`\`

回傳「WMI 存放庫一致」→ Repository 無損壞。

### 5. 確認 Hyper-V 安裝狀態

\`\`\`powershell
Get-WindowsFeature Hyper-V
\`\`\`

Install State 為 **Available（未安裝）** → 找到根本原因。

---

## 根本原因

「驗證已啟用交換器的小組設定」這個測試底層查詢的是 **Hyper-V 專用 WMI 命名空間**：

\`\`\`
root\\virtualization\\v2
\`\`\`

Switch Embedded Teaming（SET）是 Hyper-V 功能，未安裝 Hyper-V 的節點不存在此命名空間，驗證因此報「命名空間無效」。

---

## 結論

| 項目 | 說明 |
|------|------|
| 是否影響叢集功能 | **否** |
| 是否需要修復 | **否** |
| 原因 | 純 Failover Cluster 不需要 SET，測試設計針對 Hyper-V 主機 |
| 處理方式 | 驗證精靈跳出警示時選「繼續」，直接建立叢集 |

---

## SQL Server 2022 Failover Cluster 安裝被擋住（KB953748）

### 問題

Windows Failover Cluster 建好後，安裝 SQL Server 2022 容錯移轉叢集時出現：

\`\`\`
規則 "Microsoft Cluster Service (MSCS) 叢集驗證錯誤" 失敗
叢集未經過驗，或者驗證報告中出現錯誤或失敗。請參閱 KB953748
\`\`\`

### 原因

SQL Server 安裝精靈會讀取最近一次的叢集驗證報告，只要報告中有任何 **Failed**，就擋住安裝。「驗證已啟用交換器的小組設定」的 Failed 就是觸發點。

> ⚠️ Windows Failover Cluster 本身可以在有 Failed 的情況下建立，但 SQL Server 安裝不行。

### 解法：重跑驗證並排除失敗測試

1. Failover Cluster Manager → 右鍵叢集 → **驗證叢集**
2. 測試選項選「**執行我選取的測試**」
3. 取消勾選「**網路**」類別（包含「驗證已啟用交換器的小組設定」）
4. 跑完驗證 → 報告無 Failed（有 Warning 沒關係）
5. 重新執行 SQL Server 安裝精靈 → 通過

### 重點

| 項目 | SQL Server 安裝結果 |
|------|------|
| 驗證報告有 Failed | ❌ 擋住 |
| 驗證報告有 Warning | ✅ 放行 |
| 驗證報告全部通過 | ✅ 放行 |

---

## 叢集建立後是否一直生效？管理介面與叢集運作的關係

### 叢集服務 vs 管理介面

這是兩件完全不同的事：

| 項目 | 說明 |
|------|------|
| **叢集服務（clussvc）** | Windows 服務，建立後持續在背景運作，開機自動啟動 |
| **Failover Cluster Manager** | 管理工具（MMC），關掉它叢集照常運作 |

\`\`\`
叢集是否生效  ≠  你有沒有連上管理介面
\`\`\`

Failover Cluster Manager 可以從任何一台機器打開，遠端連線到叢集管理，就像 vSphere Client 連 ESXi 一樣，關掉 Client 不影響 ESXi 運作。

### 確認叢集實際狀態

\`\`\`powershell
Get-ClusterNode      # 節點是否 Up
Get-ClusterResource  # 資源是否 Online
\`\`\`

節點都是 **Up**、資源都是 **Online** → 叢集正常運作中。

---

## SSMS 無法連線到 SQL Failover Cluster（Error 40 Named Pipes）

### 問題

SQL Server Failover Cluster 安裝完成後，用 SSMS 連線到叢集虛擬名稱（如 \`SQLFC\`）失敗：

\`\`\`
Cannot connect to SQLFC.
Named Pipes Provider, error: 40 - Could not open a connection to SQL Server
Error Number: 2, Severity: 20
\`\`\`

### 排查

\`\`\`powershell
# 確認叢集資源狀態
Get-ClusterResource

# 確認虛擬名稱可解析
ping SQLFC
\`\`\`

叢集資源全部 Online、ping 通 → 問題在 SQL Server 本身未啟用 TCP/IP。

### 原因

SQL Server 2022 安裝後 **TCP/IP 通訊協定預設停用**，SSMS 嘗試用 Named Pipes 連線但也未啟用，導致無法連線。

### 解法

**Step 1：SQL Server Configuration Manager 啟用 TCP/IP**

1. 開啟 **SQL Server Configuration Manager**
2. 左側 → SQL Server 網路設定 → **MSSQLSERVER 的通訊協定**
3. 右鍵 **TCP/IP** → **啟用**

**Step 2：從 Failover Cluster Manager 重啟 SQL Server 資源**

\`\`\`
Failover Cluster Manager → SQL Server (SQLFC) → 右鍵 → 重新啟動
\`\`\`

> ⚠️ 不能從 Windows 服務直接重啟，否則叢集判斷節點故障會觸發 Failover 切換到另一台。

SQL Failover Cluster Instance 的服務是叢集資源，所有啟停操作都應透過 Failover Cluster Manager 執行。

---

## SQL 具名執行個體動態 Port 問題與靜態 Port 設定

### 問題

從另一台節點（DB02）連到 \`SQLFC\\SQLFC,1433\` 逾時，即使已開防火牆 port 1433 也無效。

### 原因

SQL Server **具名執行個體**預設使用**動態 port**，不是 1433。port 1433 是預設執行個體（MSSQLSERVER）的標準 port。客戶端需要 SQL Server Browser 服務才能找到動態 port，FCI 環境中 Browser 通常不作為叢集資源，導致連線失敗。

確認實際監聽 port：
\`\`\`powershell
netstat -an | findstr 1433
\`\`\`

### 解法：改為靜態 Port 1433

**兩台節點都要設定：**

1. SQL Server Configuration Manager → SQL Server 網路設定 → SQLFC 的通訊協定 → **TCP/IP → 內容**
2. IP 位址 → **IPAll**：
   - \`TCP 動態通訊埠\` → 清空
   - \`TCP 通訊埠\` → \`1433\`
3. 儲存後從 **FCM 重啟 SQL Server 資源**

**防火牆開放 port 1433（兩台都要做）：**

\`\`\`powershell
New-NetFirewallRule -DisplayName "SQL Server 1433" -Direction Inbound -Protocol TCP -LocalPort 1433 -Action Allow
\`\`\`

**連線格式：**

\`\`\`
SQLFC\\SQLFC,1433
\`\`\`

---

## FCI 驗證：共用儲存與 Failover 測試

### 共用儲存概念

\`\`\`
DB01（Active）→ 寫入資料 → 共用磁碟
      ↓ Failover
DB02（變 Active）→ 接管共用磁碟 → 資料仍在
\`\`\`

FCI 資料只有一份，存在共用磁碟上，不是複製。客戶端永遠連虛擬名稱 \`SQLFC\`，不需知道背後是哪台節點。

### 快速驗證指令

\`\`\`sql
-- 確認叢集節點與狀態
SELECT * FROM sys.dm_os_cluster_nodes

-- 確認目前 Active 節點
SELECT @@SERVERNAME
\`\`\`

### 完整 Failover 測試流程

1. 連 \`SQLFC\\SQLFC,1433\`，建 Table 並插入資料
2. FCM → SQL Server (SQLFC) → 右鍵 → **移動 → 選 DB02**
3. SSMS 重新連 \`SQLFC\\SQLFC,1433\`
4. 查詢 Table → 資料還在，\`@@SERVERNAME\` 回傳 \`SQLFC\` → **FCI 驗證成功**

---

## VMware VM 上 Failover Cluster 正確網路架構

VM 內**不做** NIC Teaming，冗餘由 ESXi 層處理：

| 層級 | 負責 |
|------|------|
| ESXi 主機 | vSwitch / dvSwitch 做實體網卡備援 |
| Windows Guest | 獨立 vNIC，不做 LBFO / SET |

每個 VM 各 vNIC 對應不同 Port Group：

\`\`\`
vNIC 1 → Management 網路
vNIC 2 → Cluster Heartbeat 網路
vNIC 3 → Storage 網路（視需求）
\`\`\`
`;export{e as default};