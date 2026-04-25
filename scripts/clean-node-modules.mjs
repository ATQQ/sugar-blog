import fs from 'node:fs/promises'
import path from 'node:path'

async function clean() {
  const dirs = ['node_modules']

  try {
    const pkgs = await fs.readdir('packages')
    for (const pkg of pkgs) {
      dirs.push(path.join('packages', pkg, 'node_modules'))
    }
  }
  catch (e) {
    // Ignore if packages directory doesn't exist
  }

  for (const dir of dirs) {
    await fs.rm(dir, { recursive: true, force: true })
    console.log(`已清理: ${dir}`)
  }
}

clean()
