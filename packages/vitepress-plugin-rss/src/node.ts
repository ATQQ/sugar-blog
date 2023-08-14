import glob from 'fast-glob'
import matter from 'gray-matter'
import fs, { writeFileSync } from 'fs'
import { spawn, spawnSync } from 'child_process'
import path from 'path'
import { Feed } from 'feed'
import { SiteConfig } from 'vitepress'
import { formatDate } from './utils'
import { RSSOptions } from './type'

export function getPagesData(_srcDir?: string, pluginSiteConfig?: any) {
  const srcDir = _srcDir || process.argv.slice(2)?.[1] || '.'
  const files = glob.sync(`${srcDir}/**/*.md`, { ignore: ['node_modules'] })

  const data = files
    .map((v) => {
      let route = v
        // 处理文件后缀名
        .replace('.md', '')

      // 去除 srcDir 处理目录名
      if (route.startsWith('./')) {
        route = route.replace(
          new RegExp(
            `^\\.\\/${path
              .join(srcDir, '/')
              .replace(new RegExp(`\\${path.sep}`, 'g'), '/')}`
          ),
          ''
        )
      } else {
        route = route.replace(
          new RegExp(
            `^${path
              .join(srcDir, '/')
              .replace(new RegExp(`\\${path.sep}`, 'g'), '/')}`
          ),
          ''
        )
      }

      const fileContent = fs.readFileSync(v, 'utf-8')

      const meta = {
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
      } else {
        const timeZone = pluginSiteConfig?.timeZone ?? 8
        meta.date = formatDate(
          new Date(`${new Date(meta.date).toUTCString()}+${timeZone}`)
        )
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
        fileContent.match(/[!]\[.*?\]\((https:\/\/.+)\)/)?.[1] ||
        ''
      return {
        route: `/${route}`,
        meta
      }
    })
    .filter((v) => v.meta.layout !== 'home')

  return data
}

export function getDefaultTitle(content: string) {
  const title =
    clearMatterContent(content)
      .split('\n')
      ?.find((str) => {
        return str.startsWith('# ')
      })
      ?.slice(2)
      .replace(/[\s]/g, '') || ''
  return title
}

export function clearMatterContent(content: string) {
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
  return (
    lines
      // 剔除---之间的内容
      .slice((second___ as number) || 0)
      .join('\n')
  )
}

export function getFileBirthTime(url: string) {
  let date = new Date()

  try {
    // 参考 vitepress 中的 getGitTimestamp 实现
    // const infoStr = execSync(`git log -1 --pretty="%ci" ${url}`)
    //   .toString('utf-8')
    //   .trim()

    const infoStr = spawnSync('git', ['log', '-1', '--pretty="%ci"', url])
      .stdout?.toString()
      .replace(/["']/g, '')
      .trim()
    if (infoStr) {
      date = new Date(infoStr)
    }
  } catch (error) {
    return formatDate(date)
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
    clearMatterContent(text)
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

export const EXTERNAL_URL_RE = /^[a-z]+:/i

/**
 * Join two paths by resolving the slash collision.
 */
export function joinPath(base: string, path: string): string {
  return `${base}${path}`.replace(/\/+/g, '/')
}

export function withBase(base: string, path: string) {
  return EXTERNAL_URL_RE.test(path) || path.startsWith('.')
    ? path
    : joinPath(base, path)
}

export async function genFeed(config: SiteConfig, rssOptions: RSSOptions) {
  if (!rssOptions) return

  const { createContentLoader } = await import('vitepress')
  const srcDir =
    config.srcDir.replace(config.root, '').replace(/^\//, '') ||
    process.argv.slice(2)?.[1] ||
    '.'

  // const posts = await createContentLoader(`${srcDir}/**/*.md`, {
  //   excerpt: true,
  //   render: true
  // }).load()
  // console.log(posts.length)

  // const mdRender = await createMarkdownRenderer(
  //   config.srcDir,
  //   config.markdown,
  //   config.site.base,
  //   config.logger
  // )
  // console.log()
  // console.log('=== feed: https://github.com/jpmonette/feed ===')
  // const { base } = config.userConfig

  // const { baseUrl, filename } = rssdOptions
  // const feed = new Feed(rssdOptions)

  // posts.sort(
  //   (a, b) =>
  //     +new Date(b.meta.date as string) - +new Date(a.meta.date as string)
  // )

  // for (const { route, meta } of posts) {
  //   const { title, description, date, hidden } = meta
  //   if (hidden) continue
  //   const author = meta.author ?? blogCfg.author
  //   let link = `${baseUrl}${withBase(
  //     base || '',
  //     // 移除末尾的index
  //     route.replace(/(^|\/)index$/, '$1')
  //   )}`
  //   // 补全后缀
  //   link = link.endsWith('/')
  //     ? link
  //     : `${link}${config?.cleanUrls ? '' : '.html'}`
  //   const authorLink = authorList.find((v) => v.nickname === author)?.url
  //   let html
  //   const filepath = pageMap.get(route)
  //   if (filepath) {
  //     const fileContent = fs.readFileSync(filepath, 'utf-8')
  //     html = mdRender.render(fileContent)
  //   }

  //   feed.addItem({
  //     title,
  //     id: link,
  //     link,
  //     description,
  //     content: html,
  //     author: [
  //       {
  //         name: author,
  //         link: authorLink
  //       }
  //     ],
  //     date: new Date(date)
  //   })
  // }
  // const RSSFile = path.join(config.outDir, filename || 'feed.rss')
  // writeFileSync(RSSFile, feed.rss2())
  // console.log('🎉 RSS generated', filename || 'feed.rss')
  // console.log()
}
