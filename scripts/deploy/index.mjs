#!/usr/bin/env zx

// user config
const originName = "blog"

// not care
const compressPkgName = `${originName}.tar.gz`
const user = 'root'
const origin = 'sugarat.top'
const fullOrigin = `${originName}.${origin}`
const baseServerDir = `/www/wwwroot`
const destDir = ''

await $`echo ==🔧 压缩dist ==`
await $`cd docs/.vuepress && tar -zvcf ${compressPkgName} dist && rm -rf dist && mv ${compressPkgName} ./../../`

await $`echo ==🚀 上传到服务器 ==`
await $`scp ${compressPkgName} ${user}@${origin}:./`
await $`rm -rf ${compressPkgName}`

await $`echo ==✅ 部署代码 ==`
await $`ssh -p22 ${user}@${origin} "tar -xf ${compressPkgName} -C ${baseServerDir}/${fullOrigin}/${destDir}"`
// 旧的buckup也先部署一份
await $`ssh -p22 ${user}@${origin} "tar -xf ${compressPkgName} -C ${baseServerDir}/old.${origin}/${destDir}"`
