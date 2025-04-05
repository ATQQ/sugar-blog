#!/usr/bin/env zx

// user config
const originName = 'next'

// not care
const compressPkgName = `${originName}.tar.gz`
const user = 'root'
const origin = 'sugarat.top'
const fullOrigin = `${originName}.${origin}`
const baseServerDir = '/www/wwwroot'
const destDir = ''

await $`pnpm build`

await $`echo ==🔧 压缩dist ==`
await $`cd packages/blogpress/.vitepress && tar -zvcf ${compressPkgName} dist && rm -rf dist && mv ${compressPkgName} ./../../../`

await $`echo ==🚀 上传到服务器 ==`
await $`scp ${compressPkgName} ${user}@${fullOrigin}:./`
await $`scp ${compressPkgName} ${user}@ba.sugarat.top:./`
await $`rm -rf ${compressPkgName}`

await $`echo ==✅ 部署代码 ==`
await $`ssh -p22 ${user}@${fullOrigin} "tar -xf ${compressPkgName} -C ${baseServerDir}/${fullOrigin}/${destDir}"`
await $`ssh -p22 ${user}@ba.sugarat.top "tar -xf ${compressPkgName} -C ${baseServerDir}/sugarat.top/${destDir}"`
// await $`ssh -p22 ${user}@${origin} "tar -xf ${compressPkgName} -C ${baseServerDir}/blog.${origin}/${destDir}"`
