#!/usr/bin/env zx
await $`rm -rf docs/.vuepress/dist`
await $`node ./scripts/beforeBuild/addCatalog.js`
await $`node ./scripts/beforeBuild/addTJ.js`
await $`node ./scripts/beforeBuild/addConfig.js`
