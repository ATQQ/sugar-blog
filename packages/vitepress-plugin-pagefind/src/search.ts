interface PagefindResult {
  url: string
  content: string
  word_count: number
  filters: Filters
  meta: Meta
  anchors: Anchor[]
  weighted_locations: WeightedLocation[]
  locations: number[]
  raw_content: string
  raw_url: string
  excerpt: string
  sub_results: SubResult[]
}

interface SubResult {
  title: string
  url: string
  anchor: Anchor
  weighted_locations: WeightedLocation[]
  locations: number[]
  excerpt: string
}

interface WeightedLocation {
  weight: number
  balanced_score: number
  location: number
}

interface Anchor {
  element: string
  id: string
  text: string
  location: number
}

interface Meta {
  image_alt: string
  title: string
  image: string
  base64: string
}

interface Filters {
}

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

export function formatPagefindResult(result: PagefindResult, count = 1) {
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
      if (!min) {
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

  const filterMap = new Map<string, any>()
  return subs.map(sub => parseSubResult(sub, anchors, result))
    .filter((v) => {
      if (filterMap.has(v.meta.title)) {
        return false
      }
      filterMap.set(v.meta.title, v)
      return true
    })
}

function parseSubResult(sub: SubResult, anchors: Anchor[], result: PagefindResult) {
  const route = sub?.url || result?.url
  const description = sub?.excerpt || result?.excerpt

  // 构造标题
  // 过滤出合适的标题列表
  const locationsAnchors = anchors?.filter((a) => {
    if (!sub)
      return false
    // 直接比较
    return a.location <= sub.anchor.location && a.element <= sub.anchor.element
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
  const title = filteredAnchors.length ? filteredAnchors.map(t => t.text.trim()).filter(v => !!v).join(' > ') : result.meta.title

  const { base64, ...otherMeta } = result.meta
  return {
    route,
    meta: {
      ...decodeBase64AndDeserialize(base64),
      ...otherMeta,
      title,
      description,
    },
    result
  }
}
