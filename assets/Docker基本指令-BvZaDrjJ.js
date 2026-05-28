var e=`## 拉取 Image

從倉庫（如 DockerHub）拉取 image。tag 未指定時預設為 \`latest\`。

\`\`\`bash
docker pull <imageName>:<tag>
\`\`\`

![docker pull](../../static/img/docker/docker_pull.png)

---

## 建立新的 Container

\`docker run\` 若本地無 image 會自動先 pull 再 run。

\`\`\`bash
docker run <imageName>
# 或
docker container run <imageName>
\`\`\`

![docker run](../../static/img/docker/docker_run.png)

**命名 Container：**

\`\`\`bash
docker run --name <containerName> <image>:<tag>
\`\`\`

![docker name container](../../static/img/docker/docker_name_container.png)

---

## 查詢指令說明

\`\`\`bash
docker
\`\`\`

![docker help](../../static/img/docker/docker_help.png)

---

## 查看 Docker 版本

\`\`\`bash
docker -v
docker --version
\`\`\`

![docker version](../../static/img/docker/docker_version.png)

---

## 查看 Container 狀態

\`ps\` = process status，可查看所有 container（含未運行的）。

\`\`\`bash
docker ps
docker ps --all
docker ps -a
\`\`\`

![docker ps](../../static/img/docker/docker_ps.png)

---

## 啟動 / 停止 / 重啟 Container

\`\`\`bash
docker start <containerID or containerName>
docker stop <containerID or containerName>
docker restart <containerID or containerName>
\`\`\`

![docker start stop](../../static/img/docker/docker_start_stop.png)

---

## 刪除 Container

需先 stop，或加 \`-f\` 強制刪除正在運行的 container。

\`\`\`bash
docker rm <containerID or containerName>
docker rm -f <containerID or containerName>
\`\`\`

![docker rm container](../../static/img/docker/docker_rm.png)
![docker rmf container](../../static/img/docker/docker_rmf.png)

---

## 查看本地 Images

\`\`\`bash
docker images
\`\`\`

![docker images](../../static/img/docker/docker_images.png)

---

## 刪除 Image

\`\`\`bash
docker rmi <imageName>
\`\`\`

![docker delete image](../../static/img/docker/docker_rm_image.png)
`;export{e as default};