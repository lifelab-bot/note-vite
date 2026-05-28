var e=`## ⚙️ 工具｜Mac 睡眠時如何確保定時通知送達

**Q：** Mac 睡眠狀態下有沒有辦法還是能送通知？

**A：** 根本問題是 Mac 睡眠時 CPU 不跑任務，有三個方向：

1. **launchd**（macOS 原生）：比 cron 好，睡眠錯過的 job 開機後會補跑一次
2. **GitHub Actions**（最可靠）：把排程搬到 GitHub 伺服器，和 Mac 狀態完全無關，關機也能執行
3. **調整不睡眠時段**：用 \`pmset\` 設定特定時段保持喚醒

GitHub Actions 最適合「不想依賴本機狀態」的定時通知。

---

## ⚙️ 工具｜GitHub Actions 排程當天設定為何不能當天生效

**Q：** 當天設定不可以當天生效喔？為什麼？

**A：** GitHub Actions 的排程是在 workflow 推上去後，GitHub 才開始「登記」這個排程。如果推上去的時間已經過了今天的觸發時間點（或太接近），GitHub 不會往回補跑，直接等下一個週期。

就像你設好鬧鐘，但鬧鐘設定的時間已經過了，只會在明天同一時間響。

---

## ⚙️ 工具｜Telegram Chat ID 如何取得

**Q：** 忘記怎麼拿 Chat ID。

**A：** 兩種方式：

**方式一：getUpdates API**
先對 Bot 傳一則訊息，再在瀏覽器開：
\`\`\`
https://api.telegram.org/bot你的BOT_TOKEN/getUpdates
\`\`\`
回傳 JSON 裡找 \`"chat":{"id": 數字}\` 就是 Chat ID。

**方式二：@userinfobot**
Telegram 搜尋 \`@userinfobot\`，傳任意訊息，它會直接回覆你的 Chat ID。

注意：若 Bot 正在 polling 模式運行，呼叫 getUpdates 會回傳 \`409 Conflict\`，這時用 @userinfobot 即可。

---

## ⚙️ 工具｜Telegram Bot 409 Conflict 錯誤

**Q：** getUpdates 回傳 \`{"ok":false,"error_code":409,"description":"Conflict: terminated by other getUpdates request; make sure that only one bot instance is running"}\`

**A：** 這個錯誤表示 Bot 目前正在某個地方以 polling 模式運行（你本機的 \`bot.py\`）。Telegram 不允許同一個 token 同時有兩個 getUpdates 請求，所以瀏覽器的查詢被拒絕。

解決方式：
- 停止本機 bot 後再用瀏覽器查
- 或改用 @userinfobot（不需要停 bot）

---

## ⚙️ 工具｜PasswordGate 密碼的安全性限制

**Q：** PasswordGate 密碼寫在原始碼裡，my-note 又是公開 repo，這樣安全嗎？

**A：** PasswordGate 是**前端保護**，密碼寫在 Markdown 原始碼中。由於 my-note 是公開 repo，任何人都可以去 GitHub 看原始碼，直接找到 \`password="20260520"\` 這樣的值。

**結論：** PasswordGate 無法防止「會查看 GitHub 原始碼的人」。它只能防止一般網頁訪客隨意瀏覽，對有心人沒有保護效果。

如果頁面內容真的需要保護，需要改用後端驗證方案，或把 repo 改為私有。

---

## ⚙️ 工具｜Docusaurus build 產生的 assets 資料夾

**Q：** assets 是幹嘛的？

**A：** \`assets\` 是 Docusaurus 執行 \`yarn build\` 時產生的靜態資源資料夾，部署到 GitHub Pages 後就是網站的實際檔案：

- **js/** — 所有 React 元件打包後的 JavaScript bundle（包含頁面邏輯、元件 props）
- **css/** — 打包後的樣式表
- **img/** — 靜態圖片

網站的所有邏輯（包含 PasswordGate 的密碼 prop）都被編譯進 js bundle，所以可以在 DevTools → Sources → assets/js 的編號 .js 檔裡搜尋到密碼值。

---

## ⚙️ 工具｜GitHub Secrets 是什麼

**Q：** GitHub Secrets 是什麼？

**A：** GitHub 提供的**加密儲存空間**，專門用來存放不能寫進程式碼的敏感值（token、密碼、API key 等）。

特性：
- 值加密儲存，設定後連你自己在 GitHub 介面也看不到原始值
- 只有 Actions workflow 執行時才能透過 \`\${{ secrets.NAME }}\` 取用
- 不會出現在 log、diff、任何公開紀錄裡

**比喻：** 就像保險箱，你把 token 鎖進去，程式執行時自動開門取用，但沒有人能直接打開查看裡面的值。

---

## ⚙️ 工具｜mdnote 和專案紀錄的差異

**Q：** mdnote 存的筆記為什麼不會出現在網站上？專案紀錄那個是怎麼上網站的？

**A：** 原本的 \`mdnote\` 規則只存到本機 \`~/Desktop/ClaudeCode/筆記/\`，不包含 Notewebsite 流程。

「Telegram Bot × Google Calendar 早安通知」那篇是當時直接手動建在 \`docs/專案紀錄/\` 目錄裡，不是透過 mdnote 指令。

**調整後的 mdnote 流程（2026-05-20 起）：**
1. 本機存一份 → \`~/Desktop/ClaudeCode/筆記/\`
2. Notewebsite 存一份 → \`docs/專案紀錄/\`（加 frontmatter）
3. 更新 navbar → \`🗂️ 專案紀錄\` dropdown
4. Build → 提醒推版

---

## 🐍 Python｜\`range(len())\` 舊寫法：\`i\` 和 \`fruits[i]\` 的差異

**Q：** \`for i in range(len(fruits))\` 這段可以逐步追蹤嗎？想更理解意思。

**A：**

\`len(fruits)\` = 3，所以 \`range(3)\` 產生 \`0, 1, 2\`

**正確寫法：\`fruits[i]\` 去 list 取值**

| 圈 | \`i\` | \`i+1\` | \`fruits[i]\` | 印出 |
|----|-----|-------|-------------|------|
| 第一圈 | 0 | 1 | \`fruits[0]\` = \`'apple'\` | \`1. apple\` |
| 第二圈 | 1 | 2 | \`fruits[1]\` = \`'banana'\` | \`2. banana\` |
| 第三圈 | 2 | 3 | \`fruits[2]\` = \`'cherry'\` | \`3. cherry\` |

**常見錯誤：忘記寫 \`fruits[i]\`，直接印 \`i\`**

| 圈 | \`i\` | \`i+1\` | 印出 |
|----|-----|-------|------|
| 第一圈 | 0 | 1 | \`1. 0\` |
| 第二圈 | 1 | 2 | \`2. 1\` |
| 第三圈 | 2 | 3 | \`3. 2\` |

關鍵差異：\`i\` 只是數字 index（0、1、2），不是水果名稱。\`fruits[i]\` 才是真的去 list 裡取值。這也是 \`enumerate\` 更好用的原因——它直接給你 \`(index, 值)\`，不需要自己寫 \`fruits[i]\`，不容易犯這個錯。

---

## ⚙️ 工具｜GitHub Actions cron 使用的時區

**Q：** GitHub Actions 的 cron 排程是哪個時區？

**A：** GitHub Actions 固定使用 **UTC**，沒有辦法更改時區設定。所有 \`schedule: cron:\` 的 workflow 都以 UTC 為基準，需要自己換算當地時間。

---

## ⚙️ 工具｜GitHub Actions 排程延遲的區間

**Q：** GitHub Actions cron 延遲通常在哪個區間？

**A：** 沒有固定保證範圍，根據社群回報：

| 狀況 | 延遲 |
|------|------|
| 平常時段 | 0～30 分鐘 |
| 高峰時段 | 30 分鐘～數小時 |
| 極端案例 | 3～4 小時以上 |

延遲是隨機的，無法靠調整時間來保證準時送達。若需要精準時間，應改用本機 cron（launchd）或手動觸發（\`workflow_dispatch\`）。

---

## ⚙️ 工具｜台灣時間換算成 GitHub cron UTC 的方法

**Q：** 為什麼週三早上 07:00 台灣時間要設成 \`0 23 * * 2\`？跨天怎麼算？

**A：** 台灣是 UTC+8，換算公式：

\`\`\`
台灣時間 - 8小時 = UTC 時間
07:00 - 8小時 = 前一天 23:00
\`\`\`

所以週三 07:00 台灣時間 = 週二 23:00 UTC。

Cron 格式是 \`分 時 日 月 週\`，週幾從 0 開始數：

\`\`\`
0=週日 / 1=週一 / 2=週二 / 3=週三 / 4=週四 / 5=週五 / 6=週六
\`\`\`

週二 23:00 → \`0 23 * * 2\`

早上扣 8 小時容易跨到前一天，這是台灣時區換算最常搞混的地方。

---

## 🇬🇧 英文｜\`solitude\`（名詞）vs \`solitary\`（形容詞）

**Q：** 寫作中用了「I'm a solitude man」，哪裡有問題？

**A：** \`solitude\` 是**名詞**（獨處、孤獨），不能直接修飾名詞，必須用形容詞形式：

- \`solitary\`（adj.）→ \`I'm a solitary man\` ✅
- 或保留名詞：\`I'm a man of solitude\` ✅

類比：\`courage\`（名詞）→ \`courageous\`（形容詞），兩者不能互換位置。

---

## 🇬🇧 英文｜\`pass away\` 地道用法

**Q：** 「離開這世界」英文怎麼說比較自然？

**A：** 最地道的說法是 **\`pass away\`**（委婉說法，等同「過世」）：

- \`My grandma passed away.\` ✅
- \`My grandma left this world.\` ✅（較文學）
- \`My grandma left this world away.\` ❌（\`away\` 和 \`left\` 搭配不自然）

\`pass away\` 是英語中最常見的委婉說法，正式與非正式場合都適用。

---

## 🇬🇧 英文｜\`Even\` vs \`Even though\` 的差異

**Q：** 「Even I'm a solitary man, still can feel...」哪裡有問題？

**A：** 兩個問題：

1. \`Even\` 在英文裡是副詞（甚至、連），不能連接子句。要連接讓步子句，要用 **\`Even though\`**（即使、雖然）：
   - \`Even though I'm a solitary man, I can still feel...\` ✅

2. 讓步子句後面的主句**不能省略主詞**。中文可以省略（「我是獨處的人，還是能感受到...」），英文不行，\`I\` 必須明確寫出來：
   - \`still can feel\` ❌ → \`I can still feel\` ✅
`;export{e as default};