var e=`## 方法一：程式碼區塊自動按鈕

大多數平台（GitHub、Notion、Obsidian、Docusaurus）在程式碼區塊右上角會**自動添加**複製按鈕，只需使用三個反引號即可：

\`\`\`\`
\`\`\`python
print("這段文字在很多平台上會自動出現複製按鈕")
\`\`\`
\`\`\`\`

---

## 方法二：Docusaurus MDX 自製按鈕

在 \`.md\` 檔案中直接寫 React 按鈕：

\`\`\`jsx
<button
  className="button button--primary"
  onClick={() => navigator.clipboard.writeText('你要複製的內容')}>
  複製特定文字
</button>
\`\`\`
`;export{e as default};