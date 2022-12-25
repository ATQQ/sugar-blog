---
title: 配置SSH免密登录服务器
date: 2022-02-12
tags:
 - 技术笔记
 - 技术教程
categories:
 - 技术笔记
---
# 本地配置SSH免密远程登录服务器
最近服务器从阿里云换到了腾讯云，需要把服务进行一次整体的迁移

为了方便资源的部署，需要配置一下SSH的免密登录，避免频繁的输入密码

## 取得本地公钥
先查看本地是否存在`id_rsa.pub`文件
```sh
ls ~/.ssh
```

不存在可以通过如下指令创建（一路回车即可）
```sh
ssh-keygen -t rsa
```

## 服务器添加信任
### 上传公钥
将本地公钥上传到远程服务器
* 其中 `$host`换成目标服务器绑定的 **域名** 或 **IP** 即可
```sh
scp ~/.ssh/id_rsa.pub root@$host:~/

# 如
scp ~/.ssh/id_rsa.pub root@baidu.com:~/
scp ~/.ssh/id_rsa.pub root@39.156.66.18:~/
```

### 添加信任
先检查服务器上是`root`用户是否存在`.ssh`目录
```sh
ssh -p22 root@$host "ls -al"
```

不存在则运行上述一样的方式进行创建
```sh
ssh -p22 root@$host "ssh-keygen -t rsa"
```

添加信任
```sh
ssh -p22 root@$host "cat ~/id_rsa.pub >> ~/.ssh/authorized_keys"
```

## 重启ssh
```sh
ssh -p22 root@$host "service sshd restart"
```

## 免密登录root
配置完成后即可进行免密登录
```sh
ssh root@$host
```

