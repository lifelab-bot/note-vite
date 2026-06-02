var e=`# SQL Server FCI Lab 建置紀錄

## Lab 目標

在 VMware vSphere 上建立一套 **SQL Server 2022 Failover Cluster Instance（FCI）** 環境，驗證資料庫高可用性架構——當 Active 節點發生故障，SQL 能自動切換至 Passive 節點並保留資料。

## 環境

| 項目 | 說明 |
|------|------|
| 平台 | VMware vSphere |
| 作業系統 | Windows Server 2022 |
| 資料庫 | SQL Server 2022 |
| 網域控制器 | AD01 |
| 叢集節點 | DB01、DB02（加域） |
| 共用儲存 | iSCSI Server（未加域） |
| 叢集虛擬名稱 | SQLFC |
| 管理端 | Win11 + SSMS |

## 叢集與網域

Windows Failover Cluster 需要 Active Directory 網域，叢集節點（DB01、DB02）必須加域，叢集使用 AD 做驗證，虛擬網路名稱（SQLFC）也需要在 AD / DNS 註冊。iSCSI 儲存伺服器不需要加域，iSCSI 協定走獨立的儲存網路，不依賴 AD 驗證。

## 建置流程

**1. iSCSI 共用儲存**
在 iSCSI Server 上建立虛擬磁碟（SQLServerCluster.vhdx），DB01 與 DB02 透過 iSCSI 連線掛載同一顆磁碟，作為 SQL FCI 的共用儲存。

**2. Windows Failover Cluster 建立**
在 DB01、DB02 安裝 Failover Clustering 功能，執行**叢集驗證精靈**確認通過後，才建立 Windows Failover Cluster。

**3. SQL Server 2022 FCI 安裝**
SQL FCI 不需要事先安裝獨立版 SQL Server。在 DB01 執行 SQL Server 安裝程式選「新增容錯移轉叢集安裝」，設定叢集虛擬名稱（SQLFC）、IP 與共用磁碟。完成後在 DB02 選「將節點加入叢集」。

**4. SSMS 連線設定**
SQL Server 2022 預設停用 TCP/IP 且具名執行個體使用動態 port，需在 SQL Server Configuration Manager 啟用 TCP/IP 並改為靜態 port 1433，開放防火牆後從 FCM 重啟 SQL Server 資源。

**5. Failover 驗證**
建立測試資料庫 ClusterDatabase，建立 Table 並插入資料，關閉 DB01 觸發 Failover，重連 SQLFC 確認資料保留且 DB02 接管成功。

## 驗證結果

| 項目 | 結果 |
|------|------|
| DB01 故障後自動切換至 DB02 | ✅ |
| 虛擬名稱 SQLFC 持續可用 | ✅ |
| 資料完整保留 | ✅ |

---

## 建置過程排查紀錄

> 以下記錄建置過程中遇到的問題與解法。

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

## SQL FCI Failover 實測驗證（完整流程）

### 測試目標

確認 SQL FCI Failover 功能正常：Active 節點關閉後，SQL 自動切換到 Passive 節點，且資料完整保留。

### Failover 前準備

\`\`\`sql
-- 建立測試資料庫與資料表
CREATE DATABASE [ClusterDatabase]
USE [ClusterDatabase]

-- 定義 Table 格式
-- [Id]：INT IDENTITY(1,1) → 自動產生流水號，INSERT 時不需手動填
-- [Name]：NVARCHAR(50) → 要填入的欄位
-- CONSTRAINT PK_Table：設定 [Id] 為主鍵
CREATE TABLE [dbo].[Table]
(
    [Id]   INT          IDENTITY(1,1),
    [Name] NVARCHAR(50),
    CONSTRAINT [PK_Table] PRIMARY KEY CLUSTERED ([Id])
)

-- 插入測試資料（在 Active 節點 DB01 上執行）
INSERT INTO [dbo].[Table] ([Name]) VALUES ('Test Failover')

-- 確認節點狀態（DB01 為 Active）
SELECT * FROM [sys].[dm_os_cluster_nodes]
-- DB01: is_current_owner = 1
-- DB02: is_current_owner = 0

SELECT @@SERVERNAME
-- 回傳 SQLFC\\SQLFC
\`\`\`

### 觸發 Failover

直接關閉 DB01（模擬節點故障）。

SSMS 顯示：
\`\`\`
The connection is broken and recovery is not possible.
The client driver attempted to recover the connection one or more times and all attempts failed.
\`\`\`
→ 短暫斷線為預期行為。

### Failover 後驗證

重新連線 \`SQLFC\\SQLFC,1433\` 後執行：

\`\`\`sql
SELECT * FROM [dbo].[Table]
SELECT * FROM [sys].[dm_os_cluster_nodes]
SELECT @@SERVERNAME
\`\`\`

結果：

| 項目 | 結果 |
|------|------|
| Table 資料 | ✅ 'Test Failover' 仍存在 |
| Active 節點 | ✅ DB02（is_current_owner=1） |
| DB01 狀態 | down → joining → up（重新加入） |
| @@SERVERNAME | ✅ SQLFC\\SQLFC（虛擬名稱不變） |

### 結論

**SQL FCI Failover 驗證通過。** 節點故障後叢集自動切換，資料完整保留，客戶端重連後繼續使用相同虛擬名稱，無需感知背後節點變化。

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

**補充：為什麼 DB02 的 SQL Server 服務都是停止狀態？**

這是正常現象。SQL FCI 同一時間只有一台節點是 Active（Owner），SQL Server 所有服務（含 SQL Server Browser）只在 Active 節點上運行。DB02 是 Passive 節點，服務停著是設計如此，不需要手動啟動。

確認哪台是 Active（Owner）：
\`\`\`sql
SELECT * FROM [sys].[dm_os_cluster_nodes]
-- is_current_owner = 1 → 該節點是 Active
\`\`\`

Failover 發生後 DB02 變成 Active，SQL 服務才會在 DB02 啟動。

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