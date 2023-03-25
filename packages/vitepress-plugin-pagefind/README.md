# vitepress-plugin-pagefind

Offline full-text search based on [pagefind](https://github.com/cloudcannon/pagefind) implementation.

## Usage

step1: install plugin
```sh
npm i vitepress-plugin-pagefind
# or
yarn add vitepress-plugin-pagefind
# or
pnpm add vitepress-plugin-pagefind
```

step2: import plugin

in `.vitepress/config.ts`
```ts
import { defineConfig } from 'vitepress'
import { pagefindPlugin } from 'vitepress-plugin-pagefind'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite:{
    plugins:[pagefindPlugin()],
  }
})

```

or in `vite.config.ts`
```ts
//vite.config.ts
import { pagefindPlugin } from "vitepress-plugin-pagefind";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [pagefindPlugin()],
});
```

## Options
TODO: Accept Pagefind Index Options

Wait a moment
## Multi language support
Provided by [Pagefind](https://pagefind.app/docs/multilingual/#language-support)