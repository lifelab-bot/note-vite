var e=`## 問題

Terminal 輸入 \`code .\` 出現：

\`\`\`
-bash: code: command not found
\`\`\`

![vscode_con._notfound](../../static/img/docker/docker_vscode_con_erro.png)

---

## 解法

**步驟一：確認 VS Code 已安裝且在應用程式資料夾**

**步驟二：在 VS Code 重新安裝 shell command**

按快捷鍵 \`⌘ ⇧ P\`，搜尋 \`shell\`，找到以下選項：

- \`Shell Command: Uninstall 'code' command in PATH\`
- \`Shell Command: Install 'code' command in PATH\`

先 Uninstall，再 Install。

Uninstall：

![vscode uninstall](../../static/img/docker/docker_vscode_con_uninstall.png)

Install：

![vscode install](../../static/img/docker/docker_vscode_con_install.png)

完成後在 Terminal 輸入 \`code .\` 即可正常開啟 VS Code。
`;export{e as default};