<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

// @ts-expect-error
import { searchConfig } from 'virtual:pagefind'

const { site, lang, localeIndex } = useData()
const finalSearchConfig = computed(() => {
  return {
    ...searchConfig,
    ...(searchConfig?.locales?.[localeIndex.value] || {})
  }
})

const stringifySearchConfig = computed(() => {
  return encodeURIComponent(JSON.stringify(searchConfig))
})
</script>

<script client>
const dataEl = document.getElementById('search-data')
const currentLang = dataEl?.dataset.lang || 'en-us'
const base = dataEl?.dataset.base || '/'
const currentLocaleIndex = dataEl?.dataset.locale || 'root'

const searchConfig = JSON.parse(decodeURIComponent(dataEl?.dataset.searchConfig || '{}'))
const currentSearchConfig = {
  ...searchConfig,
  ...(searchConfig?.locales?.[currentLocaleIndex] || {})
}

// Helper functions
function decodeBase64AndDeserialize(base64String) {
  if (!base64String)
    return {}
  try {
    return JSON.parse(decodeURIComponent(atob(base64String)))
  }
  catch {
    return {}
  }
}

function formatDate(d, fmt = 'yyyy-MM-dd hh:mm:ss') {
  if (!(d instanceof Date))
    d = new Date(d)
  const o = {
    'M+': d.getMonth() + 1,
    'd+': d.getDate(),
    'h+': d.getHours(),
    'm+': d.getMinutes(),
    's+': d.getSeconds(),
    'q+': Math.floor((d.getMonth() + 3) / 3),
    'S': d.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, `${d.getFullYear()}`.substr(4 - RegExp.$1.length))
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length))
    }
  }
  return fmt
}

function formatShowDate(date, lang) {
  if (typeof currentSearchConfig.showDate === 'function') {
    return currentSearchConfig.showDate(date, lang)
  }
  const source = +new Date(date)
  const now = +new Date()
  const diff = now - source
  const oneSeconds = 1000
  const oneMinute = oneSeconds * 60
  const oneHour = oneMinute * 60
  const oneDay = oneHour * 24
  const oneWeek = oneDay * 7
  const langMap = {
    'zh-cn': { justNow: '刚刚', secondsAgo: '秒前', minutesAgo: '分钟前', hoursAgo: '小时前', daysAgo: '天前', weeksAgo: '周前' },
    'en-us': { justNow: ' just now', secondsAgo: ' seconds ago', minutesAgo: ' minutes ago', hoursAgo: ' hours ago', daysAgo: ' days ago', weeksAgo: ' weeks ago' }
  }
  const mapValue = langMap[lang.toLowerCase()] || langMap['en-us']
  if (diff < 10)
    return mapValue.justNow
  if (diff < oneMinute)
    return `${Math.floor(diff / oneSeconds)}${mapValue.secondsAgo}`
  if (diff < oneHour)
    return `${Math.floor(diff / oneMinute)}${mapValue.minutesAgo}`
  if (diff < oneDay)
    return `${Math.floor(diff / oneHour)}${mapValue.hoursAgo}`
  if (diff < oneWeek)
    return `${Math.floor(diff / oneDay)}${mapValue.daysAgo}`
  return formatDate(new Date(date), 'yyyy-MM-dd')
}

function formatPagefindResult(result, count = 1) {
  const { sub_results: subResults, anchors, weighted_locations: weightedLocations } = result
  weightedLocations.sort((a, b) => {
    if (b.weight === a.weight)
      return a.location - b.location
    return b.weight - a.weight
  })
  const subs = []
  for (const { location } of weightedLocations) {
    const filterData = subResults.filter((sub) => {
      const { locations } = sub
      const [min] = locations || []
      if (typeof min !== 'number')
        return false
      const max = locations.length === 1 ? Number.POSITIVE_INFINITY : locations[locations.length - 1]
      return min <= location && location <= max
    })
    const sub = filterData.reduce((prev, curr) => {
      if (!prev)
        return curr
      return prev.locations.length > curr.locations.length ? prev : curr
    }, null)
    if (!sub)
      continue
    subs.push(sub)
    if (subs.length >= count)
      break
  }
  subs.sort((a, b) => {
    const [minA] = a.locations || []
    const [minB] = b.locations || []
    if (!minA || !minB)
      return 0
    return minA - minB
  })
  const filterMap = new Map()
  return subs.map(sub => parseSubResult(sub, anchors, result))
    .filter((v) => {
      if (filterMap.has(v.meta.title))
        return false
      filterMap.set(v.meta.title, v)
      return true
    })
}

function parseSubResult(sub, anchors, result) {
  const route = sub?.url || result?.url
  const description = sub?.excerpt || result?.excerpt
  const locationsAnchors = anchors?.filter((a) => {
    if (!sub)
      return false
    try { return a.location <= sub.anchor.location && a.element <= sub.anchor.element }
    catch { return false }
  }) || []
  locationsAnchors.reverse()
  const filteredAnchors = locationsAnchors.reduce((prev, curr) => {
    const isHave = prev.some(p => p.element === curr.element)
    if (isHave)
      return prev
    prev.unshift(curr)
    return prev
  }, [])
  const title = filteredAnchors.length ? filteredAnchors.map(t => t.text.trim()).filter(v => !!v).join(' > ') : result.meta.title
  const { base64, date, ...otherMeta } = result.meta
  return {
    route,
    meta: {
      date: date ? +date : undefined,
      ...decodeBase64AndDeserialize(base64),
      ...otherMeta,
      title,
      description,
    },
    result
  }
}

function debounce(func, wait) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

// Main logic
const trigger = document.getElementById('search-trigger')
const modal = document.getElementById('search-modal')
const input = document.getElementById('search-input')
const list = document.getElementById('search-list')
const clearBtn = document.getElementById('search-clear-btn')
const toggleBtn = document.getElementById('search-toggle-detail')
const backBtn = document.getElementById('search-back-btn')
const mask = modal.querySelector('[command-dialog-mask]')

let showDetail = localStorage.getItem('pagefind-search-showDetail') === 'true'
const dialog = modal.querySelector('.search-dialog')
if (showDetail)
  dialog.classList.add('detail-list')
if (showDetail)
  toggleBtn.classList.add('active')

function openModal() {
  modal.style.display = 'block'
  input.focus()
  loadPagefind()
}

function closeModal() {
  modal.style.display = 'none'
}

trigger.addEventListener('click', openModal)
mask.addEventListener('click', (e) => {
  if (e.target === mask)
    closeModal()
})
backBtn.addEventListener('click', closeModal)

document.addEventListener('keydown', (e) => {
  if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
    e.preventDefault()
    openModal()
  }
  if (e.key === 'Escape' && modal.style.display === 'block') {
    closeModal()
  }
})

toggleBtn.addEventListener('click', () => {
  showDetail = !showDetail
  localStorage.setItem('pagefind-search-showDetail', showDetail)
  dialog.classList.toggle('detail-list', showDetail)
  toggleBtn.classList.toggle('active', showDetail)
})

clearBtn.addEventListener('click', () => {
  input.value = ''
  renderList([])
  clearBtn.disabled = true
  input.focus()
})

let selectedIndex = -1

function renderList(results) {
  if (!results.length) {
    list.innerHTML = `<div command-empty>${currentSearchConfig.emptyText || 'No results found.'}</div>`
    return
  }

  const heading = currentSearchConfig.heading
    ? currentSearchConfig.heading.replace(/\{\{searchResult\}\}/, results.length)
    : `Total: ${results.length} search results.`
  const html = `
      <div command-group>
        <div command-group-heading>${heading}</div>
        ${results.map((item, index) => `
          <div command-item data-index="${index}" role="option" aria-selected="false">
            <div class="link">
              <div class="title">
                <span class="headings">${item.meta.title ? `<i class="prefix"># </i>${item.meta.title}` : ''}</span>
                ${item.meta.date ? `<span class="date">${formatShowDate(item.meta.date, currentLang)}</span>` : ''}
              </div>
              <div class="des">${item.meta.description || ''}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `
  list.innerHTML = html

  // Add click events
  const items = list.querySelectorAll('[command-item]')
  items.forEach((item) => {
    item.addEventListener('click', () => {
      const index = parseInt(item.dataset.index)
      const result = results[index]
      if (result) {
        window.location.href = result.route.startsWith(base) ? result.route : base + result.route.replace(/^\//, '')
        closeModal()
      }
    })
    // Hover effect handling
    item.addEventListener('mouseenter', () => {
      updateSelection(parseInt(item.dataset.index))
    })
  })
  selectedIndex = -1
}

function updateSelection(index) {
  const items = list.querySelectorAll('[command-item]')
  if (index >= items.length)
    index = items.length - 1
  if (index < 0)
    index = 0 // Don't go below 0 if items exist
  if (items.length === 0)
    return

  items.forEach(item => item.setAttribute('aria-selected', 'false'))
  if (index >= 0) {
    items[index].setAttribute('aria-selected', 'true')
    items[index].scrollIntoView({ block: 'nearest' })
  }
  selectedIndex = index
}

// Keyboard navigation
input.addEventListener('keydown', (e) => {
  const items = list.querySelectorAll('[command-item]')
  if (items.length === 0)
    return

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    updateSelection(selectedIndex + 1)
  }
  else if (e.key === 'ArrowUp') {
    e.preventDefault()
    updateSelection(selectedIndex - 1)
  }
  else if (e.key === 'Enter') {
    e.preventDefault()
    if (selectedIndex >= 0 && items[selectedIndex]) {
      items[selectedIndex].click()
    }
  }
})

let pagefindLoaded = false
async function loadPagefind() {
  if (pagefindLoaded)
    return
  try {
    const pagefindUrl = `${base}pagefind/pagefind.js`.replace(/\/+/g, '/')
    const module = await import(pagefindUrl)
    window.__pagefind__ = module
    module.init()
    pagefindLoaded = true
  }
  catch (e) {
    console.error('Failed to load pagefind', e)
  }
}

const chineseRegex = /[\u4E00-\u9FA5]/g
const segmenterCh = Intl?.Segmenter && new Intl.Segmenter('zh-CN', { granularity: 'word' })
function chineseSearchOptimize(input) {
  if (segmenterCh) {
    const splitWords = Array.from(segmenterCh.segment(input))
    return splitWords.map(v => v.segment).join(' ')
  }
  return input
    .replace(chineseRegex, ' $& ')
    .replace(/\s+/g, ' ')
    .trim()
}

const handleSearch = debounce(async (e) => {
  const val = e.target.value
  clearBtn.disabled = !val
  if (!val) {
    renderList([])
    return
  }

  if (!window.__pagefind__) {
    await loadPagefind()
  }

  if (window.__pagefind__) {
    const searchText = typeof currentSearchConfig.customSearchQuery === 'function'
      ? currentSearchConfig.customSearchQuery(val)
      : (chineseRegex.test(val) ? chineseSearchOptimize(val) : val)

    const search = await window.__pagefind__.debouncedSearch(searchText)
    if (search && search.results) {
      const pagefindResults = await Promise.all(search.results.map(r => r.data()))
      const formatted = pagefindResults
        .map(r => formatPagefindResult(r, currentSearchConfig.pageResultCount || 1))
        .flat()
        .filter((v) => {
          const ignorePublish = currentSearchConfig.ignorePublish ?? false
          return ignorePublish || v.meta.publish !== false
        })

      if (currentSearchConfig.sort) {
        formatted.sort(currentSearchConfig.sort)
      }

      const filtered = currentSearchConfig.filter
        ? formatted.filter(currentSearchConfig.filter)
        : formatted

      renderList(filtered)
    }
  }
}, currentSearchConfig.delay || 300)

input.addEventListener('input', handleSearch)
</script>

<template>
  <div class="blog-search" data-pagefind-ignore="all">
    <div id="search-trigger" class="nav-search-btn-wait">
      <span>
        <svg width="14" height="14" viewBox="0 0 20 20">
          <path
            d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
            stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"
          />
        </svg>
      </span>
      <span class="search-tip">{{ finalSearchConfig?.btnPlaceholder || 'Search' }}</span>
      <span class="metaKey"> Ctrl K </span>
    </div>

    <div id="search-modal" class="algolia" style="display: none;">
      <div command-dialog-mask>
        <div command-dialog-wrapper>
          <div command-dialog-header>
            <div class="search-bar">
              <div class="search-actions before">
                <button id="search-back-btn" class="back-button" title="Close search">
                  <span class="vpi-arrow-left local-search-icon" />
                </button>
              </div>
              <input id="search-input" command-input :placeholder="finalSearchConfig?.placeholder || 'Search Docs'">
              <div class="search-actions">
                <button
                  id="search-toggle-detail" class="toggle-layout-button"
                  type="button" title="Display detailed list"
                >
                  <span class="vpi-layout-list local-search-icon" />
                </button>
                <button
                  id="search-clear-btn" class="clear-button" type="reset"
                  title="Reset search" disabled
                >
                  <span class="vpi-delete local-search-icon" />
                </button>
              </div>
            </div>
          </div>
          <div command-dialog-body>
            <div class="search-dialog">
              <div id="search-list" command-list>
                <div command-empty>
                  {{ finalSearchConfig?.emptyText || 'No results found.' }}
                </div>
              </div>
            </div>
          </div>
          <div command-dialog-footer>
            <div class="command-palette-logo">
              <a href="https://github.com/cloudcannon/pagefind" target="_blank" rel="noopener noreferrer">
                <span class="command-palette-Label">{{ finalSearchConfig?.searchBy || 'Search by' }}</span>
                <svg
                  width="77"
                  height="15"
                  viewBox="0 0 594 112"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style="width: 77px;"
                >
                  <path
                    d="M147.8 111.2H164V77.5998H164.6C164.6 77.5998 170.6 87.1998 183.2 87.1998C197 87.1998 209.6 74.5998 209.6 56.5998C209.6 38.5998 197 25.9998 183.2 25.9998C170.6 25.9998 164.6 35.5998 164.6 35.5998H164V27.1998H147.8V111.2ZM178.4 72.1998C170 72.1998 163.4 65.5998 163.4 56.5998C163.4 47.5998 170 40.9998 178.4 40.9998C186.8 40.9998 193.4 47.5998 193.4 56.5998C193.4 65.5998 186.8 72.1998 178.4 72.1998Z"
                    fill="currentColor"
                  />
                  <path
                    d="M230.628 87.1998C242.028 87.1998 248.028 78.7998 248.028 78.7998H248.628V85.9998C252.228 85.9998 264.828 85.9998 264.828 85.9998V49.3998C264.828 36.1998 254.628 25.9998 239.628 25.9998C224.028 25.9998 215.628 37.3998 215.628 37.3998L225.228 46.9998C225.228 46.9998 230.028 40.3998 238.428 40.3998C244.428 40.3998 248.028 43.9998 248.628 48.1998L230.028 51.5598C219.228 53.4798 212.628 60.7998 212.628 70.3998C212.628 79.9998 219.828 87.1998 230.628 87.1998ZM236.028 73.9998C231.228 73.9998 228.828 71.5998 228.828 67.9998C228.828 64.9998 231.228 62.7198 235.428 61.9998L248.628 59.5998V60.7998C248.628 68.5998 243.228 73.9998 236.028 73.9998Z"
                    fill="currentColor"
                  />
                  <path
                    d="M299.033 111.2C317.633 111.2 330.833 97.9998 330.833 79.9998V27.1998H314.633V35.5998H314.033C314.033 35.5998 308.633 25.9998 296.033 25.9998C282.833 25.9998 270.833 37.9998 270.833 55.3998C270.833 72.7998 282.833 84.7998 296.033 84.7998C308.633 84.7998 314.033 75.1998 314.033 75.1998H314.633V79.9998C314.633 89.5998 308.033 96.1998 299.033 96.1998C289.433 96.1998 283.433 88.9998 283.433 88.9998L273.233 99.1998C273.233 99.1998 281.633 111.2 299.033 111.2ZM300.833 69.7998C293.033 69.7998 287.033 63.7998 287.033 55.3998C287.033 46.9998 293.033 40.9998 300.833 40.9998C308.633 40.9998 314.633 46.9998 314.633 55.3998C314.633 63.7998 308.633 69.7998 300.833 69.7998Z"
                    fill="currentColor"
                  />
                  <path
                    d="M367.986 87.1998C384.186 87.1998 393.186 77.5998 393.186 77.5998L384.786 66.1998C384.786 66.1998 379.386 72.7998 369.186 72.7998C360.186 72.7998 355.386 67.9998 353.586 62.5998H396.186C396.186 62.5998 396.786 59.5998 396.786 55.3998C396.786 39.1998 383.586 25.9998 367.386 25.9998C350.586 25.9998 336.786 39.7998 336.786 56.5998C336.786 73.3998 350.586 87.1998 367.986 87.1998ZM353.586 50.5998C355.386 45.1998 360.186 40.3998 366.786 40.3998C373.386 40.3998 378.186 45.1998 379.986 50.5998H353.586Z"
                    fill="currentColor"
                  />
                  <path
                    d="M406.423 85.9998H422.624V43.3998H444.224V85.9998H460.423V28.3998H422.624V24.7998C422.624 19.3998 425.624 16.3998 430.423 16.3998C433.423 16.3998 435.823 17.5998 435.823 17.5998V2.5998C435.823 2.5998 431.624 0.799805 426.224 0.799805C414.224 0.799805 406.423 8.59981 406.423 22.3998V28.3998H397.423V43.3998H406.423V85.9998ZM452.263 19.3998C457.423 19.3998 461.624 15.1998 461.624 10.3998C461.624 5.59981 457.424 1.3998 452.384 1.3998C447.224 1.3998 443.023 5.59981 443.023 10.3998C443.023 15.1998 447.223 19.3998 452.263 19.3998Z"
                    fill="currentColor"
                  />
                  <path
                    d="M470.652 85.9998H486.852V54.7998C486.852 46.9998 492.252 41.5998 499.452 41.5998C506.052 41.5998 510.252 45.7998 510.252 52.9998V85.9998H526.452V50.5998C526.452 35.5998 516.852 25.9998 504.852 25.9998C493.452 25.9998 487.452 35.5998 487.452 35.5998H486.852V27.1998H470.652V85.9998Z"
                    fill="currentColor"
                  />
                  <path
                    d="M557.819 87.1998C570.419 87.1998 576.419 77.5998 576.419 77.5998H577.019V85.9998H593.219V1.9998H577.019V35.5998H576.419C576.419 35.5998 570.419 25.9998 557.819 25.9998C544.019 25.9998 531.419 38.5998 531.419 56.5998C531.419 74.5998 544.019 87.1998 557.819 87.1998ZM562.619 72.1998C554.219 72.1998 547.619 65.5998 547.619 56.5998C547.619 47.5998 554.219 40.9998 562.619 40.9998C571.019 40.9998 577.619 47.5998 577.619 56.5998C577.619 65.5998 571.019 72.1998 562.619 72.1998Z"
                    fill="currentColor"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M60 96.9999C93.1371 96.9999 120 81.8416 120 63.1428V50.8311H115.91C107.182 38.2198 85.4398 29.2856 60 29.2856C34.5602 29.2856 12.8183 38.2198 4.09026 50.8311H0V63.1428C0 81.8416 26.8629 96.9999 60 96.9999Z"
                    fill="currentColor"
                  />
                  <path
                    d="M116 52C116 59.317 110.727 66.7404 100.454 72.5615C90.3014 78.3149 76.0069 82 60 82C43.9931 82 29.6986 78.3149 19.5456 72.5615C9.2731 66.7404 4 59.317 4 52C4 44.6831 9.2731 37.2596 19.5456 31.4385C29.6986 25.6851 43.9931 22 60 22C76.0069 22 90.3014 25.6851 100.454 31.4385C110.727 37.2596 116 44.6831 116 52Z"
                    fill="var(--vp-c-bg)"
                    stroke="currentColor"
                    stroke-width="8"
                  />
                  <path
                    d="M57.8864 72.0605L87.2817 41.837C88.6253 40.4556 87.43 38.1599 85.5278 38.4684L26.0819 48.1083C23.9864 48.4481 23.794 51.3882 25.8273 51.9982L46.7151 58.2645C47.2181 58.4154 47.6415 58.7581 47.894 59.2185L54.6991 71.6277C55.3457 72.8069 56.9487 73.0246 57.8864 72.0605Z"
                    fill="currentColor"
                  />
                  <ellipse cx="58" cy="53.5" rx="7" ry="4.5" fill="var(--vp-c-bg)" />
                </svg>
              </a>
            </div>
            <ul class="command-palette-commands">
              <li>
                <kbd class="command-palette-commands-key"><svg width="15" height="15" aria-label="Enter key" role="img">
                  <g
                    fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="1.2"
                  >
                    <path d="M12 3.53088v3c0 1-1 2-2 2H4M7 11.53088l-3-3 3-3" />
                  </g>
                </svg></kbd><span class="command-palette-Label">{{ finalSearchConfig?.toSelect || 'to select' }}</span>
              </li>
              <li>
                <kbd class="command-palette-commands-key"><svg width="15" height="15" aria-label="Arrow down" role="img">
                  <g
                    fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="1.2"
                  >
                    <path d="M7.5 3.5v8M10.5 8.5l-3 3-3-3" />
                  </g>
                </svg></kbd><kbd class="command-palette-commands-key"><svg
                  width="15" height="15" aria-label="Arrow up"
                  role="img"
                >
                  <g
                    fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="1.2"
                  >
                    <path d="M7.5 11.5v-8M10.5 6.5l-3-3-3 3" />
                  </g>
                </svg></kbd><span class="command-palette-Label">{{ finalSearchConfig?.toNavigate || 'to navigate' }}</span>
              </li>
              <li>
                <kbd class="command-palette-commands-key"><svg width="15" height="15" aria-label="Escape key" role="img">
                  <g
                    fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="1.2"
                  >
                    <path
                      d="M13.6167 8.936c-.1065.3583-.6883.962-1.4875.962-.7993 0-1.653-.9165-1.653-2.1258v-.5678c0-1.2548.7896-2.1016 1.653-2.1016.8634 0 1.3601.4778 1.4875 1.0724M9 6c-.1352-.4735-.7506-.9219-1.46-.8972-.7092.0246-1.344.57-1.344 1.2166s.4198.8812 1.3445.9805C8.465 7.3992 8.968 7.9337 9 8.5c.032.5663-.454 1.398-1.4595 1.398C6.6593 9.898 6 9 5.963 8.4851m-1.4748.5368c-.2635.5941-.8099.876-1.5443.876s-1.7073-.6248-1.7073-2.204v-.4603c0-1.0416.721-2.131 1.7073-2.131.9864 0 1.6425 1.031 1.5443 2.2492h-2.956"
                    />
                  </g>
                </svg></kbd><span class="command-palette-Label">{{ finalSearchConfig?.toClose || 'to close' }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="search-data" :data-search-config="stringifySearchConfig" :data-lang="lang" :data-base="site.base" :data-locale="localeIndex" style="display: none;" />
</template>

<style lang="css" scoped>
.blog-search {
  flex: 1;
  display: flex;
  padding-left: 32px;
}

.blog-search>.nav-search-btn-wait {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border: 1px solid transparent;
  border-radius: 6px;
  transition: .2s border;
  border-radius: 8px;
  padding: 0 10px 0 12px;
  height: 40px;
  background-color: var(--vp-c-bg-alt);
}

.blog-search .nav-search-btn-wait .metaKey {
  margin-left: 10px;
  font-size: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  padding: 0 6px;
}

.blog-search .nav-search-btn-wait:hover {
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 6px;
}

.blog-search .nav-search-btn-wait .search-tip {
  color: #909399;
  font-size: 12px;
  padding-left: 8px;
  padding-right: 16px;
}

@media screen and (max-width: 759px) {
  .blog-search>.nav-search-btn-wait {
    background-color: inherit;
  }

  .metaKey {
    display: none;
  }

  .search-tip {
    display: none;
  }

  .blog-search {
    flex: 0;
  }
}

.search-bar {
  display: flex;
  cursor: text;
  align-items: center;
  border-radius: 4px;
  border: 1px solid var(--vcp-c-brand);
}

.search-bar input {
  width: 100%;
}

.search-bar .search-actions {
  display: flex;
  gap: 4px;
  padding-right: 12px;
}

.search-bar .search-actions.before {
  padding: 0;
}

.search-actions button {
  padding: 8px;
}

.local-search-icon {
  display: block;
  font-size: 18px;
}

.search-actions button.clear-button:disabled {
  opacity: 0.37;
}

.search-actions button:not([disabled]):hover,
.search-actions button.active:not([disabled]) {
  color: var(--vp-c-brand-1);
}

.search-actions.before {
  display: none;
}

@media screen and (max-width: 560px) {
  .search-actions.before {
    display: flex;
  }
}
</style>

<style lang="css">
@import './assets/scss/search.css';
</style>
