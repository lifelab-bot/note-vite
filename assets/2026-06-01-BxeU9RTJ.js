var e=`# Claude 問答紀錄｜2026-06-01

## 💡 其他｜Windows Server Failover Cluster 驗證「已啟用交換器的小組設定」失敗是什麼問題

**Q：** Failover Cluster Manager 跑驗證時，「驗證已啟用交換器的小組設定」失敗，節點是 Windows Server 2022 跑在 VMware VM 上，純 Failover Cluster（無 Hyper-V）。

**A：**

這個測試的設計目的是驗證叢集節點的 NIC Teaming 設定一致性，但在不同環境下失敗原因不同：

**WS2022 + LBFO**
Microsoft 在 WS2022 正式棄用 LBFO Teaming，驗證精靈遇到 LBFO 會直接 Failed。

**VMware VM 環境**
VM 裡不應做 Guest OS 層的 NIC Teaming，冗餘應交由 ESXi 層的 vSwitch 處理。正確架構是每個 VM 掛多張獨立 vNIC，各自對應不同用途的 Port Group（Management、Heartbeat、Storage 等）。

**純 Failover Cluster（無 Hyper-V）**
此測試底層查詢的是 Hyper-V 專用 WMI 命名空間 \`root\\virtualization\\v2\`。若節點未安裝 Hyper-V，該命名空間不存在，驗證會以「命名空間無效」失敗。這是設計上的誤判，**不影響叢集實際運作**。

---

## 💡 其他｜Failover Cluster 驗證失敗「命名空間無效」如何排查

**Q：** 驗證錯誤顯示「無法透過 WMI 連線到 DB01.aflab.lab，命名空間無效」，WMI 防火牆已開、Port 135 通了、WMI Repository 也是一致（\`winmgmt /verifyrepository\` 回傳正常），還是同樣錯誤，怎麼辦？

**A：**

排查流程：

\`\`\`powershell
# 1. 確認是否有 LBFO（應無）
Get-NetLbfoTeam

# 2. 測試 Port 135 連通性
Test-NetConnection DB02.aflab.lab -Port 135

# 3. 測試 WMI 遠端連線
Get-WmiObject -Class Win32_ComputerSystem -ComputerName DB02.aflab.lab

# 4. 確認 WMI Repository 狀態
winmgmt /verifyrepository

# 5. 確認是否未安裝 Hyper-V
Get-WindowsFeature Hyper-V
\`\`\`

若 Hyper-V 為 **Available（未安裝）**，錯誤原因就是測試查詢了不存在的 \`root\\virtualization\\v2\` 命名空間，屬於預期行為。

**結論：直接建叢集，驗證精靈跳出警示時選「繼續」即可。**

---

## 💡 其他｜VMware VM 上建 Windows Failover Cluster 的正確網路架構

**Q：** VMware VM 跑 Failover Cluster，NIC 要怎麼設定？

**A：**

| 層級 | 負責 Teaming |
|------|------|
| ESXi 主機 | vSwitch / dvSwitch 做實體網卡備援 |
| Windows Guest | **不做** LBFO / SET，直接用獨立 vNIC |

每個 VM 掛多張獨立 vNIC，各自對應不同 Port Group：

\`\`\`
vNIC 1 → Management 網路
vNIC 2 → Cluster Heartbeat 網路
vNIC 3 → Live Migration 網路（有 Hyper-V 時）
vNIC 4 → Storage 網路（需要時）
\`\`\`

Failover Cluster 靠多個獨立 vNIC 達到網路隔離，實體冗餘由 VMware 層處理，Guest OS 不需要 Teaming。

---

## 💡 其他｜SQL FCI 叢集服務 vs Failover Cluster Manager 管理介面有什麼差異

**Q：** 叢集建立之後會一直生效嗎？連到 Failover Cluster Manager 跟叢集有沒有生效是兩件事嗎？

**A：**

是兩件完全不同的事。

| 項目 | 說明 |
|------|------|
| **叢集服務（clussvc）** | Windows 服務，建立後持續在背景運作，開機自動啟動 |
| **Failover Cluster Manager** | 管理工具（MMC），關掉它叢集照常運作 |

Failover Cluster Manager 可從任何機器打開遠端連線到叢集，就像 vSphere Client 連 ESXi——關掉 Client 不影響 ESXi 運作。

確認叢集實際狀態：
\`\`\`powershell
Get-ClusterNode      # 節點是否 Up
Get-ClusterResource  # 資源是否 Online
\`\`\`

---

## 💡 其他｜SQL FCI 為何要從 FCM 重啟 SQL Server 而不能直接重啟 Windows 服務

**Q：** SQL Server FCI 安裝後，需要重啟 SQL Server 服務，為什麼要從 Failover Cluster Manager 重啟，不能直接去 Windows 服務重啟？

**A：**

SQL Failover Cluster Instance 的 SQL Server 是一個**叢集資源**，不是普通的 Windows 服務。

直接從 Windows 服務停止 SQL Server → 叢集偵測到資源離線 → 判斷節點故障 → 觸發 Failover 切換到另一台。

從 FCM 重啟 → 叢集知道這是有意為之的操作 → 正常重啟，不觸發 Failover。

所有 SQL FCI 的啟停操作都應透過 Failover Cluster Manager 執行。

---

## 💡 其他｜SQL Server 具名執行個體為何連 port 1433 無效，如何改為靜態 port

**Q：** SQL Server FCI 具名執行個體（如 \`SQLFC\\SQLFC\`）從另一台連不到，即使開了防火牆 port 1433 也無效，原因是什麼？

**A：**

SQL Server **具名執行個體**預設使用**動態 port**，不是 1433。port 1433 是預設執行個體（\`MSSQLSERVER\`）的標準 port。

動態 port 的問題：
- 每次 SQL Server 啟動 port 可能不同
- 客戶端需要 **SQL Server Browser 服務**才能找到正確 port
- 防火牆難以固定開放

**改為靜態 port 的步驟：**

1. SQL Server Configuration Manager → SQL Server 網路設定 → SQLFC 的通訊協定 → TCP/IP → 內容
2. IP 位址 → IPAll：
   - \`TCP 動態通訊埠\` → **清空**
   - \`TCP 通訊埠\` → 填 \`1433\`
3. 從 FCM 重啟 SQL Server 資源
4. 防火牆開放 port 1433：
   \`\`\`powershell
   New-NetFirewallRule -DisplayName "SQL Server 1433" -Direction Inbound -Protocol TCP -LocalPort 1433 -Action Allow
   \`\`\`
5. 兩台節點都要做（Failover 後另一台也需要正確設定）

連線時需明確指定 port：\`SQLFC\\SQLFC,1433\`

---

## 💡 其他｜SQL FCI 共用儲存概念與 Failover 驗證方法

**Q：** SQL FCI Failover 後資料還在嗎？怎麼驗證叢集運作正常？

**A：**

**FCI 共用儲存概念：**

\`\`\`
DB01（Active）→ 寫入資料 → 存到共用磁碟
      ↓ Failover
DB02（變 Active）→ 接管共用磁碟 → 資料還在
\`\`\`

同一時間只有 Active 節點跑 SQL，但資料存在兩台都能存取的共用磁碟上。客戶端永遠連虛擬名稱（\`SQLFC\`），不需知道背後是哪台節點。

這與 Always On AG 不同——AG 是透過 log 複製到另一台，FCI 是共用同一個磁碟。

**驗證方式：**

\`\`\`sql
-- 確認叢集節點狀態
SELECT * FROM sys.dm_os_cluster_nodes

-- 確認目前 Active 節點
SELECT @@SERVERNAME
\`\`\`

完整 Failover 測試流程：
1. 在 SQLFC 建 Table 並插入資料
2. FCM 手動移轉到另一台節點
3. SSMS 重新連 SQLFC，確認資料仍在、\`@@SERVERNAME\` 還是回傳 \`SQLFC\`
`;export{e as default};