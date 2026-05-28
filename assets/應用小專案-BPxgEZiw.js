var e=`> 涵蓋概念：BMI 計算、三數排序（sorted）、購物結帳、整除/餘數、奇偶數判斷、for 迴圈計數器

---

## BMI 計算機

\`\`\`python
height = int(input('請輸入身高：')) / 100
weight = int(input('請輸入體重：'))

if height <= 0 or weight <= 0:
    print('身高體重必須是正整數！')
else:
    BMI = round(weight / height ** 2, 1)

    if BMI < 18.5:
        print('您的BMI為：', BMI, '體重過輕')
    elif 18.5 <= BMI < 24:
        print('您的BMI為：', BMI, '正常範圍')
    elif 24 <= BMI < 27:
        print('您的BMI為：', BMI, '過重')
    elif 27 <= BMI < 30:
        print('您的BMI為：', BMI, '輕度肥胖')
    elif 30 <= BMI < 35:
        print('您的BMI為：', BMI, '中度肥胖')
    elif BMI >= 35:
        print('您的BMI為：', BMI, '重度肥胖')
\`\`\`

**公式：** \`BMI = 體重(kg) / 身高(m)²\`

| BMI 範圍 | 分類 |
|----------|------|
| < 18.5 | 體重過輕 |
| 18.5 ~ 24 | 正常範圍 |
| 24 ~ 27 | 過重 |
| 27 ~ 30 | 輕度肥胖 |
| 30 ~ 35 | 中度肥胖 |
| ≥ 35 | 重度肥胖 |

:::note
先輸入公分再 \`/ 100\` 轉公尺，\`**\` 是次方，\`round(x, 1)\` 保留一位小數
:::

---

## 三數排序輸出

**題目：** 輸入三個整數，以 \`大>中>小\` 格式輸出（相等用 \`=\`）

\`\`\`python
a = int(input('請輸入數字一：'))
b = int(input('請輸入數字二：'))
c = int(input('請輸入數字三：'))

nums = sorted([a, b, c], reverse=True)

ops = []
if nums[0] == nums[1]:
    ops.append('=')
else:
    ops.append('>')

if nums[1] == nums[2]:
    ops.append('=')
else:
    ops.append('>')

print(f"{nums[0]}{ops[0]}{nums[1]}{ops[1]}{nums[2]}")
\`\`\`

:::tip sorted 用法
- \`sorted(list)\` → 由小到大，回傳新 list，**不改原本**
- \`sorted(list, reverse=True)\` → 由大到小
- \`list.sort()\` → 直接修改原本的 list
:::

---

## 購物結帳（trade）

**功能：** 判斷購買意願、預算是否足夠、計算可買數量與餘額

\`\`\`python
price = int(input('請輸入商品價格：'))
budget = int(input('請輸入您的預算：'))
intention = input('請輸入購買意願：').strip().lower()

if intention in ['n', 'no', '無', '不', '不要', '不想']:
    print('還沒想好沒關係，歡迎下次光臨！')
elif intention in ['y', 'yes', '有', '想', '要']:
    if budget < price:
        print('您的錢似乎帶得不夠哦！')
    else:
        quantity = budget // price
        remaining = budget % price
        print('您可以購買的數量為：', quantity, '餘額為：', remaining)
else:
    print('請輸入有效的購買意願（是/否、Y/N、Yes/No）')
\`\`\`

**優化重點對照：**

| 原始版 | 優化版 | 原因 |
|--------|--------|------|
| \`str(input(...))\` | \`input(...)\` | \`input()\` 已回傳字串，\`str()\` 多餘 |
| 同時列舉大小寫 | \`.strip().lower()\` | 統一轉小寫，省去重複判斷 |
| \`int(budget // price)\` | \`budget // price\` | \`//\` 整除已是整數，\`int()\` 多餘 |

---

## 鉛筆購買計算

**題目：** 鉛筆一支 5 元，一打 50 元。小明幫班上每位同學各買一支，問花費多少？

\`\`\`python
N = int(input('請輸入班級人數：'))
print((N//12)*50 + (N%12)*5)
\`\`\`

| 語法 | 說明 |
|------|------|
| \`a // b\` | 整除，取商（整數） |
| \`a % b\` | 取餘數，公式等同 \`a - b*(a//b)\` |

---

## 奇偶數判斷

**題目：** 輸入數字，輸出 Odd 或 Even

\`\`\`python
# 法一：if/else
i = int(input('請輸入數字：'))
if i % 2:
    print('Odd')
else:
    print('Even')

# 法二：單行三元運算式
print('Odd' if (int(input('請輸入數字：'))) % 2 else 'Even')
\`\`\`

:::tip 觀念
\`% 2\` 結果為 \`1\`（True）→ 奇數；\`0\`（False）→ 偶數
Python 中 \`0\` 為 Falsy，非零皆為 Truthy
:::

---

## 除以三的餘數分類

**題目：** 輸入 n 個數字，統計除以 3 餘 0、餘 1、餘 2 的數量

\`\`\`python
n = int(input('請輸入您要計算的數字總數量：'))
a = 0
b = 0
c = 0

for x in range(0, n):
    num = int(input('請輸入數字：'))
    if num % 3 == 0:
        a += 1
    elif num % 3 == 1:
        b += 1
    else:
        c += 1

print('被三整除：', a)
print('除三餘一：', b)
print('除三餘二：', c)
\`\`\`

:::note 重點
- \`range(0, n)\` 執行 n 次（0 到 n-1）
- \`+=\` 是累加簡寫，等同 \`a = a + 1\`
:::
`;export{e as default};