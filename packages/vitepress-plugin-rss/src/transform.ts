import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import sharp from 'sharp'

export function removeZeroWidthSpace(html: string) {
  return html.replaceAll('&ZeroWidthSpace;', '')
}

export function svgToBase64(html: string) {
  return html.replaceAll(/<svg.*?<\/svg>/g, (svg) => {
    const base64 = Buffer.from(svg).toString('base64')
    return `<img src="data:image/svg+xml;base64,${base64}" alt="svg image" />`
  })
}

export async function svgToUrl(html: string, outputDir: string, assetsBasePath: string) {
  const regex = /<svg[\s\S]*?<\/svg>/g
  const matches = Array.from(html.matchAll(regex))

  if (matches.length === 0) {
    return html
  }

  const results = await Promise.all(matches.map(async (match) => {
    const svg = match[0]
    const fileName = await svg2png(svg, outputDir)
    return {
      match,
      fileName
    }
  }))

  let lastIndex = 0
  let resultHtml = ''

  for (const { match, fileName } of results) {
    const start = match.index!
    const end = start + match[0].length

    // Append text before this match
    resultHtml += html.slice(lastIndex, start)

    if (fileName) {
      const url = `${assetsBasePath}/${path.basename(outputDir)}/${fileName}`
      resultHtml += `<img src="${url}" alt="svg image" />`
    }
    else {
      resultHtml += match[0]
    }

    lastIndex = end
  }

  resultHtml += html.slice(lastIndex)

  return resultHtml
}

export async function svg2png(svg: string, outDir: string) {
  // 确保输出目录存在
  if (!fs.existsSync(outDir)) {
    await fs.promises.mkdir(outDir, { recursive: true })
  }

  // 生成唯一文件名
  const hash = crypto.createHash('md5').update(svg).digest('hex')
  const fileName = `${hash}.png`
  const filePath = path.join(outDir, fileName)

  // 如果文件已存在，直接返回文件名
  if (fs.existsSync(filePath)) {
    return fileName
  }

  try {
    await sharp(Buffer.from(svg))
      .png()
      .toFile(filePath)
    return fileName
  }
  catch (error) {
    console.error('Failed to convert SVG to PNG:', error)
    return null
  }
}

export function injectStyle(html: string, style: string) {
  return `<style>${style}</style>${html}`
}
