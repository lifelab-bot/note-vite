var e=`> 學習日期：2026-05-01
> 單元：階段一 L2 — 迴圈進階
> 狀態：✅ 全部通過

---

## 學習重點

### \`break\` — 提前中斷整個迴圈

**比喻：** 你在人群中找朋友，找到了就不用繼續找了。\`break\` 就是「找到了，走人」。

\`\`\`python
for i in range(10):
    if i == 5:
        break
    print(i)
\`\`\`

**逐步追蹤：**

\`\`\`
i=0 → 不等於5 → 印 0
i=1 → 不等於5 → 印 1
...
i=4 → 不等於5 → 印 4
i=5 → 等於5！→ break → 整個迴圈結束
\`\`\`

輸出：\`0 1 2 3 4\`（i=5 之後全部跳過）

---

### \`continue\` — 跳過這次，繼續下一圈

**比喻：** 你在海邊撿貝殼，遇到破掉的就扔掉繼續往前走。\`continue\` 是「這個不要，下一個」。

\`\`\`python
for i in range(6):
    if i % 2 == 0:
        continue
    print(i)
\`\`\`

**逐步追蹤：**

\`\`\`
i=0 → 偶數 → continue（跳過，不印）
i=1 → 奇數 → 印 1
i=2 → 偶數 → continue
i=3 → 奇數 → 印 3
i=4 → 偶數 → continue
i=5 → 奇數 → 印 5
\`\`\`

**\`break\` vs \`continue\` 差在哪：**

\`\`\`python
# break：遇到條件 → 整個迴圈結束
for i in range(5):
    if i == 3:
        break
    print(i)
# 印 0 1 2（3 以後全停）

# continue：遇到條件 → 跳過這次，繼續跑
for i in range(5):
    if i == 3:
        continue
    print(i)
# 印 0 1 2 4（跳過 3，4 繼續）
\`\`\`

---

### \`enumerate\` — 同時拿到 index 和值

**為什麼用 enumerate？**

想一邊跑 list、一邊知道現在是第幾個，舊寫法需要三步，而且容易出錯：

\`\`\`python
fruits = ['apple', 'banana', 'cherry']

# ❌ 舊寫法：先 len，再 range，再 index 取值
for i in range(len(fruits)):
    print(f'{i+1}. {fruits[i]}')

# ❌ 舊寫法最常犯的錯：忘記寫 fruits[i]，直接印 i
for i in range(len(fruits)):
    print(f'{i+1}. {i}')   # 印出 1.0 / 2.1 / 3.2，不是水果

# ✅ enumerate：直接給你 index 和值，不需要再透過 index 取值
for i, fruit in enumerate(fruits):
    print(f'{i+1}. {fruit}')
\`\`\`

**逐步追蹤：**

\`\`\`python
fruits = ['apple', 'banana', 'cherry']
# enumerate(fruits) 產生：(0,'apple'), (1,'banana'), (2,'cherry')

for i, fruit in enumerate(fruits):
# 第一圈：i=0, fruit='apple'  → 印 1. apple
# 第二圈：i=1, fruit='banana' → 印 2. banana
# 第三圈：i=2, fruit='cherry' → 印 3. cherry
\`\`\`

---

### \`zip\` — 同時走兩個 list

**比喻：** 拉鍊（zip）的英文就是拉鍊——把兩排齒咬在一起，一次走一格。\`zip\` 把兩個 list 的元素「配對」起來。

\`\`\`python
names  = ['Ziv', 'Bobo']
scores = [90, 85]
for name, score in zip(names, scores):
    print(f'{name}：{score} 分')
\`\`\`

**逐步追蹤：**

\`\`\`
zip 產生：('Ziv', 90), ('Bobo', 85)

第一圈：name='Ziv',  score=90 → 印 Ziv：90 分
第二圈：name='Bobo', score=85 → 印 Bobo：85 分
\`\`\`

> **長度不同時，zip 以較短的為準：**
> \`\`\`python
> names  = ['Ziv', 'Bobo', 'Moon']   # 3 個
> scores = [90, 85]                    # 2 個
> # 只配對兩次：('Ziv',90), ('Bobo',85)
> # Moon 沒有分數可以配，直接捨棄
> \`\`\`
> 為什麼不報錯？因為 zip 的邏輯是「有幾對就配幾對」。如果資料長度不對稱，zip 不會提醒你，要自己注意。

---

### \`while True\` + \`break\` — 直到條件成立才結束

**為什麼用 \`while True\`？**

當你不知道要跑幾次，只知道「某個條件成立才停」，就用 \`while True\`——先進去跑，在裡面判斷要不要停。

\`\`\`python
while True:
    age = input('請輸入年齡（數字）：')
    if age.isdigit():
        age = int(age)
        break
    print('請輸入有效數字')
\`\`\`

**逐步追蹤（使用者輸入 abc，再輸入 25）：**

\`\`\`
第一圈：input → 'abc'
        'abc'.isdigit() = False → 不 break → 印「請輸入有效數字」→ 回開頭

第二圈：input → '25'
        '25'.isdigit() = True → age = 25 → break → 跳出
\`\`\`

**\`while True\` vs \`while 條件\`：**

\`\`\`python
# while 條件：每圈開頭檢查，條件不成立才停
while count < 5:
    count += 1

# while True：永遠進去，你自己決定什麼時候 break
while True:
    if 使用者輸入正確:
        break
\`\`\`

\`while True\` 適合「不知道要幾次、停止條件在裡面判斷」的情境。

---

## 習題

### 習題一｜猜數字（✅ 通過）

**題目：** 用 \`while True + break\` 寫猜數字，隨機產生 1～10，猜中印出共猜幾次

**作答：**

\`\`\`python
import random

answer = random.randint(1, 10)
userinput = int(input('猜數字一個數字，範圍1-10：'))
times = 1

while True:
    if userinput == answer:
        print('恭喜答對了！您一共猜了', times, '次')
        break
    else:
        userinput = int(input('猜錯了，請再試一次：'))
        times += 1
\`\`\`

:::note 觀念補充｜while True + break 怎麼運作

一般 while 迴圈的條件寫在開頭，例如：

\`\`\`python
while userinput != answer:
    ...
\`\`\`

意思是「每次跑迴圈之前先檢查條件，不成立就停」。

\`while True\` 是把條件寫死成「永遠成立」，迴圈不會自己停，你必須在裡面決定什麼時候 \`break\`：

\`\`\`python
while True:       # ← 永遠進來
    if 條件成立:
        break     # ← 你決定在這裡跳出
    # 否則繼續跑
\`\`\`

**逐步追蹤（假設 answer = 7）：**

\`\`\`
userinput = 3，times = 1

【第 1 圈】if 3 == 7？No → 再問，userinput = 9，times = 2
【第 2 圈】if 9 == 7？No → 再問，userinput = 7，times = 3
【第 3 圈】if 7 == 7？Yes → print '猜了 3 次' → break，結束
\`\`\`

**為什麼用 \`while True\` 而不是 \`while userinput != answer\`？**

因為猜數字「不知道要重複幾次」，用 \`while True + break\` 更清楚——停止的邏輯寫在裡面，讀起來一目瞭然。\`while condition\` 適合「已知條件」的情況，例如跑固定次數。

:::

---

### 習題二｜enumerate 選單（✅ 通過）

**題目：** 用 \`enumerate\` 印出選單，選到「離開」用 \`break\` 結束

**作答：**

\`\`\`python
options = ['蘋果', '鳳梨', '香蕉', '離開']

while True:
    for index, option in enumerate(options, start=1):
        print(f"選項{index}：{option}")
    users = int(input('請輸入選項：'))
    if users == 4:
        print('離開')
        break
    elif 1 <= users <= 3:
        print(f"[您選擇了{options[users-1]}]")
\`\`\`

:::note 觀念補充｜為什麼用 while True 而不是只用 for？

\`enumerate\` 是用來印選單的工具，不是控制「要不要繼續」的工具。

選單需要「持續等使用者選，直到選離開才停」——這是 \`while True + break\` 的典型場景：

\`\`\`
while True:
    for enumerate 印選單    ← 每圈都重新印
    取得輸入
    if 離開 → break
    else → 印選了什麼，繼續下一圈
\`\`\`

把 for 放在 while True 裡面，就不需要在 elif 裡再印一次選單——while True 下一圈自然會重印。

:::

:::caution 訂正｜出題時的錯誤說明

批改初期 Claude 說「這題用 \`for + enumerate + break\`，不是 \`while True\`」——這是錯的。

**正確理解：**
- \`enumerate\` → 負責印選單（工具）
- \`while True + break\` → 負責控制「要繼續還是停」（結構）

兩者分工不同，正解是同時使用。

如果只用 \`for\` 沒有 \`while True\`：\`for\` 跑完整個清單就結束了，使用者只能選一次，根本沒有「重複等待輸入」的機制，\`break\` 也只是提前跳出這次 for 迴圈，沒有實際效果。

:::

---

### 習題三｜zip 對應（✅ 通過）

**題目：** \`items = ['咖啡', '蛋糕', '果汁']\`、\`prices = [60, 80, 50]\`，用 \`zip\` 印出每項名稱與價格，最後印總金額

**作答：**

\`\`\`python
items = ['咖啡', '蛋糕', '果汁']
prices = [60, 80, 50]

for item, price in zip(items, prices):
    print(f"{item}：{price} 元")

print(f"總金額：{sum(prices)} 元")
\`\`\`

:::note 觀念補充｜zip 怎麼運作

\`zip\` 把兩個 list 像拉鍊一樣配對，每次各取一個：

\`\`\`python
for item, price in zip(items, prices):
    # 第一圈：item='咖啡', price=60
    # 第二圈：item='蛋糕', price=80
    # 第三圈：item='果汁', price=50
\`\`\`

\`sum(prices)\` 直接加總整個 list，不需要自己累加。

:::

:::caution 訂正｜print 逗號與 f-string 的差異

第一次提交用了 \`print(f"總金額：", sum(prices), "元")\`——這樣寫，print 會在每個逗號分隔的部分之間自動加空格，輸出變成 \`總金額： 190 元\`（多一格）。

改成 f-string 全包：\`print(f"總金額：{sum(prices)} 元")\`，輸出才是 \`總金額：190 元\`。

**規則：** 想精確控制格式，用 f-string；逗號分隔讓 print 自動加空格，不適合需要精確排版的場景。

:::
`;export{e as default};