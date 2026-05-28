var e=`## 🐍 Python｜\`print(options)\` vs \`print(option)\` — 為什麼選單出現四次

**Q：** 用 enumerate 印選單，結果整個 list 出現了四次，為什麼？

**A：**
\`\`\`python
for index, option in enumerate(options, start=1):
    print(options)   # ← 這裡印的是整個 list
\`\`\`

\`for\` 跑幾次就印幾次。\`options\` 是整個 list，\`option\`（少一個 s）才是每次迴圈取出的單一值。差一個 \`s\`，行為完全不同：

\`\`\`python
# 錯：每次都印整個 list
print(options)

# 對：每次印一個元素
print(option)
\`\`\`

---

## 🐍 Python｜dict 用固定字串 key vs 用變數 key

**Q：** \`contact['Name'] = Phone\` 和 \`contact[Name] = Phone\` 差在哪裡？

**A：**
- \`contact['Name']\` — key 是固定字串 \`'Name'\`，每次新增都覆蓋同一格，最後只剩一筆
- \`contact[Name]\` — key 是變數，值是使用者輸入的名字，每個人都有各自的 key

所以要存多個聯絡人，必須用 \`contact[Name] = Phone\`，用 user 輸入的名字當 key。

---

## 🐍 Python｜\`contact.items\` 為什麼要加括號

**Q：** \`for key, value in contact.items\` 跑不動，為什麼？

**A：** \`.items\` 是方法（function），沒有括號只是「指向這個方法」，不是「執行它」。

\`\`\`python
contact.items    # 只是指向方法，不執行
contact.items()  # 執行方法，回傳 key-value 對，才能被 for 迭代
\`\`\`

任何方法都需要加 \`()\` 才會執行，這個規則在 Python 裡是一致的。

---

## 🐍 Python｜查詢 dict 為什麼不能用 \`Phone\` 變數

**Q：** 查詢聯絡人時，為什麼不能用 \`Phone\` 變數印電話，而要用 \`contact[Name]\`？

**A：** \`Phone\` 這個變數只有在「選 1 新增」時才被建立。有兩個問題：

1. **可能不存在**：如果第一個動作就選 2 查詢，\`Phone\` 根本沒被建立，程式會報 \`NameError\`
2. **可能是錯的人的電話**：就算存在，它只記得「最後一次新增」的電話，查詢不同的人就拿到錯誤結果

正確做法：\`contact[Name]\` — 用 Name 當 key，從 dict 取出對應的值，才是針對這個人的電話。


---

## 💡 其他｜初學者出題設計原則

**Q：** 你不是以一個初學程度的方式去教學跟出題？

**A：** 是的，出題方式有問題。問題不在題目本身的難易，而是一題同時組合太多概念（例如電話簿同時考 while、enumerate、dict、if/elif）。初學應該是：

- 一題只練一個概念
- 先練「能跑起來」，再練「寫得好」
- 錯了先問「哪裡看不懂」，不是一次給多個錯誤分析

正確的節奏：先出熱身題（單一概念）→ 熟了再出綜合題。

---

## 💡 其他｜Python 初學者程度判斷

**Q：** 你依照我之前的練習，能判斷我的程度嗎？

**A：** 可以判斷：

- **穩定的部分：** while 迴圈、if/elif、enumerate、f-string、input、基本邏輯結構
- **還不穩的部分：** 多個概念同時整合時容易出錯；細節類錯誤（括號漏掉、變數名差一個字母、變數 scope）還沒到「熟到不用想」的程度
- **結論：** 扎實初學者，個別概念都有掌握，需要更多單一練習打底，再往整合題走

---

## 💡 其他｜出題結構設計

**Q：** 可以把每個 lesson 多出幾題，前面先出基本簡單的，後面保持原本的題目嗎？

**A：** 這個方向正確。分兩段：

- **熱身題（新增）：** 每題只練一個新技巧，給足提示，讓你能直接套用剛學的東西
- **正式題（維持原樣）：** 原本計畫裡的綜合題不變，熱身後再做不會一開始就卡死

從 L4 習題二開始套用，之後每個 lesson 都用這個結構。
`;export{e as default};