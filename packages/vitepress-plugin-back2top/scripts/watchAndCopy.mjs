import { copy, remove } from 'fs-extra'
import { watch } from 'chokidar'
import { normalizePath } from 'vite'

function toDist(file) {
  return normalizePath(file).replace(/^src\//, 'dist/')
}

// copy non ts files, such as an html or css, to the dist directory whenever
// they change.
watch('src/components/**/!(*.ts|tsconfig.json)')
  .on('change', file => copy(file, toDist(file)))
  .on('add', file => copy(file, toDist(file)))
  .on('unlink', file => remove(toDist(file)))
