var e=`> 涵蓋概念：print、input、f-string、int/float 轉型、if/elif/else、for 迴圈、mod 運算

---

## a001 — 哈囉（Hello World）

**題目：** 讀入字串，輸出 \`hello, 字串\`

\`\`\`python
# 法一
x = input('請輸入名字：')
print("hello,", x)

# 法二：f-string
x = input('請輸入名字：')
print(f'hello,{x}')

# 法三：單行
print(f'hello,{input("請輸入名字：")}')
\`\`\`

:::tip
\`f'...'\` 是 f-string，\`{}\` 內可放變數或運算式  
\`print(a, b)\` 自動加空格；\`print(a + b)\` 字串直接串接
:::

---

## a002 — 簡易加法

**題目：** 輸入多個數字（空白分隔），計算總和

\`\`\`python
# 法一：兩個數字
x = int(input('請輸入第一個數字：'))
y = int(input('請輸入第二個數字：'))
print(x + y)

# 法二：多個數字空白分隔
total = 0
for i in input('請輸入連續數字，以空白分隔：').split():
    total += int(i)
print(total)
\`\`\`

:::note
\`.split()\` 將字串依空白切成 list，例如 \`"1 2 3".split()\` → \`['1', '2', '3']\`  
切出來的元素是字串，需 \`int()\` 轉型後才能做數學運算
:::

---

## a003 — 兩光法師占卜術

**公式：** \`S = (月份 × 2 + 日期) % 3\`

| S 值 | 運勢 |
|------|------|
| 0 | 普通 |
| 1 | 吉 |
| 2 | 大吉 |

\`\`\`python
M = int(input('請輸入月份：'))
D = int(input('請輸入日期：'))
S = (M * 2 + D) % 3

if S == 0:
    print('普通')
elif S == 1:
    print('吉')
else:
    print('大吉')
\`\`\`

---

## a004 — 文文的求婚（閏年判斷）

**閏年規則：**
1. 不能被 4 整除 → 平年
2. 能被 4 整除，但能被 100 整除 → 平年
3. 能被 400 整除 → 閏年
4. 能被 4 整除，且不被 100 整除 → 閏年

\`\`\`python
y = int(input('請輸入西元年：'))

if y % 4 == 0:
    if y % 100 == 0:
        if y % 400 == 0:
            print('是閏年')
        else:
            print('是平年')
    else:
        print('是閏年')
else:
    print('是平年')
\`\`\`

:::note 巢狀 if
if 裡面還有 if，稱為巢狀（nested）。判斷順序很重要，先判斷大條件再判斷例外。
:::

---

## a005 — Eva 的回家作業（等差等比數列）

**題目：** 給定數列前四項，判斷是等差或等比，求第五項

**等差數列：** 每項差相同（公差），第五項 = 第四項 + 公差  
**等比數列：** 每項比值相同（公比），第五項 = 第四項 × 公比

\`\`\`python
t = int(input())   # 題目數

for _ in range(t):
    nums = list(map(int, input().split()))
    a, b, c, d = nums

    if b - a == c - b == d - c:
        # 等差數列：相鄰差相同
        print(d + (b - a))
    else:
        # 等比數列：相鄰比相同
        print(d * (b // a))
\`\`\`

:::note
- \`map(int, input().split())\` — 一行把輸入切開並轉成整數
- \`a, b, c, d = nums\` — 解包（unpacking），把 list 裡的值依序賦給變數
- \`b - a == c - b == d - c\` — Python 支援連續比較，等同 \`(b-a == c-b) and (c-b == d-c)\`
:::
`;export{e as default};