import { defineConfig } from 'tsup'

export default defineConfig({
  target: 'es2015',
  entryPoints: ['src/index.ts']
})
