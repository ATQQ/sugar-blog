import glob from 'fast-glob'
import matter from 'gray-matter'
import fs from 'fs'
import { execSync } from 'child_process'
import path from 'path'
import { formatDate } from './utils/index'
import type { Theme } from './composables/config/index'

export function getThemeConfig(dir: string) {
  const files = glob
    .sync('./**/*.md', { ignore: ['node_modules'] })
    .filter((v) => v.startsWith(dir))
  // readme.md => index.md
  // for (const file of files) {
  //   if (file.endsWith('README.md')) {
  //     fs.promises.rename(file, file.replace('README.md', 'index.md'))
  //   }
  // }
  const data = files.map((v) => {
    const route = v
      // 处理文件后缀名
      .replace('.md', '')
      // 处理目录名
      .replace(new RegExp(`^${path.join(dir, '/')}`), '')

    const fileContent = fs.readFileSync(v, 'utf-8')
    const meta: Partial<Theme.PageMeta> = {
      ...getDefaultMeta(v, fileContent),
      // TODO: 支持JSON
      ...matter(fileContent).data
    }

    // 处理tags和categories,兼容历史文章
    meta.tag = (meta.tag || []).concat([
      ...new Set([...(meta.categories || []), ...(meta.tags || [])])
    ])

    // 获取摘要信息
    const wordCount = 100
    meta.description =
      meta.description || getTextSummary(fileContent, wordCount)

    // 获取封面图
    meta.cover =
      meta.cover || fileContent.match(/[!]\[.+?\]\((https:\/\/.+)\)/)?.[1] || ''
    return {
      route,
      meta
    }
  })

  return {
    pagesData: data as Theme.PageData[],
    sidebar: [
      {
        text: '',
        items: []
      }
    ]
  }
}

function getDefaultMeta(file: string, content: string) {
  const title =
    content
      // 剔除---之间的内容
      .replace(/---([\S\s]+)---/, '')
      ?.split('\n')
      ?.find((str) => {
        return str.startsWith('# ')
      })
      ?.slice(2)
      .replace(/[\s]/g, '') || ''
  const date = getFileBirthTime(file)
  const meta = {
    title,
    date
  }
  return meta
}

function getFileBirthTime(url: string) {
  // 参考 vitepress 中的 getGitTimestamp 实现
  const infoStr = execSync(`git log -1 --pretty="%ci" ${url}`)
    .toString('utf-8')
    .trim()
  let date = new Date()
  if (infoStr) {
    date = new Date(infoStr)
  }
  return formatDate(date)
}

function getTextSummary(text: string, count = 100) {
  return (
    text
      .match(/^# ([\s\S]+)/m)?.[1]
      // 除去标题
      ?.replace(/#/g, '')
      // 除去图片
      ?.replace(/!\[.*?\]\(.*?\)/g, '')
      // 除去链接
      ?.replace(/\[(.*?)\]\(.*?\)/g, '$1')
      // 除去加粗
      ?.replace(/\*\*(.*?)\*\*/g, '$1')
      ?.split('\n')
      ?.filter((v) => !!v)
      ?.slice(1)
      ?.join('\n')
      ?.replace(/>(.*)/, '')
      ?.slice(0, count)
  )
}
