var e=`# 企業儲存架構概念：DAS、NAS、SAN

> 儲存知識涵蓋三個獨立維度：**在哪裡**（架構）、**怎麼存取**（層級）、**用什麼傳**（協定），了解三者差異才能正確解讀各種部署情境。

---

## 一、儲存架構（Where）

### DAS（Direct Attached Storage）

儲存裝置直接連接單一主機，不經過網路交換器。

- **存取層級**：Block-level（原始磁碟）或 File-level（由 OS 管理）
- **優點**：延遲低、設定簡單、資料隔離安全
- **缺點**：擴充性差、資源孤島（容量浪費）、不易共享

---

### NAS（Network Attached Storage）

擁有專屬 OS 與 File System 的儲存裝置，透過 TCP/IP 區域網路提供服務。

- **存取層級**：File-level（透過 SMB/CIFS、NFS 分享）
- **優點**：跨平台檔案共享容易（Windows、Mac、Linux），成本低，管理簡單
- **缺點**：延遲較高（網路封裝開銷），不適合高頻隨機 I/O（例如資料庫）

---

### SAN（Storage Area Network）

高速專用網路，將主機與儲存裝置互連。分為 FC-SAN（光纖通道）與 IP-SAN（iSCSI）。

- **存取層級**：Block-level（主機看到的是原始 LUN，等同本地磁碟）
- **優點**：極高效能、低延遲、支援 LAN-free 備份、高度擴充
- **缺點**：成本極高（FC 交換器、HBA 卡）、建置複雜、需要專業技能

---

## 二、存取層級（How）

| 特性 | File-level（檔案層級） | Block-level（區塊層級） |
|:---|:---|:---|
| **File System 位置** | 由**儲存裝置端**管理 | 由**主機端**格式化管理 |
| **主機感知** | 網路分享資料夾（如 \`\\\\nas\\share\`）| 本地磁碟（如 \`C:\`、\`/dev/sdb\`）|
| **資料單位** | 整份檔案 / Payload | 固定大小原始 Block（如 4KB、8KB）|
| **適用場景** | 辦公室檔案共享、媒體串流、備份 | 資料庫（SQL）、虛擬化（VMware、Hyper-V）|
| **核心優勢** | 天生支援多用戶端同時存取 | 最高 I/O 吞吐量、最低延遲 |

---

## 三、介面與協定（What）

### SCSI（Small Computer System Interface）

傳統實體介面與指令集標準。

- 透過專用並行排線短距傳輸，距離限制數公尺
- 實體介面已淘汰，但 **SCSI 指令集仍是業界基礎**（iSCSI 即基於此延伸）

---

### iSCSI（Internet SCSI）

IP-SAN 的核心協定。

- 將 SCSI 指令封裝進 TCP/IP 封包，透過標準乙太網路傳輸
- **消除距離限制**，讓 Block-level 儲存可用一般網路線實現，成本大幅降低

---

### SAS（Serial Attached SCSI）

企業級實體硬碟介面標準。

- 點對點序列架構，取代並行 SCSI
- 速度達 12G / 24G，支援雙埠備援
- 適用於伺服器內部磁碟、DAS 陣列、SAN 陣列

---

## 四、維度釐清與組合範例

三個維度各自獨立，可自由組合：

| 維度 | 代表技術 |
|:---|:---|
| **架構（Where）** | DAS、NAS、SAN |
| **存取層級（How）** | File-level、Block-level |
| **介面 / 協定（What）** | SCSI、iSCSI、SAS |

### 範例 A

**SAS 硬碟**（介面）+ **DAS**（架構）：儲存陣列裝滿 SAS 硬碟，透過外接 SAS 線直連伺服器。

### 範例 B

**SAS 硬碟**（介面）+ **iSCSI**（協定）+ **IP-SAN**（架構）：相同陣列改透過乙太網路以 iSCSI 協定將 LUN 呈現給 VMware 主機，主機端仍看到 Block-level 原始磁碟。

---

*整理自企業儲存知識庫，適用於基礎架構工程師建立概念框架。*
`;export{e as default};