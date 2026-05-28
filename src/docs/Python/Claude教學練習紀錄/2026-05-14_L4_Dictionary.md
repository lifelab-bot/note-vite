> 學習日期：2026-05-14
> 單元：階段二 L4 — Dictionary
> 狀態：✅ 全部通過（習題一 ✅、熱身 A ✅、熱身 B ✅、習題二 ✅、熱身 C ✅、習題三 ✅）

---

## 學習重點

### 為什麼用 dict？

**比喻：** list 像一排置物櫃，用「編號」找東西（index 0, 1, 2…）。dict 像有貼名字標籤的置物櫃，用「名字」找東西。

```python
# list：靠位置找，要自己記得每個 index 代表什麼
student_list = ['Ziv', 90, '台灣']
student_list[1]     # 90（要自己記得 index 1 是分數）

# dict：用有意義的名字找，一看就懂
student = {'name': 'Ziv', 'score': 90, 'city': '台灣'}
student['score']    # 90
```

---

### 取值：`[]` vs `.get()`

```python
person = {'name': 'Ziv', 'age': 28}

person['name']               # 'Ziv' ✅
person['email']              # ❌ KeyError：key 不存在就炸

person.get('name')           # 'Ziv'
person.get('email')          # None（不炸，回傳 None）
person.get('email', 'N/A')  # 'N/A'（自訂預設值）
```

**何時用哪個：**

| 情況 | 用法 |
|------|------|
| 確定 key 一定存在 | `d[key]` |
| 不確定 key 是否存在（查詢、讀設定） | `d.get(key, 預設值)` |

---

### 新增、修改、刪除

```python
person = {'name': 'Ziv', 'age': 28}

# 新增 / 修改（同一個語法）
person['city'] = '台灣'   # key 不存在 → 新增
person['age'] = 29        # key 已存在 → 覆蓋（修改）

# 刪除
del person['city']              # 直接刪，沒有回傳值
removed = person.pop('age')     # 刪除並回傳被刪的值（removed = 29）
```

---

### 遍歷：`.keys()` / `.values()` / `.items()`

```python
d = {'a': 1, 'b': 2, 'c': 3}

for key in d.keys():           # 只跑 key
    print(key)                 # a, b, c

for value in d.values():       # 只跑 value
    print(value)               # 1, 2, 3

for key, value in d.items():   # 同時跑（最常用）
    print(f'{key}：{value}')   # a：1 / b：2 / c：3
```

**常見錯誤：忘記加括號**

```python
for key, value in d.items:    # ❌ items 是方法，不加 () 只是「指向方法」，不會執行
for key, value in d.items():  # ✅
```

---

### `.get()` 計數技巧

**為什麼需要這個技巧？**

第一次遇到某個 key 時，dict 裡還沒有它，直接做 `+= 1` 會炸：

```python
count = {}
count['a'] += 1   # ❌ KeyError：'a' 不存在，沒辦法 +1
```

用 `.get()` 解決：key 不存在就先給 0，再加 1：

```python
count = {}
for ch in 'hello':
    count[ch] = count.get(ch, 0) + 1
```

**逐步追蹤：**

```
ch='h'：count.get('h', 0) = 0（h 不在）→ 存入 1 → {'h': 1}
ch='e'：count.get('e', 0) = 0         → 存入 1 → {'h':1, 'e':1}
ch='l'：count.get('l', 0) = 0         → 存入 1 → {..., 'l':1}
ch='l'：count.get('l', 0) = 1（l 在了）→ 存入 2 → {..., 'l':2}
ch='o'：count.get('o', 0) = 0         → 存入 1 → {'h':1,'e':1,'l':2,'o':1}
```

---

### Dict Comprehension

**格式對照 List Comprehension：**

```python
# list comprehension
[x**2 for x in range(1, 6)]
# [1, 4, 9, 16, 25]

# dict comprehension（改成 {key: value}）
{x: x**2 for x in range(1, 6)}
# {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}
```

**格式：** `{key表達式: value表達式 for 變數 in 範圍 if 條件（可省略）}`

**條件決定 value（三元運算子）：**

```python
grades = {'Ziv': 90, 'Bobo': 60, 'Moon': 75}
result = {k: 'pass' if v >= 70 else 'fail' for k, v in grades.items()}
```

**逐步追蹤：**

```
k='Ziv',  v=90 → 90>=70 → 'pass'
k='Bobo', v=60 → 60<70  → 'fail'
k='Moon', v=75 → 75>=70 → 'pass'
結果：{'Ziv': 'pass', 'Bobo': 'fail', 'Moon': 'pass'}
```

---

### 巢狀 dict（Nested dict）

**概念：** dict 的 value 本身也是 dict。

```python
students = {
    'Ziv':  {'score': 90, 'grade': 'A'},
    'Bobo': {'score': 75, 'grade': 'B'},
}
```

**取值：兩層 key**

```python
students['Ziv']            # {'score': 90, 'grade': 'A'}（整個內層 dict）
students['Ziv']['score']   # 90
```

**逐步拆解：**

```python
students['Ziv']['score']
# Step 1：students['Ziv'] → {'score': 90, 'grade': 'A'}
# Step 2：{'score': 90, 'grade': 'A'}['score'] → 90
```

**遍歷巢狀 dict：**

```python
for name, info in students.items():
    print(f"{name}：{info['score']} 分，等級 {info['grade']}")
# Ziv：90 分，等級 A
# Bobo：75 分，等級 B
```

---

## 習題

### 習題一｜簡易電話簿（✅ 通過）

**題目：** 寫一個 while 選單電話簿，支援新增、查詢、列出所有、離開。

**最終作答：**

```python
options = ['離開', '新增聯絡人（輸入名字與電話）', '查詢聯絡人', '列出所有聯絡人']
contact = {}
while True:
    for index, option in enumerate(options, start=0):
        print(f"{index}:{option}")
    users = int(input('請輸入選項：'))
    if users == 0:
        print('再見')
        break
    elif users == 1:
        Name = input('請輸入名字：')
        Phone = input('請輸入電話：')
        contact[Name] = Phone
        print(f"已新增{Name}")
    elif users == 2:
        Name = input('請輸入查詢欲名字：')
        if Name in contact:
            print('聯絡人:', Name, '電話:', contact[Name])
        else:
            print(f"找不到此人")
    elif users == 3:
        for key, value in contact.items():
            print(f"聯絡人:{key} 電話:{value}")
```

:::note 觀念整理

**Dict 存取核心概念：**

- `contact[Name] = Phone` → 用「變數」當 key，每個人的名字都是獨立的 key
- `contact['Name'] = Phone` → 用「固定字串」當 key，每次都覆蓋同一格，只剩最後一筆
- `if Name in contact` → 檢查 key 是否存在，比直接存取安全（不存在不會報錯）
- `contact[Name]` → 用 key 取出對應的 value，等同 list 的 `arr[index]`

**為什麼不能用 `Phone` 變數查詢：**
`Phone` 只有在「選 1 新增」時才被建立。如果第一個動作就選 2 查詢，`Phone` 根本不存在會報錯；就算存在，它也只記得最後一次新增的電話，查詢不同的人就會拿到錯誤的電話。應該用 `contact[Name]` 直接從 dict 取對應的值。

**`contact.items()` 一定要加括號：**
`.items` 是方法，不加 `()` 只是「指向這個方法」，不是「執行它」。要取得 key-value 對必須加 `()`。

:::

:::caution 本次訂正

**`print(options)` vs `print(option)` — 差一個 `s`：**

```python
# 錯誤：印整個 list，跑 4 次就出現 4 次 [1,2,3,4]
for index, option in enumerate(options, start=1):
    print(options)

# 正確：每次印一個元素
for index, option in enumerate(options, start=1):
    print(option)
```

`options` 是整個 list，`option` 是迴圈每次取出的單一值。差一個 `s` 行為完全不同。

:::

---

### 熱身 A｜`.isalpha()` 篩字母（✅ 通過）

**題目：** 給定 `text = 'Hi! 123'`，用 for 迴圈只印出英文字母，跳過數字和符號。

**作答：**
```python
text = 'Hi! 123'
for x in text:
    if x.isalpha():
        print(x)
```

:::note 觀念整理
`.isalpha()` 是字串方法，對單一字元使用，回傳 `True`（字母）或 `False`（數字、符號、空白）。搭配 for 迴圈逐字元跑，加上 `if` 篩選，就能從任意字串裡取出所有字母。
:::

---

### 熱身 B｜`.get()` 計數（✅ 通過）

**題目：** 給定 `letters = ['a', 'b', 'a', 'c', 'b', 'a']`，用 for 迴圈數每個字母出現幾次，存到 dict 並印出。

**作答：**
```python
letters = ['a', 'b', 'a', 'c', 'b', 'a']
count = {}
for letter in letters:
    count[letter] = count.get(letter, 0) + 1
print(count)
```

:::note 觀念整理
`count.get(letter, 0) + 1` 是計數的標準寫法：
- key 第一次出現 → `get` 回傳預設值 `0`，加 1 後存入
- key 再次出現 → `get` 回傳現有值，再加 1

不需要先判斷 key 是否存在，一行搞定。
:::

---

### 習題二｜字母計數（✅ 通過）

**題目：** 輸入一段文字，統計每個英文字母出現幾次（不區分大小寫，忽略非字母字元），印出每個字母與次數。

**作答：**
```python
users = input('請輸入：')
users = users.lower()
count = {}

for user in users:
    if user.isalpha():
        count[user] = count.get(user, 0) + 1

for key, value in count.items():
    print(f"{key}: {value}")
```

:::note 觀念整理
三個工具組合使用：
- `.lower()` → 轉小寫，讓 `H` 和 `h` 算同一個
- `.isalpha()` → 篩掉數字、空白、符號
- `.get(key, 0) + 1` → 計數

輸出用 `for key, value in count.items()` 逐行印，而非 `print(count)`，因為 `print(count)` 印的是 Python 內部格式（帶大括號和引號），不符合題目要求的排版。
:::

:::caution 本次訂正

**`print(count)` 和 for 迴圈逐行印出的差異：**

```python
# 第一次作答（格式不符）
print(count)
# 輸出：{'h': 1, 'e': 1, 'l': 3, 'o': 2, 'w': 1, 'r': 1, 'd': 1}

# 修正後（逐行自訂格式）
for key, value in count.items():
    print(f"{key}: {value}")
# 輸出：
# h: 1
# e: 1
# l: 3
```

`print(dict)` 是讓 Python 自動把整個 dict 轉成字串印出，格式固定無法自訂。  
for 迴圈讓你拿到每一筆 key / value，可以自由決定每行的輸出格式。

:::

---

### 熱身 C｜for 迴圈 → dict comprehension（✅ 通過）

**題目：** 把下方 for 迴圈改寫成一行 dict comprehension：
```python
result = {}
for x in range(1, 6):
    result[x] = x * 2
```

**作答：**
```python
result = {x: x*2 for x in range(1, 6)}
print(result)
```

:::note 觀念整理
Dict comprehension 格式：`{key: value for 變數 in 範圍}`

對應關係：
- for 迴圈的 `result[x]` → comprehension 的 `x`（key）
- for 迴圈的 `x * 2` → comprehension 的 `x*2`（value）
- for 迴圈的 `for x in range(1, 6)` → comprehension 的 `for x in range(1, 6)`

兩者輸出結果完全相同：`{1: 2, 2: 4, 3: 6, 4: 8, 5: 10}`
:::

---

### 習題三｜Dict Comprehension 成績標記（✅ 通過）

**題目：** `scores = {'Ziv': 90, 'Bobo': 75, 'Manto': 88, 'Moon': 62}`，用 dict comprehension 產生新 dict，70 分以上 `'pass'`，以下 `'fail'`。

**作答：**
```python
scores = {'Ziv': 90, 'Bobo': 75, 'Manto': 88, 'Moon': 62}
score = {x: 'pass' if y >= 70 else 'fail' for x, y in scores.items()}
print(score)
```

:::note 觀念整理
Dict comprehension 加上條件判斷值的完整格式：

```python
{key: A if 條件 else B for key, value in dict.items()}
```

- `x, y in scores.items()` → 同時解包 key（名字）和 value（分數）
- `'pass' if y >= 70 else 'fail'` → 三元運算子決定 value 的內容
- 結果：`{'Ziv': 'pass', 'Bobo': 'pass', 'Manto': 'pass', 'Moon': 'fail'}`

這是 dict comprehension 最完整的形式，把「建 dict + 條件判斷」壓縮進一行。
:::

---
