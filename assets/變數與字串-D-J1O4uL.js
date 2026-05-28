var e=`> 涵蓋概念：變數引用陷阱、全域/區域變數、int 轉換與進制、字串建立與轉義、字串方法進階（slice、split、replace、strip、find vs index）

---

## 變數引用陷阱

\`\`\`python
# append 修改的是原本的 list，b 跟著動
a = []
b = a
a.append(3)
print(a, b)  # [3] [3]

# 重新賦值不會影響 b
c = []
d = c
c = [4]
print(c, d)  # [4] []
\`\`\`

:::tip 關鍵觀念
\`b = a\` 讓 b 和 a **指向同一個 list 物件**。  
\`a.append()\` 是修改物件內容 → b 跟著變。  
\`c = [4]\` 是讓 c **指向全新物件** → d 不受影響。
:::

---

## 變數交換

\`\`\`python
a, b, c = 1, 2, 3
a, b, c = b, c, a
print(a, b, c)  # 2 3 1
\`\`\`

---

## 逗號宣告（Tuple）

\`\`\`python
a = (1,)    # tuple，含一個元素
c1 = a      # c1 = (1,)，整個 tuple
c2, = a     # c2 = 1，解包取出元素
print(c1, c2)  # (1,) 1
\`\`\`

---

## 全域 vs 區域變數

\`\`\`python
a = []

def f1():
    a.append(1)  # 修改全域 list，不是重新賦值 → 影響全域
    c = [4]      # 重新賦值 → 變成區域變數，只存在函式內
    print(a, c)

f1()  # [1] [4]
print(a)  # [1]
\`\`\`

\`\`\`python
x = 2

def hello():
    x = 1        # 區域變數，只在函式內
    print(x)     # 1
    print(locals())   # {'x': 1}

hello()
print(x)  # 2（全域沒變）
\`\`\`

---

## int 轉換對照

\`\`\`python
int(5.1)    # 5（直接截斷，不四捨五入）
int(9/2)    # 4
int('5')    # 5
int(True)   # 1
int(False)  # 0
\`\`\`

\`\`\`python
# 進制轉換
int('101', 2)   # 5（二進制）
int('101', 8)   # 65（八進制）
int('101', 16)  # 257（十六進制）
\`\`\`

---

## 進制表示法

\`\`\`python
0b1111   # 15（二進制，前綴 0b）
0o1111   # 585（八進制，前綴 0o）
0x1111   # 4369（十六進制，前綴 0x）
\`\`\`

---

## 布林 Truthy / Falsy

\`\`\`python
# Truthy（視為 True）
bool(1)      # True
bool(-1)     # True
bool('ok')   # True

# Falsy（視為 False）
bool(0)      # False
bool(0.0)    # False
bool('')     # False
bool(False)  # False
\`\`\`

---

## 字串建立與轉義

\`\`\`python
# 單行字串：' ' 或 " "
# 多行字串：''' ''' 或 """ """

# 轉義字元
# \\\\  顯示反斜線
# \\'  顯示單引號
# \\n  換行
# \\t  Tab
# \\b  刪除前一個字元

# raw string：前綴 r，不進行轉義
a = r'123\\n456'
b = '123\\n456'
print(a)  # 123\\n456
print(b)  # 123
          # 456
\`\`\`

---

## 字串方法進階

### Slice 切片

\`\`\`python
s = 'hello'
s[:]        # 全部
s[2:]       # 從 index 2 到結尾
s[:3]       # 從頭到 index 2（不含 3）
s[1:4]      # index 1 到 3
s[0:5:2]    # 每隔 2 個取一個
\`\`\`

### split 拆分

\`\`\`python
a = 'hello world, I am oxxo'
a.split(',')   # ['hello world', ' I am oxxo']
a.split(' ')   # 依空白拆
a.split()      # 不指定 = 依空白，且自動略過多餘空白
\`\`\`

### replace 取代

\`\`\`python
a = 'hello world, lol'
a.replace('l', 'XXX')     # 全部替換
a.replace('l', 'XXX', 2)  # 只替換前 2 個
\`\`\`

### strip 剝除

\`\`\`python
a = '  hello!!'
a.strip()    # 'hello!!'（去兩端空白）
a.lstrip()   # 'hello!!'（去左端空白）
a.rstrip()   # '  hello!!'（去右端空白）
a.strip('!') # '  hello'（去指定字元）
\`\`\`

### find vs index

\`\`\`python
a = 'hello world, I am oxxo, I am a designer!'
a.find('am')    # 15，找不到回傳 -1
a.rfind('am')   # 26，從右找，位置仍從左算
a.index('am')   # 找不到直接報錯（比 find 嚴格）
\`\`\`
`;export{e as default};