var e=`# NetScaler 資安弱點掃描外部驗證流程

資安弱點掃描報告標記某站台有 TLS 相關弱點（支援已淘汰的 TLSv1.0/1.1、cipher 不支援 Forward Secrecy），但登入 NetScaler 查證設定看起來明明是乾淨的。為什麼會這樣？

---

## 為什麼內部查證跟掃描報告對不上

很多企業環境是 **Split-DNS**：同一個網域名稱，內部網路解析出來的 IP，跟外部網際網路解析出來的 IP 不一樣。

弱點掃描工具是從網際網路對**外部公開 IP** 掃描；但如果你人在內網，登入 NetScaler 查到的是**內部 VIP** 的設定。兩邊測的根本不是同一個目標，設定當然對不上。

所以光靠內部設備查證不夠，還要**站在外部網際網路的角度**重新驗證一次，才能真正回應掃描報告的發現。

---

## 三個工具，由簡入繁

### 1. \`nslookup\`：先搞清楚外部到底連到哪個 IP

\`\`\`
nslookup internal-app.example.com
\`\`\`

目的：取得**外部**實際解析出來的公開 IP。如果這個 IP 跟內網解析出來的不一樣，就證實了是 Split-DNS，代表接下來要測的目標是這個外部 IP，而不是內部查到的 VIP。

順便也能看出 CNAME 關係——例如兩個網域名稱，其中一個只是 CNAME 指到另一個，代表它們共用同一組後端服務，不需要分開查證。

### 2. \`openssl s_client -connect host:443 -tls1\`：單點快速驗證

\`\`\`
openssl s_client -connect internal-app.example.com:443 -tls1
\`\`\`

\`-tls1\` 這個參數是**強制指定用 TLSv1.0** 去握手。這條指令用來快速驗證「弱點報告說的舊協定到底還在不在」，一翻兩瞪眼：

- 連得上、握手成功 → 該協定還開著，弱點仍然存在
- 出現類似 \`error: no protocols available\` → 伺服器拒絕用該協定握手，代表已經關閉

**缺點**：一次只能測一個協定版本。要測 TLSv1.1 就得換成 \`-tls1_1\`，要看支援哪些 cipher 又得另外一條條測，效率低，也不適合直接當成正式報告的佐證資料。

### 3. \`nmap --script ssl-enum-ciphers -p 443 host\`：一次做完整外部稽核

\`\`\`
nmap --script ssl-enum-ciphers -p 443 internal-app.example.com
\`\`\`

一個指令自動列出：

- 目標支援的**所有** TLS 版本
- 每個版本底下**所有**支援的 cipher
- 每條 cipher 的強度評級（A / B / C…）
- 整體最弱評級（\`least strength\`）

結果完整、可重複執行、格式清楚，比 openssl 單點測試更適合當成正式稽核報告的佐證依據。

---

## 小結

| 工具 | 用途 | 適合階段 |
|---|---|---|
| \`nslookup\` | 確認外部實際解析 IP、是否為 Split-DNS | 前置偵查 |
| \`openssl s_client -tls1\` | 快速手動驗證某個舊協定是否還開著 | 抽查/初步確認 |
| \`nmap --script ssl-enum-ciphers\` | 完整列出協定＋cipher＋強度評級 | 正式稽核佐證 |

**實務流程**：內部設備查證看起來乾淨 → 對照掃描報告仍標紅產生疑惑 → 用 \`nslookup\` 確認是否為 Split-DNS → 針對外部真實 IP 用 \`openssl\` 快速抽查、\`nmap\` 做完整驗證 → 確認外部服務狀態，回應弱點報告。
`;export{e as default};