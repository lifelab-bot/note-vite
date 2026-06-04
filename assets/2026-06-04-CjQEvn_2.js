var e=`## 💡 其他｜SQL Server 通訊協定：Browser、TCP/IP、Named Pipes 的差異

**Q：** SQL Server Browser、TCP/IP、Named Pipes 分別是什麼？都要開嗎？

**A：**

| 項目 | 用途 | 需要開？ |
|------|------|---------|
| SQL Server Browser | 名稱解析，告訴客戶端 SQL 在哪個 port | 建議開 |
| TCP/IP | 標準網路連線，走 IP + port | 必須開 |
| Named Pipes | 早期 Windows 本機通訊，走 UNC 路徑 | 不需要 |

AlwaysOn AG 跨機器通訊必須靠 TCP/IP。Named Pipes 在跨機器環境效能差、容易被防火牆擋，不需要啟用。用機器名稱連線時 Browser 才需要；改用 \`server,1433\` 格式則可不開。

---

## 💡 其他｜AlwaysOn AG 與 FCI：iSCSI 磁碟要不要共用？

**Q：** 我做了 Windows Cluster 並用 iSCSI 磁碟，Secondary 也需要掛 iSCSI 嗎？

**A：**

FCI 和 AlwaysOn AG 的磁碟架構完全不同：

- **FCI**：共用同一顆 iSCSI/SAN 磁碟，同一時間只有一個節點掛載，Cluster 切換時磁碟所有權跟著移轉
- **AlwaysOn AG**：每個節點有自己獨立的存儲，資料同步靠 SQL Server Log Streaming 透過網路傳送，**完全不需要共用磁碟**

Secondary 需要自己的 F: 槽（另外掛一顆獨立 iSCSI LUN 或本機磁碟），不能把 Primary 的那顆共用 LUN 也掛給 Secondary，否則資料會衝突損毀。

---

## 💡 其他｜AlwaysOn AG 為什麼 Secondary 要加入 Windows Cluster？

**Q：** SQLAL01（Secondary）不是 FCI，為什麼還要加入 Windows Cluster？

**A：**

AlwaysOn AG 的必要條件：**所有 Replica 的機器都必須是同一個 WSFC 的成員**，否則 AG 根本建不起來。

但「加入 Cluster」不等於「共用 Cluster 磁碟」：

| 機器 | Cluster 角色 | 磁碟 |
|------|-------------|------|
| DB01 | Cluster 節點 | 共用 iSCSI（給 SQLFC 用） |
| DB02 | Cluster 節點 | 共用 iSCSI（給 SQLFC 用） |
| SQLAL01 | Cluster 節點 | 自己獨立的 F: 槽 |

SQLAL01 加入 Cluster 只是取得「資格」讓 AG 認識它，SQL 資料還是放在自己的磁碟，不碰那顆共用 iSCSI。

---

## 💡 其他｜AlwaysOn AG 建置前為什麼要先備份到 BK 目錄？

**Q：** 建置 AG 前為什麼要先備份到 bk 目錄？Log Streaming 不是會同步嗎？

**A：**

Log Streaming 只傳**之後發生的變化**，不會傳「整個資料庫現在長什麼樣」。Secondary 一開始是空的，需要先有一份完整資料才能開始同步。

用搬家比喻：

- **BK 目錄（貨車停車場）**：Primary 打完整備份放到 bk → Secondary 從 bk 還原 → 兩邊資料一致 → 搬家完成
- **Log Streaming（每天的快遞）**：之後 Primary 每次有新資料寫入，即時傳給 Secondary 套用

BK 目錄只用於初始化那一次，之後就沒意義了。

| 階段 | 用什麼 |
|------|--------|
| AG 建立當下 | BK 目錄（一次性搬家） |
| AG 建立之後 | Log Streaming（長期即時同步） |

---

## 💡 其他｜SQL AlwaysOn AG 整體架構與運作方式

**Q：** SQL AlwaysOn 到底在幹嗎？

**A：**

**平常狀態（沒出事）**

\`\`\`
應用程式 → SQLFC（Primary）← 負責所有讀寫
                  ↓ 即時 Log Streaming
             SQLAL01（Secondary）← 隨時跟著同步
\`\`\`

**出事時（Primary 掛了）**

\`\`\`
SQLFC 掛掉 ❌
AlwaysOn 偵測到 → 自動或手動切換
→ SQLAL01 升格為 Primary → 服務繼續
\`\`\`

SQLAL01 因為一直在同步，資料幾乎沒有損失。

**一句話總結：** AlwaysOn AG 就是讓資料庫有一個隨時準備好接班的備用機，主機掛掉時能快速切換不中斷服務。
`;export{e as default};