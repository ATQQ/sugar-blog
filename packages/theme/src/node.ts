import glob from 'fast-glob'
import matter from 'gray-matter'
import fs from 'fs'
import { execSync, spawn } from 'child_process'
import path from 'path'
import { formatDate } from './utils/index'
import type { Theme } from './composables/config/index'

export function getThemeConfig(
  articleDir: string,
  cfg?: Partial<Theme.BlogConfig>
) {
  const files = glob
    .sync('./**/*.md', { ignore: ['node_modules'] })
    .filter((v) => v.startsWith(articleDir))

  const data = files
    .map((v) => {
      const route = v
        // 处理文件后缀名
        .replace('.md', '')
        // 处理目录名
        .replace(new RegExp(`^${path.join(articleDir, '/')}`), '')

      const fileContent = fs.readFileSync(v, 'utf-8')

      // TODO: 支持JSON
      const meta: Partial<Theme.PageMeta> = {
        ...matter(fileContent).data
      }
      if (!meta.title) {
        meta.title = getDefaultTitle(fileContent)
      }
      if (!meta.date) {
        // getGitTimestamp(v).then((v) => {
        //   meta.date = formatDate(v)
        // })
        meta.date = getFileBirthTime(v)
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
        meta.cover ||
        fileContent.match(/[!]\[.+?\]\((https:\/\/.+)\)/)?.[1] ||
        ''
      return {
        route: `/${route}`,
        meta
      }
    })
    .filter((v) => v.meta.layout !== 'home')

  return {
    blog: {
      pagesData: data as Theme.PageData[],
      ...cfg
    },
    sidebar: [
      {
        text: '',
        items: []
      }
    ]
  }
}

export function getDefaultTitle(content: string) {
  let first___: unknown
  let second___: unknown

  const lines = content.split('\n').reduce<string[]>((pre, line) => {
    // 移除开头的空白行
    if (!line.trim() && pre.length === 0) {
      return pre
    }
    if (line.trim() === '---') {
      if (first___ === undefined) {
        first___ = pre.length
      } else if (second___ === undefined) {
        second___ = pre.length
      }
    }
    pre.push(line)
    return pre
  }, [])

  const title =
    lines
      // 剔除---之间的内容
      .slice((second___ as number) || 0)
      ?.find((str) => {
        return str.startsWith('# ')
      })
      ?.slice(2)
      .replace(/[\s]/g, '') || ''
  return title
}

export function getFileBirthTime(url: string) {
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

export function getGitTimestamp(file: string) {
  return new Promise((resolve, reject) => {
    const child = spawn('git', ['log', '-1', '--pretty="%ci"', file])
    let output = ''
    child.stdout.on('data', (d) => {
      output += String(d)
    })
    child.on('close', () => {
      resolve(+new Date(output))
    })
    child.on('error', reject)
  })
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
