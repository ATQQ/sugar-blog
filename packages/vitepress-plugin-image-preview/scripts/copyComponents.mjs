import { copy } from 'fs-extra'
import { globSync } from 'tinyglobby'

function toDest(file) {
  return file.replace(/^src\//, 'dist/')
}

globSync(['src/components/**', 'src/icons/**']).forEach((file) => {
  if (/(\.ts|tsconfig\.json)$/.test(file)) {
    return
  }
  copy(file, toDest(file))
})
