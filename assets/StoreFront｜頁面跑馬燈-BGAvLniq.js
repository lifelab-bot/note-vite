var e=`# Citrix StoreFront 頁面跑馬燈

在 StoreFront 登入後的頁面頂端加入可自訂文字與顏色的橫幅公告。

---

## 運作原理

StoreFront 頁面由兩個檔案控制跑馬燈：

| 檔案 | 負責什麼 |
|------|---------|
| \`receiver.html\` | 跑馬燈「在不在」（HTML 結構的開關） |
| \`custom\\style.css\` | 跑馬燈「長什麼樣」（訊息文字、顏色、動畫速度） |

\`receiver.html\` 原本有一個空的自訂插槽 \`pluginTop\`，預設沒有內容。  
把 \`StoreMarquee\` 的 div 插進去後，style.css 的動畫樣式才有地方套用。

---

## 步驟一：修改 receiver.html

以**系統管理者身份**開啟記事本，開啟：

\`\`\`
C:\\inetpub\\wwwroot\\Citrix\\<StoreWebName>\\receiver.html
\`\`\`

用 \`Ctrl+H\` 搜尋取代：

**搜尋（原始內容）：**
\`\`\`html
<div id="pluginTop"><p id="customTop"></p></div>
\`\`\`

> ⚠ 實際標籤依版本可能是 \`<p>\` 或 \`<div>\`，以檔案實際內容為準。

**取代為：**
\`\`\`html
<div id="pluginTop"><div id="customTop"><div class="StoreMarquee"><span></span></div></div></div>
\`\`\`

**這段 HTML 在做什麼：**

\`\`\`
<div id="pluginTop">          ← StoreFront 原本就有的頂部自訂插槽，預設是空的
  <div id="customTop">        ← 自訂內容的容器
    <div class="StoreMarquee"> ← 新增的：告訴 CSS「跑馬燈放這裡」
      <span></span>            ← 跑馬燈文字實際捲動的元素（內容由 style.css 注入）
    </div>
  </div>
</div>
\`\`\`

\`pluginTop\` 和 \`customTop\` 是 StoreFront 預設保留的空位，不動它 CSS 就沒地方掛。  
\`StoreMarquee\` 是你加進去的 class，style.css 裡的動畫和文字都是針對這個 class 寫的。  
沒有這個 div，style.css 設定再多也不會顯示。

存檔。

---

## 步驟二：重啟 IIS

以系統管理者身份開啟 PowerShell（或命令提示字元），執行：

\`\`\`powershell
iisreset
\`\`\`

等待出現「網際網路服務已順利重新啟動」。

---

## 步驟三：用 StoreFront Messaging.exe 設定訊息

1. 開啟 \`StoreFront Messaging.exe\`
2. 點擊 **Open Style.css**，選擇：
   \`\`\`
   C:\\inetpub\\wwwroot\\Citrix\\<StoreWebName>\\custom\\style.css
   \`\`\`
3. 填入欄位：
   - **Message to display**：公告文字
   - **Background color**：橫幅背景色
   - **Text color**：文字顏色
   - **Message state**：Enabled
4. 點擊 **Apply**

---

## 步驟四：修正為 UTF-8 編碼（顯示中文必做）

> ⚠ StoreFront Messaging.exe 預設存成 ANSI 編碼，中文會亂碼。  
> 每次 Apply 都會覆蓋回 ANSI，**需要重做本步驟**。  
> 建議日後直接編輯 style.css，不再透過 exe。

1. 以**系統管理者身份**開啟記事本
2. 開啟相同路徑的 \`style.css\`
3. **檔案 → 另存新檔**，編碼選 **UTF-8**，覆蓋存檔

---

## 步驟五：確認結果

重新登入 StoreFront，頁面頂端出現橫幅並顯示設定的文字即完成。

---

## 日後修改訊息（推薦做法）

直接編輯 style.css，找到 \`.StoreMarquee span:after\` 區塊：

\`\`\`css
.StoreMarquee span:after {
    content: "這裡改成新的公告文字";
}
\`\`\`

修改後**另存新檔 → 編碼 UTF-8**，無需再跑 iisreset。

---

## 常見問題

| 現象 | 原因 / 處理 |
|------|------------|
| 橫幅沒出現 | receiver.html 取代未成功，或 iisreset 未執行 |
| 顯示亂碼 | style.css 儲存為 ANSI，重新另存新檔選 UTF-8 |
| Apply 後又亂碼 | exe 每次覆蓋回 ANSI，改直接編輯 style.css |
`;export{e as default};