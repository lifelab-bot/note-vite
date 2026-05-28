var e=`> 學習日期：2026-05-19  
> 單元：L1 函式深入 ＋ L2 迴圈進階 ＋ L3 List ＋ L4 Dictionary  
> 狀態：⬜ 進行中

---

## 習題進度

### PART 2｜基礎練習（13 題）

| 題號 | 概念 | 狀態 |
|------|------|------|
| 基礎 L1-1 | 預設參數 | ✅ |
| 基礎 L1-2 | \`*args\` | ✅ |
| 基礎 L1-3 | \`**kwargs\` | ✅ |
| 基礎 L2-1 | \`enumerate\` + \`continue\` | ✅ |
| 基礎 L2-2 | \`zip\` | ✅ |
| 基礎 L2-3 | \`while True\` + \`break\` | ✅ |
| 基礎 L3-1 | List Comprehension + 條件 | ✅ |
| 基礎 L3-2 | 切片 | ✅ |
| 基礎 L4-1 | \`.get()\` 安全取值 | ✅ |
| 基礎 L4-2 | \`.items()\` 遍歷 | ✅ |
| 基礎 L4-3 | \`.get()\` 計數 | ✅ |
| 基礎 L4-4 | Dict Comprehension + 條件 | ⬜ |
| 基礎 L4-5 | 巢狀 dict 遍歷 | ⬜ |

### PART 3｜綜合應用（5 題）

| 題號 | 主題 | 狀態 |
|------|------|------|
| 應用一 | 成績處理流水線 | ⬜ |
| 應用二 | 文字分析器 | ⬜ |
| 應用三 | 購物車結帳 | ⬜ |
| 應用四 | 學生資料整合 | ⬜ |
| 應用五 | 單字學習工具 | ⬜ |

---

## 學習重點

---

## L1｜函式深入

### 運算子補充｜\`**\` 次方

\`\`\`python
2 ** 3       # 8  （2 的 3 次方）
3 ** 2       # 9  （3 的 2 次方）
base ** exp  # base 的 exp 次方
\`\`\`

> \`math.exp(x)\` 是 e^x（自然指數），跟 \`**\` 不同。

---

### \`print\` vs \`return\`

| 題目說 | 用什麼 | 結果 |
|--------|--------|------|
| 印出 | \`print\` | 顯示在畫面，函式回傳 None |
| 回傳 | \`return\` | 把值交給呼叫者，可存可算 |

\`\`\`python
# print → 函式回傳 None
def power_a(base, exp=2):
    print(base ** exp)

a = power_a(3)   # 畫面顯示 9，但 a = None

# return → 呼叫者拿到值
def power_b(base, exp=2):
    return base ** exp

b = power_b(3)   # b = 9，可以繼續用
print(b * 2)     # 18
\`\`\`

驗證 \`return\` 函式：在外面包 \`print(power_b(3))\`

---

### 預設參數

**比喻：** 點咖啡時，大部分人要熱的，所以店員預設做熱的——你不說就是熱的，要冰才需要特別說。

\`\`\`python
def greet(name, greeting='你好'):
    return f'{greeting}，{name}！'

greet('Ziv')           # 你好，Ziv！（用預設值）
greet('Ziv', '嗨')    # 嗨，Ziv！（覆蓋預設值）
\`\`\`

**常見錯誤：預設參數放在前面**

\`\`\`python
# ❌ SyntaxError：預設參數不能在非預設參數前面
def greet(greeting='你好', name):
    ...

# ✅ 正確：預設參數一定在最後面
def greet(name, greeting='你好'):
    ...
\`\`\`

---

### 多個回傳值

Python 並沒有真的「同時回傳多個值」，而是把多個值**自動包成一個 tuple** 回傳。

\`\`\`python
def min_max(nums):
    return min(nums), max(nums)
# 等同於 return (min(nums), max(nums))
\`\`\`

**逐步追蹤：**

\`\`\`python
result = min_max([3, 1, 7, 2])
# result = (1, 7)  ← 是一個 tuple

small, large = min_max([3, 1, 7, 2])
# Python 把 (1, 7) 拆開：small = 1，large = 7
\`\`\`

**常見錯誤：用一個變數接，拿到 tuple 而非數字**

\`\`\`python
result = min_max([3, 1, 7, 2])
print(result + 1)    # ❌ TypeError：tuple 不能加數字

small, large = min_max([3, 1, 7, 2])
print(small + 1)     # ✅ 2
\`\`\`

---

### \`*args\` — 接收任意數量的位置參數

**先搞清楚一件事：\`return\` 多個值 vs \`*args\` 是兩件完全不同的事**

- \`return min(nums), max(nums)\` → 函式的**輸出**，你（寫函式的人）決定回傳幾個值，寫死在程式裡
- \`*args\` → 函式的**輸入**，呼叫者決定要傳幾個值進來，每次呼叫可以不一樣

**\`*args\` 真正解決的問題：讓呼叫者直接傳多個獨立的值，不用先包成 list**

\`\`\`python
# 沒有 *args → 呼叫者必須傳一個 list
def total(nums):
    return sum(nums)

total([1, 2, 3])    # ✅ 傳一個 list
total(1, 2, 3)      # ❌ 報錯，定義只有一個參數

# 有 *args → 呼叫者直接傳個別的值
def total(*nums):
    return sum(nums)

total(1, 2, 3)          # ✅ nums = (1, 2, 3)
total(1, 2, 3, 4, 5)    # ✅ nums = (1, 2, 3, 4, 5)
\`\`\`

兩個版本都能算出同樣的結果，差的是**呼叫者怎麼傳**：
- 沒有 \`*\` → \`total([1, 2, 3])\` 傳 list
- 有 \`*\` → \`total(1, 2, 3)\` 傳個別值

**逐步追蹤：**

\`\`\`python
total(1, 2, 3)
# Python 看到 *nums，把所有傳入的值包成 tuple
# nums = (1, 2, 3)
# sum((1, 2, 3)) = 6
\`\`\`

---

### \`**kwargs\` — 接收任意數量的具名參數

:::note 總複習補充概念（L1 原本未涵蓋）

**比喻：** \`**kwargs\` 像一個「什麼都收、還幫你貼標籤」的箱子。你傳入 \`name='Ziv'\`，它記住「name 對應 Ziv」，包成一個 dict。

\`\`\`python
def profile(**info):
    for key, value in info.items():
        print(f'{key}：{value}')

profile(name='Ziv', city='台灣')
# info = {'name': 'Ziv', 'city': '台灣'}
# 輸出：
# name：Ziv
# city：台灣
\`\`\`

**什麼時候用 \`**kwargs\` 而不是固定參數？**

固定參數是「你寫死有哪些參數」，\`**kwargs\` 是「你不知道呼叫者會傳什麼具名參數」：

\`\`\`python
# 固定參數：只能傳 name 和 city，多傳就報錯
def greet(name, city):
    ...

greet('Ziv', '台灣', age=28)   # ❌ 沒有 age 這個參數

# **kwargs：任意組合都接得住
def build_profile(**info):
    ...

build_profile(name='Ziv', city='台灣', age=28)   # ✅
\`\`\`

**\`*args\` vs \`**kwargs\` 差在哪：**

\`\`\`python
# *args：呼叫者傳「多個值」，不帶名字 → 包成 tuple
total(1, 2, 3)             # nums = (1, 2, 3)

# **kwargs：呼叫者傳「具名參數」，有 key=value → 包成 dict
build_profile(name='Ziv')  # info = {'name': 'Ziv'}
\`\`\`

:::

---

## L2｜迴圈進階

### 運算子補充｜\`%\` 取餘數

\`\`\`python
8 % 2   # 0（偶數）
7 % 2   # 1（奇數）
if x % 2 == 0:  # 判斷偶數
\`\`\`

---

### \`break\` — 中斷整個迴圈

**比喻：** 你在人群中找朋友，找到了就不用繼續找了。

\`\`\`python
for i in range(10):
    if i == 5:
        break
    print(i)    # 印 0 1 2 3 4，到 5 整個停
\`\`\`

---

### \`continue\` — 跳過這次，繼續下一圈

**比喻：** 撿貝殼遇到破掉的就扔掉繼續往前走。

\`\`\`python
for i in range(6):
    if i % 2 == 0:
        continue
    print(i)    # 只印奇數：1 3 5
\`\`\`

**\`break\` vs \`continue\`：**

\`\`\`python
# break：遇到條件 → 整個迴圈結束
for i in range(5):
    if i == 3: break
    print(i)    # 印 0 1 2

# continue：遇到條件 → 跳過這次，繼續跑
for i in range(5):
    if i == 3: continue
    print(i)    # 印 0 1 2 4（跳過 3，4 繼續）
\`\`\`

---

### \`enumerate\` — 同時取 index 和值

\`\`\`python
fruits = ['apple', 'banana', 'cherry']

# ❌ 舊寫法：容易忘記寫 fruits[i]
for i in range(len(fruits)):
    print(f'{i+1}. {i}')       # 寫錯了 → 印出 1.0 / 2.1 / 3.2
    print(f'{i+1}. {fruits[i]}') # 正確但繁瑣

# ✅ enumerate：直接給你兩個東西，不容易出錯
for i, fruit in enumerate(fruits):
    print(f'{i+1}. {fruit}')
\`\`\`

**逐步追蹤：**

\`\`\`
enumerate(['apple','banana','cherry'])
→ 產生：(0,'apple'), (1,'banana'), (2,'cherry')
\`\`\`

---

### \`zip\` — 同時跑兩個 list

**比喻：** 拉鍊把兩排齒咬在一起，一次走一格。

\`\`\`python
names  = ['Ziv', 'Bobo']
scores = [90, 85]
for name, score in zip(names, scores):
    print(f'{name}：{score} 分')
\`\`\`

> **長度不同時，zip 以較短的為準：**
> \`\`\`python
> names  = ['Ziv', 'Bobo', 'Moon']   # 3 個
> scores = [90, 85]                    # 2 個
> # 只配對兩次：('Ziv',90), ('Bobo',85)
> # Moon 沒有分數可配，直接捨棄
> \`\`\`
> zip 的邏輯是「有幾對就配幾對」，不會報錯，但也不會提醒你資料少了，要自己注意。

---

### \`isdigit()\` — 判斷字串是否全為數字

\`\`\`python
'25'.isdigit()    # True
'abc'.isdigit()   # False
'12.5'.isdigit()  # False（小數點不算）
'-3'.isdigit()    # False（負號不算）
\`\`\`

> \`input()\` 取得的永遠是字串，用 \`isdigit()\` 確認再 \`int()\` 轉型，避免炸掉。

---

### \`while True\` + \`break\`

**比喻：** 不知道要跑幾次，只知道「條件成立才停」→ 先進去，在裡面決定何時跳出。

\`\`\`python
while True:
    age = input('請輸入年齡：')
    if age.isdigit():
        age = int(age)
        break
    print('請輸入數字')
\`\`\`

**逐步追蹤（輸入 abc，再輸入 25）：**

\`\`\`
第一圈：'abc'.isdigit() = False → 繼續
第二圈：'25'.isdigit() = True  → break → 跳出
\`\`\`

---

## L3｜List 完整操作

### 補充｜\`len()\` 不只用在 list

\`\`\`python
len([1, 2, 3])          # 3
len('hello')            # 5（字元數）
len({'a': 1, 'b': 2})   # 2（key 數）
\`\`\`

---

### 常用方法

**兩類要分清楚：**

\`\`\`python
# ── 直接修改原 list，沒有回傳值 ──
nums.append(9)      # 尾端加入
nums.insert(0, 0)   # 指定位置插入
nums.remove(1)      # 刪除第一個值為 1 的元素
nums.sort()         # 升序排序
nums.reverse()      # 反轉

# ── 回傳值 ──
last  = nums.pop()      # 移除並回傳最後一個
count = nums.count(1)   # 回傳值 1 出現幾次
idx   = nums.index(4)   # 回傳值 4 的 index
\`\`\`

**常見錯誤：把 \`sort()\` 賦值**

\`\`\`python
result = nums.sort()   # ❌ result = None！
result = sorted(nums)  # ✅ 回傳新 list，原 list 不動
\`\`\`

---

### List Comprehension

**格式拆解：**

\`\`\`
[ 表達式      for 變數 in 範圍   if 條件（可省略）]
  ↑ 放什麼      ↑ 跑什麼          ↑ 篩什麼
\`\`\`

**\`if\` 的兩個位置，機制完全不同：**

\`\`\`python
arr = [72, 45, 88]

# for 後面的 if → 控制「這圈要不要跑」，不跑的元素消失
[x for x in arr if x >= 60]
# 45 那圈整個跳過 → 結果：[72, 88]（少了 45）

# for 前面的 if...else → 每圈都跑，只決定「放什麼值」
['pass' if x >= 60 else 'fail' for x in arr]
# 45 還是跑，只是放 'fail' → 結果：['pass', 'fail', 'pass']（三個都在）
\`\`\`

**記憶口訣：** \`for\` 後面只有 \`if\`（篩選，元素可能消失）；\`for\` 前面一定要有 \`if...else\`（轉換，元素都保留）

---

### 切片 Slice

**格式：\`list[start:stop:step]\`**（stop 不含）

**為什麼 stop 不含？**

\`\`\`python
nums = [0, 1, 2, 3, 4, 5]

# 好處 1：很好算長度 → stop - start = 元素數
nums[1:4]   # 4 - 1 = 3 個 → [1, 2, 3] ✓

# 好處 2：切開後剛好接上，不重疊也不漏
nums[:3]    # [0, 1, 2]
nums[3:]    # [3, 4, 5]
# 合起來 = 整個 list，index 3 不會重複出現
\`\`\`

\`\`\`python
nums[1:4]    # [1, 2, 3]（不含 index 4）
nums[::2]    # [0, 2, 4]（每隔一個）
nums[::-1]   # [5, 4, 3, 2, 1, 0]（反轉）
\`\`\`

**常見錯誤：想要包含 index 4，stop 要寫 5**

\`\`\`python
nums[1:4]   # [1, 2, 3] ← 不含 4
nums[1:5]   # [1, 2, 3, 4] ← 想要 4 就寫 5
\`\`\`

---

## L4｜Dictionary

### 為什麼用 dict？

**比喻：** list 像用「編號」找的置物櫃，dict 像有「名字標籤」的置物櫃——一看就知道找哪格。

---

### 取值：\`[]\` vs \`.get()\`

\`\`\`python
d = {'name': 'Ziv'}

d['name']               # 'Ziv' ✅
d['email']              # ❌ KeyError

d.get('email')          # None（不炸）
d.get('email', 'N/A')  # 'N/A'（自訂預設值）
\`\`\`

---

### 遍歷

\`\`\`python
for key in d.keys():           # 只跑 key
for value in d.values():       # 只跑 value
for key, value in d.items():   # 同時跑（最常用）
\`\`\`

**常見錯誤：** \`.items\` 忘加括號 → 只是「指向方法」，不會執行。

---

### \`.get()\` 計數技巧

\`\`\`python
count = {}
for ch in 'hello':
    count[ch] = count.get(ch, 0) + 1
# {'h':1, 'e':1, 'l':2, 'o':1}
\`\`\`

**逐步追蹤：**

\`\`\`
ch='h'：get('h',0)=0 → 存 1
ch='l'：get('l',0)=0 → 存 1
ch='l'：get('l',0)=1 → 存 2
\`\`\`

---

### Dict Comprehension

\`\`\`python
# 基本
{x: x**2 for x in range(1, 6)}
# {1:1, 2:4, 3:9, 4:16, 5:25}

# 條件決定 value
{k: 'pass' if v >= 70 else 'fail' for k, v in grades.items()}
\`\`\`

---

### 巢狀 dict

\`\`\`python
students = {'Ziv': {'score': 90, 'grade': 'A'}}

students['Ziv']['score']   # 90
# Step 1：students['Ziv'] → {'score':90,'grade':'A'}
# Step 2：['score'] → 90
\`\`\`

---

## 習題作答紀錄

### 基礎 L1-1｜預設參數 ✅

\`\`\`python
def power(base, exp=2):
    return(base ** exp)
\`\`\`

:::note 觀念整理
\`**\` 是 Python 的次方運算子：\`base ** exp\` = base 的 exp 次方。預設 \`exp=2\`，不傳就是平方；想要其他次方再傳入。

驗證 return 函式：在外面包 \`print(power(3))\` 確認結果，不要把 \`print\` 寫進函式裡。
:::

:::caution 本次訂正
一開始用了 \`return(base ** 2, exp ** 2)\`（把 exp 寫死成 2，且誤回傳 tuple）→ 後來用 \`return(base)\` 完全漏掉 exp → 再用 \`print(base ** exp)\`（方向對但用 print 不是 return）。

根本原因：\`**\` 運算子未教、\`print\` vs \`return\` 混淆。
:::

---

### 基礎 L1-2｜\`*args\` ✅

\`\`\`python
def avg(*nums):
    return sum(nums)/len(nums)
\`\`\`

:::note 觀念整理
\`*nums\` 把傳入的所有個別數字包成 tuple，\`sum(nums)/len(nums)\` 計算平均。Python 3 的 \`/\` 永遠回傳 float，所以 \`avg(10, 20, 30)\` → \`20.0\`。
:::

---

### 基礎 L1-3｜\`**kwargs\` ✅

\`\`\`python
def make_tag(**attrs):
    for x, y in attrs.items():
        print(f'{x}="{y}"')
\`\`\`

:::note 觀念整理
\`**attrs\` 把傳入的具名參數包成 dict，用 \`for x, y in attrs.items()\` 逐對取出，f-string 格式 \`{x}="{y}"\` 符合 \`key="value"\` 的輸出要求。

這裡用 \`print\` 而非 \`return\`，因為題目說「**印出**」——和 L1-1 說「**回傳**」是不同要求。
:::

---

### 基礎 L2-1｜\`enumerate\` + \`continue\` ✅

\`\`\`python
animals = ['貓', '狗', None, '兔', None, '鳥']

for i, animal in enumerate(animals, start=1):
    if animal == None:
        continue
    print(f"{i}. {animal}")
\`\`\`

:::note 觀念整理
\`enumerate(animals, start=1)\` 讓 i 從 1 開始計數，每個元素依序拿到正確的編號（包含 None 的位置）。遇到 None 就 \`continue\` 跳過這圈，但 i 不重置，所以輸出有缺口（1、2、4、6）——這是正確行為，符合「保留原始 index 位置」的語意。

比較：\`animal == None\` 和 \`animal is None\` 效果相同，但 Python 習慣用 \`is None\`，更明確且效能略好。
:::

---

### 基礎 L2-2｜\`zip\` ✅

\`\`\`python
subjects = ['國文', '數學', '英文']
scores = [82, 75, 91]
t = sum(scores)

for subject, score in zip(subjects, scores):
    print(f"{subject}：{score}")
print(f"總分是：{t}")
\`\`\`

:::note 觀念整理
\`zip\` 把兩個 list 配對，一次取出一對 \`(subject, score)\`。\`sum(scores)\` 移到迴圈外面只算一次，效率更好也更清楚。最後的 \`print\` 在迴圈外，所以總分只印一行。
:::

---

### 基礎 L2-3｜\`while True\` + \`break\` ✅

\`\`\`python
while True:
    users = input('請輸入1-10整數：')
    if users.isdigit():
        users = int(users)
        if 1 <= users <= 10:
            print(f"您輸入了：{users}")
            break
        else:
            print('輸入不合法（非數字、超出範圍)')
    else:
        print('輸入不合法（非數字、超出範圍)')
\`\`\`

:::note 觀念整理
\`while True\` 搭配條件 \`break\` 的標準模式：先無限迴圈，在裡面決定何時跳出。\`isdigit()\` 只接受純數字字串（不含負號、小數點），所以需要兩層判斷：先確認是數字，再確認在範圍內。兩種不合法情況各有一條 \`else\` 分支印提示。
:::

:::caution 本次訂正
過程中出現四個錯誤，依序修正：

1. \`input()\` 寫在 while 外面 → 只問一次，輸入錯了也不重問
2. \`for user in users\` → \`users\` 是字串，for 迴圈會逐字元跑（\`'10'\` 拆成 \`'1'\` 和 \`'0'\`），不是對整個輸入判斷
3. \`break\` 縮排在 if 外面 → 每次迴圈跑完必然執行，不管輸入對不對都會跳出
4. 不合法時沒有印提示 → 加兩個 \`else\` 分支，涵蓋「非數字」和「超出範圍」兩種情況

關鍵認知：\`for\` 跑字串是跑「每個字元」，要處理整個輸入字串不需要 \`for\`，直接對 \`users\` 整體呼叫 \`isdigit()\` 即可。
:::

---

### 基礎 L3-1｜List Comprehension + 條件 ✅

\`\`\`python
nums = [15, 3, 42, 7, 28, 11, 36, 9]
num = [x for x in nums if x > 10 and x % 2 == 0]
print(num)
\`\`\`

:::note 觀念整理
\`for\` 後面的 \`if\` 是篩選條件——不符合的元素整圈跳過，不進 list。兩個條件用 \`and\` 連接，同時成立才保留。結果 \`[42, 28, 36]\`，其餘元素消失。

注意：「大於 10」是 \`x > 10\`（嚴格），\`x >= 10\` 是「大於等於」，語意不同，下次要看清楚題目用字。
:::

---

### 基礎 L3-2｜切片 ✅

\`\`\`python
data = [10, 20, 30, 40, 50, 60, 70, 80]
print(data[2:6])   # [30, 40, 50, 60]
print(data[::2])   # [10, 30, 50, 70]
print(data[::-1])  # [80, 70, 60, 50, 40, 30, 20, 10]
\`\`\`

:::note 觀念整理
切片格式 \`list[start:stop:step]\`，stop 不含。三個常用模式：

- \`[2:6]\`：取 index 2 到 5（stop=6 不含）
- \`[::2]\`：step=2，每隔一個取，從頭到尾
- \`[::-1]\`：step=-1，倒著走，等同反轉

stop 不含的設計讓「長度 = stop - start」成立，也讓 \`[:n]\` + \`[n:]\` 剛好合起來等於整個 list。
:::

---

### 基礎 L4-1｜\`.get()\` 安全取值 ✅

\`\`\`python
config = {'debug': True, 'timeout': 30}

x = config.get('debug', False)
y = config.get('retries', 3)
z = config.get('timeout', 60)

print(x, y, z)   # True 3 30
\`\`\`

:::note 觀念整理
\`.get(key, 預設值)\` 的邏輯：key 存在就回傳原值，key 不存在才用預設值。

| key | 存在？ | 回傳 |
|-----|-------|------|
| \`'debug'\` | ✅ 值是 \`True\` | \`True\` |
| \`'retries'\` | ❌ 不存在 | \`3\`（預設值） |
| \`'timeout'\` | ✅ 值是 \`30\` | \`30\`（不是 60） |

技術上省略預設值（\`config.get('debug')\`）也能跑，但題目要求寫上預設值，符合「不存在時的備案」語意。
:::

:::caution 本次訂正
一開始寫 \`config['debug'] = 'False'\`，把「讀取」和「修改」搞混了。\`d[key] = value\` 是寫入，\`.get()\` 是讀取，兩件事完全不同。另外 \`'False'\` 是字串，預設值應為布林 \`False\`。
:::

---

### 基礎 L4-2｜\`.items()\` 遍歷 ✅

\`\`\`python
stock = {'A股': 120, 'B股': 85, 'C股': 200, 'D股': 45}

for x, y in stock.items():
    if y < 100:
        continue
    print(x, y)
\`\`\`

:::note 觀念整理
\`.items()\` 每次回傳一對 \`(key, value)\`，搭配 \`for x, y in\` 解包，可以同時拿到名稱和數值。用 \`continue\` 跳過不符合的元素，比 \`if y > 100: print\` 的寫法邏輯一樣，只是方向相反。

\`continue\` 後面不需要 \`else\`——\`continue\` 一執行這圈就結束，後面的程式碼自然跳過，\`else\` 是多餘的。
:::

---

### 基礎 L4-3｜\`.get()\` 計數 ✅

\`\`\`python
colors = ['red', 'blue', 'red', 'green', 'blue', 'red', 'green']
col = {}

for ch in colors:
    col[ch] = col.get(ch, 0) + 1
print(f"{col}")
\`\`\`

:::note 觀念整理
\`.get(key, 預設值)\` 讓你在 key 不存在時自動從 0 開始計數，不會因為 key 不存在而拋出 KeyError。每次迭代：先查這個 key 目前是幾次（不存在就是 0），加 1 後存回去。

**常見錯誤：** 把 \`.get()\` 呼叫在迴圈變數上（\`ch.get(...)\`）而非計數表（\`col.get(...)\`）。\`ch\` 是字串，字串沒有 \`.get()\` 方法，會拋出 \`AttributeError\`。
:::

*L4-4～L4-5、應用題通過後陸續補上*
`;export{e as default};