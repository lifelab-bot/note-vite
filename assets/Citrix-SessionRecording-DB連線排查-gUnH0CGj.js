var e=`# Citrix Session Recording — DB 連線失敗排查紀錄

**日期**：2026-06-12
**症狀**：Session Recording 無法產出錄影檔、Policy Console 無法連線（HTTP 500）、Player 搜尋失敗

---

## 問題根因

Session Recording Broker 無法連線至 SQL Server，Event ID 2038：

> Named Pipes Provider, error 40 - 無法開啟至 SQL Server 的連線

**真正根因**：Session Recording 元件為 **32-bit**，實際讀取的 Registry 路徑在 \`WOW6432Node\`，而非一般 64-bit 路徑。WOW6432Node 的 \`SmAudDatabaseInstance\` 值未加 \`tcp:\` 前綴，導致 Client 強制嘗試 Named Pipes 失敗。

---

## 排查過程

| 步驟 | 確認結果 |
|------|----------|
| Agent 服務狀態 | 正常 |
| SQL Server 服務 | 正常 |
| Named Pipes 啟用（SQL Server 端） | 已啟用並重啟 |
| ODBC 連線測試 | 成功（確認網路 TCP 通） |
| 機器帳號存在於 SQL DB | 存在（Network Service 走 \`網域\\機器名稱$\`） |
| 機器帳號 is_disabled | 0（正常） |
| DNS 解析 SQL Server 主機名稱 | 正常 |
| Test-NetConnection Port 1433 | TcpTestSucceeded: True |
| IIS / W3SVC 狀態 | 正常 |
| Broker WSDL 本機測試 | 有回應 XML（Broker 本身正常） |

---

## 關鍵發現

### 1. Registry 路徑（32-bit vs 64-bit）

Session Recording 元件為 32-bit，實際讀取路徑：

\`\`\`
HKLM\\SOFTWARE\\WOW6432Node\\Citrix\\SmartAuditor\\Database
→ SmAudDatabaseInstance
\`\`\`

一般誤認的 64-bit 路徑（不是這個）：

\`\`\`
HKLM\\SOFTWARE\\Citrix\\SmartAuditor\\Server
→ SmAudDatabaseInstance
\`\`\`

### 2. 連線字串格式

| | 值 |
|--|--|
| 原始值 | \`主機名稱\\MSSQLSERVER,1433\` |
| 修正後 | \`tcp:主機名稱,1433\` |

\`tcp:\` 前綴強制走 TCP/IP，不再嘗試 Named Pipes。

---

## 處置步驟

**1. 修改 WOW6432Node Registry**

\`\`\`
路徑：HKLM\\SOFTWARE\\WOW6432Node\\Citrix\\SmartAuditor\\Database
Key：SmAudDatabaseInstance
改成：tcp:[SQL Server 主機名稱],1433
\`\`\`

**2. 重啟服務**

\`\`\`
services.msc → Citrix Session Recording Storage Manager → 重新啟動
iisreset
\`\`\`

---

## SQL 帳號確認指令

\`\`\`sql
-- 確認機器帳號存在於 DB
SELECT * FROM sys.database_principals WHERE type IN ('U','S','G')

-- 確認 Server 層級 Login 狀態
SELECT name, is_disabled FROM sys.server_principals WHERE name LIKE '%機器名稱%'
\`\`\`

---

## 附記

- 服務帳號為 **Network Service**，連 SQL 時使用機器帳號：\`網域\\機器名稱$\`
- ODBC 測試走 TCP/IP 所以過了，Broker 走 Named Pipes 所以失敗，兩者使用不同協定
- Named Pipes 突然失敗的外部根因待確認（防火牆規則變更？Windows Update？）
- 已開 Ticket 持續追蹤
`;export{e as default};