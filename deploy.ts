import { $ } from 'bun'

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
