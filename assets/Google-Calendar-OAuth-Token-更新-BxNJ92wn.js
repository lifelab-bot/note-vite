var e=`# Google Calendar OAuth Token 更新

## 問題現象

執行 \`daily_log.py\` 時出現以下錯誤：

\`\`\`
google.auth.exceptions.RefreshError: ('invalid_grant: Token has been expired or revoked.', ...)
\`\`\`

表示 \`token.json\` 中儲存的授權憑證已過期或被撤銷，需要重新授權。

## 原因

Google OAuth token 的 refresh token 有效期限不是永久的。當：

- 長時間未使用
- Google 帳戶密碼變更
- 手動在 Google 帳戶安全性頁面撤銷授權

都會導致 \`token.json\` 失效，程式無法自動續期。

## 解法

**直接在 Terminal 執行（不能用 Claude Code 的 \`!\` 指令，因為需要開啟瀏覽器）：**

\`\`\`bash
rm ~/Desktop/ClaudeCode/telegram_bot/token.json
cd ~/Desktop/ClaudeCode/telegram_bot
python3 daily_log.py '測試'
\`\`\`

執行後會：
1. 自動開啟瀏覽器，跳至 Google 登入頁
2. 選擇帳號並授權
3. 授權完成後自動產生新的 \`token.json\`
4. 程式繼續執行，寫入 Calendar 事件

## 注意事項

| 項目 | 說明 |
|------|------|
| 執行環境 | 必須在有 GUI 的 Terminal 直接執行，\`!\` 指令不會開瀏覽器 |
| credentials.json | 不需要刪除，這是 OAuth 應用程式憑證，不會過期 |
| token.json | 這才是需要定期更新的使用者授權 token |

## 相關檔案

\`\`\`
~/Desktop/ClaudeCode/telegram_bot/
├── credentials.json        # OAuth 應用程式憑證（固定，不用動）
├── token.json              # 使用者授權 token（過期需刪除重建）
└── daily_log.py            # 寫入 Google Calendar 的腳本
\`\`\`
`;export{e as default};