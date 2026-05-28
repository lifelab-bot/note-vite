var e=`> 涵蓋概念：len、find、capitalize、upper、lower、count、replace、isalpha、in

---

## 常用字串方法

\`\`\`python
name = 'afra Lin'

print(len(name))           # 8，字元數
print(name.find(' '))      # 4，第一個空格位置（找不到回傳 -1）
print(name.capitalize())   # 'Afra lin'，首字母大寫
print(name.upper())        # 'AFRA LIN'，全大寫
print(name.lower())        # 'afra lin'，全小寫

phone = '0912-345-678'
print(phone.count('-'))            # 2，計算 '-' 出現次數
print(phone.replace('-', '*'))     # '0912*345*678'，取代字元
\`\`\`

---

## 方法速查表

| 方法 | 說明 |
|------|------|
| \`len(s)\` | 字元總數 |
| \`s.find(x)\` | 找子字串位置，找不到回傳 \`-1\` |
| \`x in s\` | 判斷是否包含（推薦取代 find） |
| \`s.isalpha()\` | 是否全為字母 |
| \`s.capitalize()\` | 首字母大寫 |
| \`s.upper()\` | 全大寫 |
| \`s.lower()\` | 全小寫 |
| \`s.count(x)\` | 計算子字串出現次數 |
| \`s.replace(old, new)\` | 取代字串 |

---

## 字串驗證練習

**題目：** 驗證使用者名稱規則
- 不超過 12 個字元
- 不包含空格
- 只能包含字母

\`\`\`python
username = input('請輸入使用者名稱：')

if len(username) > 12:
    print('您的使用者名稱不能超過12個字元。')
elif " " in username:
    print('您的使用者名稱不能包含空格。')
elif not username.isalpha():
    print('您的使用者名稱不能包含其他字元。')
else:
    print('～～歡迎～～' + username)
\`\`\`

:::caution 常見陷阱：find 的陷阱
不要用 \`elif username.find(" ")\` 判斷空格！  
\`find()\` 找不到時回傳 \`-1\`，而 \`-1\` 是 Truthy，會被誤判為「找到空格」。  
**正確做法：** 用 \`" " in username\`
:::
`;export{e as default};