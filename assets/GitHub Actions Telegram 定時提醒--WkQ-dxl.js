var e=`# GitHub Actions Telegram 定時提醒設定筆記

> 日期：2026-05-20

---

## 為什麼要這樣做？

原本用 \`crontab\` 在 Mac 本機排程，Mac 睡眠時 cron 不執行，也不補跑。

| 方式 | 說明 | 限制 |
|------|------|------|
| crontab | 本機排程 | Mac 睡眠就跳過 |
| launchd | macOS 原生，開機補跑 | 仍需 Mac 開著 |
| **GitHub Actions** | 跑在 GitHub 伺服器 | 需要 GitHub repo |

---

## 設定步驟

### Step 1｜建立私有 GitHub Repo

建 \`cron-reminders\`，設為 **Private**。

**為什麼私有？** workflow 本身不含敏感資訊，但私有 repo 防止被搜尋引擎索引，減少不必要的曝光。

---

### Step 2｜建立 .gitignore

\`\`\`
.env
*.json
\`\`\`

**為什麼需要？** 強制阻擋 \`.env\`（含 token）和 \`credentials.json\`、\`token.json\` 被推上 GitHub。這是防止 token 外洩的第一道防線，不依賴自己記得。

---

### Step 3｜建立 Workflow 檔

路徑：\`.github/workflows/engwrite_reminder.yml\`

\`\`\`yaml
on:
  schedule:
    - cron: '0 3 * * 3'   # 週三 11:00 台灣時間
    - cron: '0 3 * * 6'   # 週六 11:00 台灣時間
  workflow_dispatch:        # 手動觸發

jobs:
  send-reminder:
    runs-on: ubuntu-latest
    steps:
      - name: Send Telegram notification
        env:
          TELEGRAM_TOKEN: \${{ secrets.TELEGRAM_TOKEN }}
          TELEGRAM_CHAT_ID: \${{ secrets.TELEGRAM_CHAT_ID }}
        run: |
          python3 << 'EOF'
          ...
          EOF
\`\`\`

**各部分作用：**

| 項目 | 作用 |
|------|------|
| \`schedule: cron\` | 設定自動觸發時間。格式是 UTC，台灣 UTC+8，11:00 → 寫 \`03:00\` |
| \`workflow_dispatch\` | 讓你可以在 Actions 頁面手動點「Run workflow」測試，不用等排程時間 |
| \`runs-on: ubuntu-latest\` | 指定跑在 GitHub 提供的 Ubuntu 虛擬機，不佔你的電腦資源 |
| \`env: \${{ secrets.X }}\` | 把 GitHub Secrets 的值注入成環境變數，token 不出現在程式碼裡 |
| \`python3 << 'EOF'\` | Python heredoc，讓程式碼直接寫在 yaml 裡，不需要額外的 .py 檔案 |
| \`random.sample(words, 5)\` | 每次獨立從 200 個字中隨機抽 5 個，沒有記憶，每次都是全新組合 |
| \`urllib.parse.urlencode\` | 把訊息內容編碼成 HTTP 表單格式，處理中文、換行等特殊字元 |

---

### Step 4｜推上 GitHub

\`\`\`bash
git init
git add .github   # 只加 workflow，不加 .env 和 json 憑證
git commit -m "add engwrite reminder workflow"
git remote add origin https://github.com/AfraButera/cron-reminders.git
git push -u origin main
\`\`\`

**為什麼只 add .github？** 確保敏感檔案不會被意外追蹤，即使 .gitignore 漏掉也不會出問題。

---

### Step 5｜設定 GitHub Secrets

進 repo → **Settings → Secrets and variables → Actions → New repository secret**

#### 什麼是 GitHub Secrets？

GitHub 提供的**加密儲存空間**，專門存放不能寫進程式碼的敏感值（token、密碼、API key 等）。

- 值加密儲存，設定後連你自己在 GitHub 介面也看不到原始值
- 只有 Actions workflow 執行時才能透過 \`\${{ secrets.NAME }}\` 取用
- 不會出現在 log、diff、任何公開紀錄裡

**比喻：** 就像保險箱，你把 token 鎖進去，程式執行時自動開門取用，但沒有人能直接打開查看裡面的值。

#### 要設定的兩個 Secret

| Secret 名稱 | 用途 |
|------|------|
| \`TELEGRAM_TOKEN\` | Bot 的身分識別，GitHub Actions 用它呼叫 Telegram API 發訊息 |
| \`TELEGRAM_CHAT_ID\` | 收件人地址，告訴 Telegram 訊息要發給誰 |

---

### Step 6｜手動測試

Actions → \`engwrite reminder\` → **Run workflow**，確認 Telegram 有收到通知。

---

## 重要注意事項

**當天設定不保證當天生效**
GitHub 在 workflow 推上後才開始登記排程，若推上去的時間已過今天的觸發點，不補跑，等下一個週期。

**Token 更新後要同步更新 Secret**
BotFather 重新產生 token 後，GitHub Secret 裡的舊 token 即失效，workflow 會報 \`exit code 1\`，要去 Secrets 頁面手動更新。

---

## /shuffle 指令

在 \`bot.py\` 加入，讓使用者隨時在 Telegram 傳 \`/shuffle\` 重新抽 5 個單字，不用等排程。

\`\`\`python
async def shuffle(update, context):
    chosen = random.sample(ENGWRITE_WORDS, 5)
    lines = "\\n".join(f"• {w}（{pos}）{zh}" for w, pos, zh in chosen)
    text = f"✍🏼 新的 5 個單字：\\n\\n{lines}\\n\\n寫完輸入 engwrite 交卷 📝"
    await update.message.reply_text(text)

app.add_handler(CommandHandler("shuffle", shuffle))
\`\`\`

**為什麼加這個？** 排程通知一週只來兩次，/shuffle 讓你隨時能拿新的單字開始練習，不被時間綁死。

---

## 單字庫

- 總數 200 個，已驗算無重複
- 組成：動詞 65 / 名詞 65 / 形容詞 50 / 副詞 20
- 選字原則：詞性多樣、難度適中、常用、可故事性與情感、可生活實用

| 原則 | 說明 | 範例 |
|------|------|------|
| 詞性多樣 | 動詞、名詞、形容詞、副詞均衡分配 | v./n./adj./adv. 各一區段 |
| 難度適中 | 非太冷僻也非太基礎 | cook ✓、threshold ✗ |
| 常用 | 日常對話、閱讀中高頻出現 | travel、meet、fresh |
| 故事性與情感 | 能帶出情節、情緒、記憶感 | whisper、grief、longing |
| 生活實用 | 可用在描述日常場景 | coffee、weekend、lunch |
`;export{e as default};