import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/client.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: false,
  silent: true,
  external: ['vitepress', 'vue', 'markdown-it', /\.vue$/]
})
