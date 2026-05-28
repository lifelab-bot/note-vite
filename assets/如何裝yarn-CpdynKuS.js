var e=`## 問題

\`\`\`
zsh: command not found: yarn
\`\`\`

![yarn_notfound](../../static/img/docker/docker_yarn_notfound.png)

---

## 解法

**步驟一：用 Homebrew 安裝**（需先安裝 Homebrew）

\`\`\`bash
brew install yarn
\`\`\`

![yarn_brewinstall](../../static/img/docker/docker_yarn_brewinstall.png)

**步驟二：確認安裝成功**

\`\`\`bash
yarn -v
\`\`\`

![yarn_versioncheck](../../static/img/docker/docker_yarn_versioncheck.png)
`;export{e as default};