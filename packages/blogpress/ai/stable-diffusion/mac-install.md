---
outline: [2,3]
description: Mac 实操安装 stable-diffusion，包含环境配置，sd插件安装，模型安装等内容
cover: https://img.cdn.sugarat.top/mdImg/MTY4ODMwOTEzMzUzNA==688309133534
---
# Mac 安装 stable-diffusion

笔者所使用设备 Mac mini（macOS Ventura），如读者你是 window 请自行谷歌 window 安装 stable-diffusion 教程。

笔者不会python，也不会机器学习，安装过程可能不是最佳的方式，但是能跑起来（hh）。

>[[toc]]

## 环境准备
* 科学上网工具：确保安装过程网络通畅
* [python 3.16.0](https://www.python.org/downloads/release/python-3106/) ：确保大部分依赖库能顺利运行
* [stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui)：sd 网页应用


### 安装python
>笔者的操作不一定是最佳实践

我这里使用安装包傻瓜式的一键安装，从官网下载 [python 3.16.0](https://www.python.org/downloads/release/python-3106/) 安装包

![](https://img.cdn.sugarat.top/mdImg/MTY4ODMwMDc3OTM2Mg==688300779362)

打开下载好的安装包，无脑选择下一步即可

![](https://img.cdn.sugarat.top/mdImg/MTY4ODMwMDgyMDQyMw==688300820423)

安装完后打开终端输入，[查看 python 版本](https://app.warp.dev/block/s9LVoqUBc12tgLXmwl1sQO)
```sh
python3 --version
```

![](https://img.cdn.sugarat.top/mdImg/MTY4ODMwMTAyODI2Nw==688301028267)

这里可以在`~/.zshrc`中设置一个别名`python`，方便后续使用
```sh
alias python=python3
```

![](https://img.cdn.sugarat.top/mdImg/MTY4ODMwMTEwMTgzNw==688301101837)

![](https://img.cdn.sugarat.top/mdImg/MTY4ODMwMTEzMjgzNQ==688301132835)

### 安装 stable-diffusion-webui

clone 项目到本地
```sh
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
```
克隆完成后进入项目目录
```sh
cd stable-diffusion-webui
```

安装项目依赖(此过程会持续一段时间)
```sh
pip install -r requirements.txt
```

启动项目
```sh
./webui.sh
```

![](https://img.cdn.sugarat.top/mdImg/MTY4ODMwMTU4NTA0Mw==688301585043)

访问 `http://127.0.0.1:7860/` 即可应用的内容

![](https://img.cdn.sugarat.top/mdImg/MTY4ODMwMTY2MTk5MA==688301661990)


## 配置 stable-diffusion-webui
### 汉化
为了方便后续的使用我们可以将 stable-diffusion-webui 汉化一下

使用插件[stable-diffusion-webui-chinese](https://github.com/VinsonLaro/stable-diffusion-webui-chinese)

安装操作路径: `Extensions` => `URL for extension's git repository` => `Install`

![](https://img.cdn.sugarat.top/mdImg/MTY4ODMwMTc1ODg0MQ==688301758841)

输入插件地址：`https://github.com/VinsonLaro/stable-diffusion-webui-chinese`,点击`Install`即可

紧接着应用插件：`Installed` => `Apply and restart UI`

![](https://img.cdn.sugarat.top/mdImg/MTY4ODMwMTk0NTg4Nw==688301945887)

设置汉化：`Settings` => `User Interface` => `Localization` => `Apply Settings` => `Reload UI`

![](https://img.cdn.sugarat.top/mdImg/MTY4ODMwMjA5NjAwMQ==688302096001)

推荐使用中英对照，方便观看部分英文教程

![](https://img.cdn.sugarat.top/mdImg/MTY4ODMwMjM3MTAwNw==688302371007)

再次访问即可看到英文汉化的内容

### 安装插件


由于网络问题可能会出现访问失败的情况，如下图所示

![](https://img.cdn.sugarat.top/mdImg/MTY4ODMwMjQ0NDUwNg==688302444506)

这里可以使用笔者的CV下来的配置`https://script.sugarat.top/json/sd.json`

或者浏览器访问[链接资源](https://raw.githubusercontent.com/AUTOMATIC1111/stable-diffusion-webui-extensions/master/index.json)，将其下载到本地，本地启动一个服务（比如使用[http-server](https://www.npmjs.com/package/http-server)）

```sh
npx http-server
```

![](https://img.cdn.sugarat.top/mdImg/MTY4ODMwMjc3ODEzNg==688302778136)

url设置为`http://127.0.0.1:8080/sd.json`即可，点击 加载 即可看到插件列表

![](https://img.cdn.sugarat.top/mdImg/MTY4ODMwMzI4NTY5Mg==688303285692)

例如 安装 `sd-webui-controlnet` 和 `3D Openpose Editor`

搜索`controlnet`，找到相应的插件，点击 `Installed` 即可

![](https://img.cdn.sugarat.top/mdImg/MTY4ODMwNTU2NjA0Mw==688305566043)

在已安装列表即可看到安装的插件

![](https://img.cdn.sugarat.top/mdImg/MTY4ODMwNjIyOTMxNg==688306229316)

重启后即可看到刚安装的插件生效了

![](https://img.cdn.sugarat.top/mdImg/MTY4ODMwNjc4MzcxMg==688306783712)

## 安装模型
> 从 [C 站](https://civitai.com/)：https://civitai.com/ 下载（需要科学上网工具才能访问）

![](https://img.cdn.sugarat.top/mdImg/MTY4ODMwOTEzMzUzNA==688309133534)

比如 [ChilloutMix](https://civitai.com/models/6424?modelVersionId=11745) 模型

点击下载

![](https://img.cdn.sugarat.top/mdImg/MTY4ODMwOTI2NTU3Mg==688309265572)

导入下载的模型到目录 `models/Stable-diffusion`

![](https://img.cdn.sugarat.top/mdImg/MTY4ODMwOTUyMDk4MA==688309520980)

然后重启服务或者点击刷新

![](https://img.cdn.sugarat.top/mdImg/MTY4ODU3MDA2NDczNA==688570064734)

![](https://img.cdn.sugarat.top/mdImg/MTY4ODMwOTYxMDkyOA==688309610928)

## 简单使用

可以直接 Copy 其它用户分享到C站上的提示词

比如下面[这个例子](https://civitai.com/images/312507?period=AllTime&periodMode=published&sort=Newest&view=categories&modelVersionId=27828&modelId=23302&postId=79817)

查看大图时滑到右下角

![](https://img.cdn.sugarat.top/mdImg/MTY4ODMwOTg3ODUxOA==688309878518)

或者缩略图右下角的 “i”

![](https://img.cdn.sugarat.top/mdImg/MTY4ODMwOTkwMzgwOA==688309903808)

下面实操使用一下上面的提示词

我这里把步数调成了30

::: code-group
```txt [① 提示词]
extremely detailed CG uniform 8k illustrations, high color substitution, sketches graffiti art, illustrations photo, masterpiece, hyper detailed, best quality, ultra high res, high resolution, (intricate details), perfect lighting, best shadow, (graffiti wall:1.4), 1 girl, (extremely detailed face and eyes), (shiny big eyes), (shiny graffiti long hair:1.2), ((colorful)), ((colorful illustrations)), face focus, lip gloss, random eyes color,
```

```txt [② 反向提示词]
by bad-picture-chill-75v, nude, porn, nipples, pussy, pornography, canvas frame, cartoon, 3d, ((disfigured)), ((bad art)), ((deformed)),((extra limbs)),((close up)),((b&w)), wierd colors, blurry, (((duplicate))), ((morbid)), ((mutilated)), [out of frame], extra fingers, mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), ((ugly)), blurry, ((bad anatomy)), (((bad proportions))), ((extra limbs)), cloned face, (((disfigured))), out of frame, ugly, extra limbs, (bad anatomy), gross proportions, (malformed limbs), ((missing arms)), ((missing legs)), (((extra arms))), (((extra legs))), mutated hands, (fused fingers), (too many fingers), (((long neck))), Photoshop, video game, ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, mutation, mutated, extra limbs, extra legs, extra arms, disfigured, deformed, cross-eye, body out of frame, blurry, bad art, bad anatomy, 3d render, background blur, (blurred background),  (briefs), (triangle pants), watermark, astigmatism, scattered light, lens astigmatism, chest light, shiny boobs, glowing boobs, halo, fog, hazy,
```

```txt [③ 采样器]
DPM++ SDE Karras
```

```txt [④ 步数]
30
```

```txt [⑤ 引导系数]
9
```
:::

最后效果如下

![](https://img.cdn.sugarat.top/mdImg/MTY4ODMxMTAyMTY2Ng==688311021666)

![](https://img.cdn.sugarat.top/mdImg/MTY4ODMxMTI1MTEzNw==688311251137)