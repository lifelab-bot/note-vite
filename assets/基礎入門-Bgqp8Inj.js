var e=`> 涵蓋概念：變數賦值、input、型別轉換（Casting）、if 巢狀

---

## 基本變數賦值

\`\`\`python
x = 5
print(x)    # 5
y = 10
print(y)    # 10
y = 20      # 重新賦值，y 的值被更新為 20
\`\`\`

:::note
變數可以被重新賦值，新值會覆蓋舊值。Python 不需要宣告型別。
:::

---

## 輸入資料（input）

\`\`\`python
name = input('請輸入名字：')
height = input('請輸入身高：')
weight = input('請輸入體重：')
print('Hi please recheck your information:', name, height, weight)
\`\`\`

:::note
\`input()\` 回傳的永遠是**字串**，需要數字運算時要用 \`int()\` 或 \`float()\` 轉型
:::

---

## 型別轉換（Casting）

\`\`\`python
age = input('請輸入年齡：')
age = int(age)   # 字串 → 整數
if age >= 20:
    print('你可以投票囉')
\`\`\`

:::caution
沒有 \`int()\` 的話，\`age\` 是字串，字串跟數字不能比較，會直接報錯
:::

---

## if 巢狀練習

\`\`\`python
rain = input('請問今天有沒有下雨：')

if rain == '有':
    print('請待在家')
    print('不要出門')
    print('若出門，要記得帶雨具')

    movie = input('要不要看電影：')
    if movie == '要':
        print('那我們去看電影吧')
        print('真是太好了')

if rain == '沒有':
    print('該出門走走了')
    print('出去玩啦')
    print('去吃好吃的')
\`\`\`

:::caution 常見 Bug
原始碼中有一版寫了 \`else print(...)\` → **語法錯誤**！  
\`else\` 後面必須加冒號：\`else: print(...)\`
:::

---

:::note
溫度轉換（攝氏 ↔ 華氏）的完整版本，包含雙向轉換與錯誤處理，見 **[if判斷式｜溫度轉換器](/docs/Python/學習筆記/if判斷式#溫度轉換器)**
:::
`;export{e as default};