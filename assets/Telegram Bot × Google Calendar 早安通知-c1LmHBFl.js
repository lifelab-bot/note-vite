var e=`# Telegram Bot × Google Calendar 早安通知

在 Telegram 傳 \`/morning\`，Bot 會回傳今天的 Google Calendar 行程。
---
## 這整件事在做什麼？

你要建一支程式，讓它：
1. 監聽 Telegram，等你傳 \`/morning\`
2. 收到後去讀你的 Google Calendar
3. 把今天的行程整理好，回傳到 Telegram

為了讓程式能讀你的 Google Calendar，Google 要求你先「登記」這支程式，並且親自授權它存取你的帳號。這個登記的過程會產生兩個檔案：

- \`credentials.json\`：程式的身份證（你在 Google Cloud 申請的）
- \`token.json\`：你授權後 Google 發的通行證（第一次執行時自動產生）

---

## 需要準備的東西

- 一台有 Python 3 的電腦
- 一個 Telegram 帳號
- 一個 Google 帳號（**建議開一個新的測試帳號**，避免真實資料外洩）

---

## 第一部分：Telegram 設定

### 步驟 1：建立 Bot，取得 Token

Token 是 Telegram 用來識別你的 Bot 的密碼，每個 Bot 都有一組。

1. 打開 Telegram，在搜尋欄搜尋 \`@BotFather\`
2. 點進去，按「Start」或傳 \`/start\`
3. 傳 \`/newbot\`
4. BotFather 問你 Bot 的顯示名稱，隨便取（例如 \`我的行事曆Bot\`）
5. BotFather 問你 Bot 的帳號（username），必須以 \`bot\` 結尾（例如 \`myschedule_bot\`）
6. 完成後 BotFather 會給你一串 Token，格式長這樣：
   \`\`\`
   123456789:AABBccDDeeFFggHH...
   \`\`\`
7. 把 Token 複製起來，等一下要用

> **安全提醒：Token 是敏感資訊，不要給別人、不要上傳到 GitHub**

---

### 步驟 2：取得你的 Chat ID

Chat ID 是你和 Bot 之間那個對話視窗的編號，Bot 要靠它知道要把訊息傳給誰。

1. 在 Telegram 搜尋你剛建立的 Bot 名稱（用 \`@帳號\` 搜）
2. 點進去，按「Start」或傳任意一句話（例如 \`hi\`）

   > **如果跳過這步直接查，會拿到空的結果**

3. 在瀏覽器網址列輸入以下網址（把 \`TOKEN\` 換成你的 Token）：
   \`\`\`
   https://api.telegram.org/botTOKEN/getUpdates
   \`\`\`
4. 瀏覽器會顯示一段 JSON 文字，找到這段：
   \`\`\`
   "chat":{"id":1234567890
   \`\`\`
5. 那個數字就是你的 Chat ID，複製起來

---

### 步驟 3：測試能不能傳訊息

確認 Token 和 Chat ID 都正確，先手動測試一次。

在終端機執行（把 \`TOKEN\` 和 \`CHATID\` 換成你的）：

\`\`\`
curl "https://api.telegram.org/botTOKEN/sendMessage?chat_id=CHATID&text=Hello"
\`\`\`

> **注意：這行指令要整行一次複製貼上，不能分行。**
> 如果終端機出現 \`dquote>\`，代表貼錯了，按 \`Ctrl + C\` 取消，重新整行貼上。

Telegram 收到「Hello」代表成功，繼續下一步。

---

## 第二部分：Google Calendar 設定

### 步驟 4：建立測試 Google 帳號（建議）

開一個新的 Google 帳號專門用來測試，這樣即使出問題也不影響真實行事曆。
完成後用這個測試帳號登入後續所有 Google 的步驟。

---

### 步驟 5：進入 Google Cloud Console

1. 用測試帳號在瀏覽器打開：
   \`\`\`
   https://console.cloud.google.com
   \`\`\`

> **遇到「Google Cloud access blocked」？**
> Google 從 2026 年 3 月起強制要求兩步驟驗證。
> 解法：
> 1. 打開 \`https://myaccount.google.com/security\`
> 2. 找「兩步驟驗證」，開啟它
> 3. 完成後回到 Cloud Console 重新整理

---

### 步驟 6：建立新專案

1. 點畫面左上角的專案選單（可能寫「選取專案」或顯示上次用過的專案名稱）
2. 點「新增專案」
3. 專案名稱隨便取（例如 \`telegram-bot-test\`）
4. 點「建立」
5. 等它建立完成，確認左上角已切換到這個新專案

---

### 步驟 7：啟用 Google Calendar API

1. 在畫面上方的搜尋欄輸入 \`Google Calendar API\`
2. 點搜尋結果中的「Google Calendar API」
3. 點「啟用」按鈕
4. 等它啟用完成

---

### 步驟 8：設定 OAuth 同意畫面

這個步驟是告訴 Google「這支程式叫什麼名字、用途是什麼」，是申請憑證前的必要手續。

1. 左側選單點「API 和服務」→「OAuth 同意畫面」（或叫「Audience」）
2. User Type 選「外部」，點「建立」
3. 填入：
   - 應用程式名稱：隨便取（例如 \`morning-bot\`）
   - 使用者支援電子郵件：填你的測試 Gmail
   - 開發人員聯絡資訊：填你的測試 Gmail
4. 點「儲存並繼續」
5. 後面幾頁（範圍、測試使用者）先略過，一路點「儲存並繼續」直到完成

---

### 步驟 9：新增測試使用者

這個步驟是把你的帳號加入允許名單，因為 App 在測試模式，只有名單內的帳號才能授權。

> 如果跳過這步，執行 Bot 時會出現「已封鎖存取權：測試未完成 Google 驗證程序」的錯誤。

1. 左側選單點「Audience」（或「OAuth 同意畫面」）
2. 往下找到「測試使用者」區塊
3. 點「新增使用者」
4. 填入你的測試 Gmail
5. 點「儲存」

---

### 步驟 10：建立 OAuth 憑證，下載 credentials.json

這個步驟會產生 \`credentials.json\`，也就是程式的身份證。

1. 左側選單點「憑證」
2. 點上方「建立憑證」→「OAuth 用戶端 ID」
3. 應用程式類型選「**Desktop app**」（不是 Web application）
4. 名稱隨便取，點「建立」
5. 畫面跳出視窗，點「**下載 JSON**」
6. 檔案會存到 \`~/Downloads\`，檔名很長（\`client_secret_....json\`）

---

## 第三部分：安裝與執行

### 步驟 11：安裝 Python 套件

在終端機執行：

\`\`\`
pip3 install google-auth-oauthlib google-api-python-client python-telegram-bot
\`\`\`

等安裝完成。

---

### 步驟 12：建立資料夾

在終端機執行：

\`\`\`
mkdir -p ~/Desktop/ClaudeCode/telegram_bot
\`\`\`

---

### 步驟 13：把憑證檔移過去

在終端機執行（這行會自動抓 Downloads 裡那個長名字的檔案，不用手動改檔名）：

\`\`\`
cp ~/Downloads/client_secret_*.json ~/Desktop/ClaudeCode/telegram_bot/credentials.json
\`\`\`

---

### 步驟 14：建立程式檔

在 \`~/Desktop/ClaudeCode/telegram_bot/\` 資料夾建立 \`bot.py\`，內容如下（把 \`你的TOKEN\` 換成第一步取得的 Token）：

\`\`\`python
import os
import datetime
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

TELEGRAM_TOKEN = "你的TOKEN"
SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"]
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CREDENTIALS_FILE = os.path.join(BASE_DIR, "credentials.json")
TOKEN_FILE = os.path.join(BASE_DIR, "token.json")


def get_calendar_service():
    creds = None
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
        with open(TOKEN_FILE, "w") as token:
            token.write(creds.to_json())
    return build("calendar", "v3", credentials=creds)


def get_today_events():
    service = get_calendar_service()
    now = datetime.datetime.utcnow()
    start = datetime.datetime(now.year, now.month, now.day, 0, 0, 0).isoformat() + "Z"
    end = datetime.datetime(now.year, now.month, now.day, 23, 59, 59).isoformat() + "Z"
    events_result = service.events().list(
        calendarId="primary",
        timeMin=start,
        timeMax=end,
        singleEvents=True,
        orderBy="startTime",
    ).execute()
    return events_result.get("items", [])


async def morning(update: Update, context: ContextTypes.DEFAULT_TYPE):
    events = get_today_events()
    if not events:
        await update.message.reply_text("今天沒有行程，好好休息！")
        return
    lines = ["早安！今天的行程：\\n"]
    for event in events:
        start = event["start"].get("dateTime", event["start"].get("date", ""))
        if "T" in start:
            time_str = start[11:16]
        else:
            time_str = "全天"
        lines.append(f"• {time_str} {event.get('summary', '(無標題)')}")
    await update.message.reply_text("\\n".join(lines))


if __name__ == "__main__":
    app = ApplicationBuilder().token(TELEGRAM_TOKEN).build()
    app.add_handler(CommandHandler("morning", morning))
    print("Bot 啟動中...")
    app.run_polling()
\`\`\`

---

### 步驟 15：啟動 Bot

在終端機執行：

\`\`\`
python3 ~/Desktop/ClaudeCode/telegram_bot/bot.py
\`\`\`

**第一次執行** 會自動開瀏覽器，要求你授權 Google Calendar 存取：

1. 選擇你的測試 Google 帳號
2. 出現「Google hasn't verified this app」

   > 這是正常的，因為這是你自己建的 App，沒有經過 Google 官方審核。
   > 解法：點「Advanced」→「Go to（不安全）」→「Allow」

3. 授權完成，瀏覽器顯示成功，終端機出現「Bot 啟動中...」
4. 同時資料夾裡會自動產生 \`token.json\`

**之後每次執行都不需要再授權。**

---

### 步驟 16：使用

Bot 啟動後，去 Telegram 對你的 Bot 傳：

\`\`\`
/morning
\`\`\`

Bot 會回傳今天的所有行程。沒有行程時回傳「今天沒有行程，好好休息！」

---

## 檔案結構

\`\`\`
telegram_bot/
├── bot.py           # 主程式（Token 寫在這裡）
├── credentials.json # 從 Google Cloud 下載的憑證（勿上傳）
└── token.json       # 授權後自動產生的通行證（勿上傳）
\`\`\`

---

## 注意事項

- Bot 必須保持執行中才能收到指令，關掉終端機 Bot 就停了
- \`credentials.json\` 和 \`token.json\` 不能上傳到 GitHub
- Token 寫死在 \`bot.py\` 裡適合本機自用，如果未來要放到伺服器再改成環境變數的方式

`;export{e as default};