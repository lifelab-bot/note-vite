var e=`7-Zip 是開放原始碼的壓縮程式，主要在 Windows 上運作。
**p7zip** 是 7-Zip 的 Unix/macOS 版本，透過 Homebrew 安裝。

---

## 安裝 p7zip

\`\`\`bash
brew install p7zip
\`\`\`

![brew install p7zip](../../static/img/p7zip/p7zip-01.png)

---

## 加密壓縮

\`\`\`bash
7z a my_file -p -mhe=on
\`\`\`

| 參數 | 說明 |
|------|------|
| \`a\` | Add（建立壓縮檔） |
| \`-p\` | Password（加密，執行後會提示輸入密碼） |
| \`-mhe=on\` | 隱藏壓縮檔內的檔名清單 |

![7z a filename -password](../../static/img/p7zip/p7zip-02.png)

:::caution
\`-mhe=on\` 只適用於 7z 格式，zip 格式不支援隱藏檔名，加上會報錯。

zip 格式加密（不含隱藏檔名）：
\`\`\`bash
7z a my_file -tzip -p
\`\`\`
:::

![zip file can not use mhe](../../static/img/p7zip/p7zip-03.png)
![7z a file -tzip -password](../../static/img/p7zip/p7zip-04.png)

---

## 解壓縮

\`\`\`bash
7z x my_file.7z
\`\`\`

執行後會提示輸入密碼。

![7z unpack](../../static/img/p7zip/p7zip-05.png)
![zip unpack](../../static/img/p7zip/p7zip-06.png)
`;export{e as default};