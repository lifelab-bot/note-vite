## 問題

```
bash: ping: command not found
```

![ping command not found](../../static/img/docker/docker_ping_question.png)

---

## 解法

**步驟一：更新 apt**

```bash
sudo apt update
```

![apt update](../../static/img/docker/docker_ping_aptupdate.png)

**步驟二：安裝 ping**

```bash
sudo apt install iputils-ping
```

![apt install ping](../../static/img/docker/docker_ping_install.png)

裝完即可正常使用 `ping`。

![ping command use](../../static/img/docker/docker_ping_finish.png)
