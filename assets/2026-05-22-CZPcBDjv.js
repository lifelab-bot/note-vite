var e=`## ⚙️ 工具｜VS Code Remote Tunnel 是什麼

**Q：** VS Code 建立 tunnel 是什麼概念？

**A：** Tunnel 是在你的機器和 Microsoft 伺服器之間建立一條「秘密通道」，瀏覽器透過這條通道連進你的機器。

\`\`\`
瀏覽器 → Microsoft 伺服器（中轉） → 你的機器
\`\`\`

- 你的 code 存在本機，不在 Microsoft 伺服器
- 你的機器主動跟伺服器報到，瀏覽器透過中轉連進來
- \`code tunnel\` 不能關，關掉通道就斷

---

## ⚙️ 工具｜Tunnel 傳輸有沒有加密

**Q：** VS Code tunnel 的傳輸過程有加密嗎？

**A：** 有，走 HTTPS + TLS 加密，Microsoft 中轉站看不到傳輸內容。

---

## ⚙️ 工具｜資料有沒有被 Microsoft 收集

**Q：** 用 VS Code tunnel，我的資料有沒有被 Microsoft 收集？

**A：** Microsoft 的隱私政策說不會收集程式碼內容，但連線 metadata（何時連、連多久、從哪個 IP）有記錄。敏感資料（token、密碼）建議用 \`.env\` 存，不要直接寫在程式碼裡。

---

## ⚙️ 工具｜VS Code 是 Microsoft 的嗎

**Q：** VS Code 是 Microsoft 開發的嗎？

**A：** 對，VS Code 是 Microsoft 開發的，開源免費。所以 tunnel 中轉也是走 Microsoft 自己的伺服器，整個生態系都是他們的。

---

## 💡 其他｜系統環境變數（PATH）是什麼

**Q：** 環境變數是為了安全機制設計的嗎？

**A：** 不是，環境變數跟安全沒有直接關係。PATH 這個環境變數存了一堆資料夾路徑，你輸入指令時，系統就去這些資料夾找有沒有對應的執行檔。

\`\`\`
你輸入 code tunnel
↓
系統去 PATH 裡的每個資料夾找 code.exe
↓
找到了 → 執行
找不到 → 'code' is not recognized
\`\`\`

就像外送員需要知道你家地址才能送達，PATH 是「地址清單」，系統照清單去找程式。

---

## 💡 其他｜系統環境變數 vs 程式環境變數（.env）

**Q：** 系統環境變數和程式裡的環境變數有什麼差別？

**A：** 兩個都叫「環境變數」但用途完全不同：

| | 系統環境變數 | 程式環境變數 |
|--|--|--|
| 存在哪 | 作業系統 | \`.env\` 檔 |
| 用途 | 告訴系統程式在哪裡 | 藏敏感資料 |
| 跟程式碼有關嗎 | 無關 | 有關 |

**程式環境變數（.env）用法：**

\`\`\`
# .env 檔（不上傳）
BOT_TOKEN=[token]
\`\`\`

\`\`\`python
import os
token = os.getenv("BOT_TOKEN")  # 從環境變數讀取，不寫死在程式碼
\`\`\`

記得把 \`.env\` 加進 \`.gitignore\`，這樣 token 不會被推到 GitHub。

## ⚙️ 工具｜Tunnel 的身份驗證機制

**Q：** GitHub 在 tunnel 裡的作用是什麼？兩端都要驗證嗎？

**A：** GitHub（或 Microsoft 帳號）的作用是**身份驗證**，確認連進機器的人是本人。兩端都要用同一個帳號：

\`\`\`
你的機器（host）       瀏覽器（client）
用 GitHub 設定  ←→  用 GitHub 登入
\`\`\`

- host 端：\`code tunnel\` 設定時用 GitHub 授權，綁定「這台機器屬於這個帳號」
- client 端：瀏覽器連進去時也要登入同一個 GitHub 帳號，才能通過驗證

兩端帳號對得上，才放行連線。GitHub 和 Microsoft 帳號都可以用，功能一樣，選你習慣的即可。
`;export{e as default};