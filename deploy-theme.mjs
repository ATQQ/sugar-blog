#!/usr/bin/env zx

await $`pnpm buildTheme`

await $`cd packages/theme && kite push`

// user config
// const originName = 'theme'

// // not care
// const compressPkgName = `${originName}.tar.gz`
// const user = 'root'
// const origin = 'sugarat.top'
// const fullOrigin = `${originName}.${origin}`
// const baseServerDir = '/www/wwwroot'
// const destDir = ''

// await $`pnpm buildTheme`

// await $`echo ==🔧 压缩dist ==`
// await $`cd packages/theme/docs/.vitepress && tar -zvcf ${compressPkgName} dist && rm -rf dist && mv ${compressPkgName} ./../../../../`

// await $`echo ==🚀 上传到服务器 ==`
// await $`scp ${compressPkgName} ${user}@${fullOrigin}:./`
// await $`rm -rf ${compressPkgName}`

// await $`echo ==✅ 部署代码 ==`
// await $`ssh -p22 ${user}@${fullOrigin} "tar -xf ${compressPkgName} -C ${baseServerDir}/${fullOrigin}/${destDir}"`
