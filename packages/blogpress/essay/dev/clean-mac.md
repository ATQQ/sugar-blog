---
description: 拿 Codex 协助清理磁盘，空间+120G
tag: [codex, mac]
---
# 拿 Codex 协助清理磁盘，挺 Nice

几天不主动清理就会收到满磁盘的警告。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/2e2b0412f6a5313dde8dc25df586d722)

前几次是用 [Mole](https://github.com/tw93/mole) 清理的，第一次效果非常显著。

后面用了几次感觉效果就不行了，第二天再检查磁盘又占用回去了。

![](https://cdn.upyun.sugarat.top/mdImg/sugar/2b9e5ce327576525176cd0aaa5a13c34)

之前听说让 Agent 来分析操刀删效果不错，今儿就让 Codex 来试试。

手里还有一个吃灰的 500G 移动硬盘，顺便看看能不能排上用场。

## 实操

先来分析一波

![](https://cdn.upyun.sugarat.top/mdImg/sugar/6629479cc9ebb8bddc8d6a278d86bab0)

先把 old_homebrew 搞了，再把一些很久远的文档视频图片这些搬到硬盘里。`+20G`

![](https://cdn.upyun.sugarat.top/mdImg/sugar/192b01fc06845913ee47cada01136479)

紧接着是把安卓模拟器干掉，我都是真机测的开发，可以删。`+30G`

![](https://cdn.upyun.sugarat.top/mdImg/sugar/ada139c4927da9c437939b60d47bb4e4)


接着处理 pnpm 缓存。`+8G`

![](https://cdn.upyun.sugarat.top/mdImg/sugar/6a8eac69fe1e8180c3ba11af5039ac12)


清 Docker 缓存。`+12G`

![](https://cdn.upyun.sugarat.top/mdImg/sugar/2ad6bb6700f265abee717e020bdf9c47)

最后之前的微信备份，备份到移动硬盘里去。`+30G`

![](https://cdn.upyun.sugarat.top/mdImg/sugar/bef9e41745fa19b2071f0b8849e551ae)

## 成果

`+120G!`

![](https://cdn.upyun.sugarat.top/mdImg/sugar/d54e5c95f5774789d060b12b13c896d0)
