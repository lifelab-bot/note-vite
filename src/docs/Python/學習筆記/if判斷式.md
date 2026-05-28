> 涵蓋概念：if / elif / else、邏輯運算子（and / or）、溫度 / 體重單位轉換

---

## 基本語法

```python
# Boolean 判斷
for_sale = False
if for_sale is True:
    print('商品販售中')
else:
    print('商品未販售')

# if / elif / else 結構
if 條件A:
    ...
elif 條件B:
    ...
else:
    ...
```

---

## 邏輯運算子

```python
tmp = int(input('請輸入現在的溫度（整數）：'))

# and：兩端皆為 True 才成立
if tmp >= 0 and tmp < 30:
    print('溫度適宜')

# or：其中一端符合即成立
if tmp <= 0 or tmp >= 30:
    print('溫度不適宜')
```

| 運算子 | 說明 |
|--------|------|
| `and` | 兩個條件都要為 True |
| `or` | 至少一個為 True |
| `not` | 反轉布林值 |

---

## 簡易計算機

```python
operator = input('請輸入運算符號（+ - * /）：')
number_1 = float(input('請輸入第一個數字：'))
number_2 = float(input('請輸入第二個數字：'))

if operator == "+":
    result = number_1 + number_2
elif operator == "-":
    result = number_1 - number_2
elif operator == "*":
    result = number_1 * number_2
elif operator == "/":
    result = number_1 / number_2
else:
    print('不在四則運算範圍')
    result = 'Error'

print('運算結果為：', round(result))
```

:::tip
`float()` 可接受小數輸入，比 `int()` 更通用
:::

---

## 溫度轉換器

**公式：**
- 攝氏 → 華氏：`°F = °C × 1.8 + 32`
- 華氏 → 攝氏：`°C = (°F - 32) / 1.8`

```python
T = float(input('請輸入溫度：'))
unit = input('攝氏寫C，華氏寫F：')

if unit in ('C', 'c'):
    T = T * 1.8 + 32
    unit = '°F'
elif unit in ('F', 'f'):
    T = (T - 32) / 1.8
    unit = '°C'
else:
    print('不正確資料')
    exit()

print('溫度是：', round(T, 2), unit)
```

:::caution 常見陷阱
`elif unit == 'F' or 'f'` 這樣寫是錯的！`'f'` 永遠為 Truthy，條件永遠成立。  
正確寫法：`elif unit in ('F', 'f')` 或 `elif unit == 'F' or unit == 'f'`
:::

---

## 體重轉換器

**公式：** 1 公斤 = 2.2 磅

```python
weight = float(input('請輸入體重：'))
unit = input('請輸入 kg or lb：')

if unit == 'kg':
    weight *= 2.2
    print('轉換磅數為：', round(weight, 2), '磅')
elif unit == 'lb':
    weight /= 2.2
    print('轉換公斤為：', round(weight, 2), '公斤')
else:
    print('不正確資料，請重新輸入')
```
