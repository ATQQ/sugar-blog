import type { Anchor, PagefindResult, SearchItem, SubResult } from './type'

function decodeBase64AndDeserialize(base64String: string) {
  if (!base64String) {
    return {}
  }
  try {
    const serialized = decodeURIComponent(atob(base64String))
    const obj = JSON.parse(serialized)
    return obj
  }
  catch {
    return {}
  }
}

export function formatPagefindResult(result: PagefindResult, count = 1, fuzzyKeywords: FuzzyKeywords) {
  const { sub_results: subResults, anchors, weighted_locations: weightedLocations } = result
  // TODO：pick策略优化
  // 按照权重排序，从大到小
  weightedLocations.sort((a, b) => {
    // 权重相等按照 location 顺序排序
    if (b.weight === a.weight) {
      return a.location - b.location
    }
    return b.weight - a.weight
  })

  // pick 集合中权重最大的结果
  const subs: SubResult[] = []
  for (const { location } of weightedLocations) {
    // 从结果集合中过滤出符合权重的结果
    const filterData = subResults.filter((sub) => {
      const { locations } = sub
      const [min] = locations || []
      if (typeof min !== 'number') {
        return false
      }
      const max = locations.length === 1 ? Number.POSITIVE_INFINITY : locations[locations.length - 1]
      return min <= location && location <= max
    })

    // 保留 locations 数量最多的
    const sub = filterData.reduce((prev, curr) => {
      if (!prev) {
        return curr
      }
      return prev.locations.length > curr.locations.length ? prev : curr
    }, null as SubResult | null)

    if (!sub) {
      continue
    }

    subs.push(sub)

    if (subs.length >= count) {
      break
    }
  }

  // 按文章中顺序，排序
  subs.sort((a, b) => {
    const [minA] = a.locations || []
    const [minB] = b.locations || []
    if (!minA || !minB) {
      return 0
    }
    return minA - minB
  })

  const filterSet = new Set<string>()
  return subs.map(sub => parseSubResult(sub, anchors, result, fuzzyKeywords))
    .filter((v) => {
      const title = v.meta.title.join(' > ')
      if (filterSet.has(title))
        return false
      filterSet.add(title)
      return true
    })
}

function parseSubResult(sub: SubResult, anchors: Anchor[], result: PagefindResult, fuzzyKeywords: FuzzyKeywords): SearchItem {
  const route = sub?.url || result?.url
  const description = sub?.excerpt || result?.excerpt

  // 构造标题
  // 过滤出合适的标题列表
  const locationsAnchors = anchors?.filter((a) => {
    if (!sub)
      return false
    try {
      // 直接比较
      return a.location <= sub.anchor.location && a.element <= sub.anchor.element
    }
    catch {
      return false
    }
  }) || []
  locationsAnchors.reverse()

  const filteredAnchors = locationsAnchors.reduce((prev, curr) => {
    const isHave = prev.some(p => p.element === curr.element)
    if (isHave) {
      return prev
    }
    prev.unshift(curr)
    return prev
  }, [] as Anchor[])
  // 构造完整的 title 层级 信息
  const title = filteredAnchors.length
    ? filteredAnchors.map(t => markTextWithKeywords(t.text.trim(), fuzzyKeywords)).filter(Boolean)
    : [markTextWithKeywords(result.meta.title, fuzzyKeywords)]

  const { base64, date, ...otherMeta } = result.meta
  return {
    route,
    meta: {
      date: date ? +date : undefined,
      ...decodeBase64AndDeserialize(base64) as object,
      ...otherMeta,
      title,
      description,
    },
    result
  }
}

const deduplicateCaseInsensitive = (arr: string[]) => [...new Map(arr.map(s => [s.toLowerCase(), s])).values()]
type FuzzyKeywords = ReturnType<typeof extractFuzzyKeywordsFromExcerpts>
export function extractFuzzyKeywordsFromExcerpts(results: PagefindResult[], input: string) {
  // Pagefind 默认标记的关键词会把附近的标点符号也匹配上，需移除
  const leadingAndTrailingPunctuationsRegexp = /^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu
  const extract = (tokens: string[]) => deduplicateCaseInsensitive(tokens.map(word =>
    word.replace(leadingAndTrailingPunctuationsRegexp, '').trim()
  ))
  return {
    excerptWords: extract(results.flatMap(result => [...result.excerpt.matchAll(/<mark>(.+?)<\/mark>/g).map(matched => matched[1])])),
    inputTokens: extract(input.trim().split(/\s/)),
  }
}

function markTextWithKeywords(text: string, fuzzyKeywords: FuzzyKeywords) {
  if (!text)
    return text
  text = text.replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  const segments: (string | { mark: string })[] = [text]
  const keywords = Object.entries(fuzzyKeywords).flatMap(([from, keywords]) => keywords.map(keyword => ({ keyword, from })))
  for (const { keyword, from } of keywords) {
    const escapedKeyword = 'escape' in RegExp ? RegExp.escape(keyword) : keyword
    const regexp = new RegExp(from === 'excerptWords' ? `\\b${escapedKeyword}\\b` : escapedKeyword, 'gi')
    for (let i = segments.length - 1; i >= 0; i--) {
      const segment = segments[i]
      if (typeof segment !== 'string' || segment === '') // 如果 keywords 中包含空字符串（''），正则 gi 会导致死循环（无限匹配）
        continue
      if (regexp.test(segment)) {
        const splitted = segment.split(regexp).flatMap((seg, i) => i ? [{ mark: segment.match(regexp)![i - 1] }, seg] : [seg])
        segments.splice(i, 1, ...splitted)
      }
    }
  }
  return segments.map(segment => typeof segment === 'string' ? segment : `<mark>${segment.mark}</mark>`).join('')
}
