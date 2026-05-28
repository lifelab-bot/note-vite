var e=`## 🖥️ Citrix｜XFF（X-Forwarded-For）是什麼

**Q：** XFF insert 在 Load Balancing Services 的 insert IP address 跟 Server Group insert client IP header 一樣嗎？

**A：** 兩者是同一件事，只是套用對象不同（單一 service vs 群組）。兩者都是啟用 CIP（Client IP）功能，把 client IP 插入指定 header（預設 \`X-Forwarded-For\`）轉發給 backend。CLI 確認方式：\`show service <name>\` 和 \`show serviceGroup <name>\`，都應看到 \`Client IP: ENABLED\` 和 \`CIP Header: X-Forwarded-For\`。

---

## 🖥️ Citrix｜Wireshark 如何過濾 XFF

**Q：** Wireshark 怎麼查詢 XFF？

**A：**
\`\`\`
http.x_forwarded_for
\`\`\`
或用字串搜尋：
\`\`\`
http contains "X-Forwarded-For"
\`\`\`
指定 IP：
\`\`\`
http.x_forwarded_for == "1.2.3.4"
\`\`\`
XFF 是 HTTP header，只存在於明文 HTTP 流量。若是 HTTPS，要在 NetScaler 到 backend 那段（SSL offload 後）抓包才看得到。

---

## 🖥️ Citrix｜TLS 流量用 Wireshark 看 XFF

**Q：** TLS 裡 XFF 指令一樣嗎？

**A：** 一樣，過濾指令相同（\`http.x_forwarded_for\`）。\`nstrace\` 抓到的是 NetScaler 內部流量，SSL offload 後封包已是明文，Wireshark 開起來直接用即可，不需解密。

---

## ⚙️ 工具｜提示詞指令 pystart 怎麼運作

**Q：** pystart 這個提示詞是什麼，記憶在哪？

**A：** \`pystart\` 是存在 ClaudeCode 主資料夾記憶的提示詞。觸發後依序：讀取 Python 學習計畫確認進度→ 檢查總複習紀錄是否有進行中項目 → 確認當前 lesson 習題是否全部通過 → 報告狀態並繼續教學或等待作答。各對話空間（專案）需主動套用上層記憶才能使用。
`;export{e as default};