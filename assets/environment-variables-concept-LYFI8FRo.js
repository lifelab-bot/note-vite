var e=`# 環境變數概念：系統 vs 程式

> 日期：2026-05-22

---

## 兩種環境變數的差別

| | 系統環境變數 | 程式環境變數 |
|--|--|--|
| 存在哪 | 作業系統 | \`.env\` 檔 |
| 用途 | 告訴系統程式在哪裡 | 藏敏感資料 |
| 跟程式碼有關嗎 | 無關 | 有關 |

---

## 系統環境變數（PATH）

告訴系統「這個程式放在哪裡」，這樣任何地方都能直接打指令執行。

\`\`\`
PATH 裡加了 C:\\tools\\vscode-cli\\
→ 任何地方打 code tunnel 系統都找得到 code.exe
\`\`\`

**Windows 設定方式：**  
搜尋「編輯系統環境變數」→ 環境變數 → Path → 編輯 → 新增路徑

**Mac 設定方式：**  
VS Code 提供自動按鈕：\`Shell Command: Install 'code' command in PATH\`

---

## 程式環境變數（.env）

把 token、密碼等敏感資料從程式碼裡分離出去，避免上傳到 GitHub 時洩漏。

**沒用 .env（危險）：**

\`\`\`python
token = "abc123"   # token 直接寫死在程式碼裡，上傳就洩漏
\`\`\`

**用 .env（安全）：**

\`\`\`
# .env 檔（不上傳）
BOT_TOKEN=[token]
CHAT_ID=[chat_id]
\`\`\`

\`\`\`python
import os
token = os.getenv("BOT_TOKEN")   # 從環境變數讀取
chat_id = os.getenv("CHAT_ID")
\`\`\`

**記得把 \`.env\` 加進 \`.gitignore\`：**

\`\`\`
# .gitignore
.env
\`\`\`

---

## 使用情境

- 換 token 只改 \`.env\`，不用動程式碼
- 多人協作時各自有自己的 \`.env\`，不互相影響
- 部署到伺服器時，在伺服器上設定環境變數，不需要帶 \`.env\` 檔過去

`;export{e as default};