var e=`> 涵蓋概念：四則運算、內建數學函式（pow、max、min、round、abs）、math 模組（ceil、floor、pi）

---

## 基本運算符號

| 運算 | 語法 | 說明 |
|------|------|------|
| 加法 | \`a += 1\` | 等同 \`a = a + 1\` |
| 減法 | \`a -= 1\` | |
| 乘法 | \`a *= 2\` | |
| 除法 | \`a /= 2\` | 結果為 \`float\` |
| 平方 | \`a **= 2\` | 次方運算 |
| 餘數 | \`a %= 4\` | mod 運算 |

\`\`\`python
a = 8
a /= 2
print(a)    # 4.0（float）

a = 3
a **= 2
print(a)    # 9
\`\`\`

---

## 內建數學函式

\`\`\`python
# 次方 pow(底數, 指數)
print(pow(3, 2))     # 9

# 最大值 / 最小值
x, y, z = 1, 2, 3
print(max(x, y, z))  # 3
print(min(x, y, z))  # 1

# 四捨五入 round()
print(round(3.4))    # 3
print(round(7.8))    # 8

# 絕對值 abs()
print(abs(-3))       # 3
\`\`\`

---

## math 模組

\`\`\`python
import math  # 寫在檔案最上方

# 無條件進位 / 捨去
x = 9.7
print(math.ceil(x))    # 10
print(math.floor(x))   # 9
print(round(x))        # 10

# 圓周率
print(math.pi)         # 3.141592653589793

# 圓的周長 2πR
r = 4
print(round(2 * math.pi * r, 2))  # 25.13

# 圓的面積 πr²
r = int(input('請輸入圓半徑：'))
print(round(math.pi * r**2, 2))
\`\`\`

:::note 重點
- \`import math\` 才能使用 \`math.ceil / floor / pi\`
- \`round(數值, 小數位數)\` 可指定保留幾位小數
:::
`;export{e as default};