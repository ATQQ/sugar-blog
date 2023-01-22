---
tag:
 - 技术笔记
---
# nvm ls-remote 只有iojs列表

nvm 镜像地址的问题，修改对应环境变量`NVM_NODEJS_ORG_MIRROR`即可

可以使用 淘宝源(`https://npmmirror.com/mirrors/node/`)

查看当前设置的值
```sh
echo $NVM_NODEJS_ORG_MIRROR
```
## 运行时修改
```sh
NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node nvm ls-remote
```

## 临时修改环境变量
①
```sh
export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node
```
②
```sh
nvm ls-remote
```

## 长期修改环境变量
在 `~/.zshrc` 添加环境变量（使用 bash 可以，修改 .bashrc）

① 使用 vi 修改
```sh
vi ~/.zshrc
```

② 追加如下值
```sh
export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node
```

③ vi保存
```sh
ESC
:wq
```

④ 重启终端