import { defineConfig } from 'tsup'

export default defineConfig({
  splitting: false,
  target: 'es2015',
  sourcemap: true,
  clean: true,
  entryPoints: ['src/index.ts']
})
