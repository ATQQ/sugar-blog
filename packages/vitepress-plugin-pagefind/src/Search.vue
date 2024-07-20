<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'

// @ts-expect-error
import { Command } from 'vue-command-palette'
import { useData, useRoute, useRouter, withBase } from 'vitepress'
import { useLocalStorage, useMagicKeys } from '@vueuse/core'

// @ts-expect-error
import { searchConfig as _searchConfig } from 'virtual:pagefind'
import LogoPagefind from './LogoPagefind.vue'
import type { SearchConfig } from './type'
import { formatPagefindResult } from './search'
import { formatShowDate } from './utils'

// 搜索结果
const searchResult = ref<{ route: string; meta: Record<string, any> }[]>([])
// 配置获取
const searchConfig: SearchConfig = _searchConfig

const { localeIndex, site, lang } = useData()

// 合并后的最终配置
const finalSearchConfig = computed<SearchConfig>(() => ({
  ...searchConfig,
  // i18n支持
  ...(searchConfig?.locales?.[localeIndex.value] || {})
}))

// 忽略 publish: false 的控制
const ignorePublish = computed(() => finalSearchConfig.value?.ignorePublish ?? false)

// 展示日期信息
const showDateInfo = computed(() => finalSearchConfig.value?.showDate ?? false)

const formatShowDateFn = computed(() => typeof finalSearchConfig.value.showDate === 'function' ? finalSearchConfig.value.showDate : formatShowDate)

// 搜索条数展示
const headingText = computed(() => {
  return finalSearchConfig.value?.heading
    ? finalSearchConfig.value.heading.replace(
      /\{\{searchResult\}\}/,
      `${searchResult.value.length}`
    )
    : `Total: ${searchResult.value.length} search results.`
})

// 展示的快捷键
const metaKey = ref('')
onMounted(() => {
  metaKey.value = /(Mac|iPhone|iPod|iPad)/i.test(navigator?.platform)
    ? '⌘'
    : 'Ctrl'
})

// 控制搜索框的展示
const searchModal = ref(false)
function showSearchModal() {
  searchModal.value = true
}
function hideSearchModal() {
  searchModal.value = false
}

const keys = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.ctrlKey && e.key === 'k' && e.type === 'keydown')
      e.preventDefault()
  }
})

const CmdK = keys['Meta+K']
const CtrlK = keys['Ctrl+K']
// eslint-disable-next-line dot-notation, prefer-destructuring
const Escape = keys['Escape']

watch(CmdK, (v) => {
  if (v) {
    showSearchModal()
  }
})
watch(CtrlK, (v) => {
  if (v) {
    showSearchModal()
  }
})
watch(Escape, (v) => {
  if (v) {
    hideSearchModal()
  }
})

// 搜索的关键词
const searchWords = ref('')
function inlineSearch() {
  if (!searchWords.value) {
    searchResult.value = []
    return
  }
  searchResult.value = [{
    route: '#',
    meta: {
      title: '只在构建后才生效',
      description: '<mark>only support after build</mark>, only support after build'
    }
  }]
}

const chineseRegex = /[\u4E00-\u9FA5]/g
const segmenterCh = Intl?.Segmenter && new Intl.Segmenter('ch', { granularity: 'word' })
function chineseSearchOptimize(input: string) {
  if (segmenterCh) {
    const splitWords = Array.from(segmenterCh?.segment(input))
    return splitWords.map(v => v.segment).join(' ')
  }

  return input
    .replace(chineseRegex, ' $& ')
    .replace(/\s+/g, ' ')
    .trim()
}

const searchDelayTime = computed(() => finalSearchConfig.value?.delay ?? 300)

// 触发搜索
watch(
  () => searchWords.value,
  async () => {
    // dev-server兜底
    // @ts-expect-error
    if (!window?.__pagefind__?.search) {
      inlineSearch()
      return
    }

    // 拆分搜索的关键词
    const searchText
      = typeof finalSearchConfig.value.customSearchQuery === 'function'
        ? finalSearchConfig.value.customSearchQuery(searchWords.value)
        // 判断有中文，默认启用优化
        : (chineseRegex.test(searchWords.value) ? chineseSearchOptimize(searchWords.value) : searchWords.value)
    // @ts-expect-error
    await window?.__pagefind__
      ?.debouncedSearch?.(searchText, {}, searchDelayTime.value)
      .then(async (pagefindSearchResult: any) => {
        if (pagefindSearchResult === null) {
          return
        }
        // pagefind 搜索结果
        const pagefindResults = await Promise.all(
          pagefindSearchResult.results.map((v: any) => v.data())
        )
        // 格式化搜索结果
        const formattedResults = pagefindResults
          .map((r) => {
            const results = formatPagefindResult(r, finalSearchConfig.value.pageResultCount || 1)
            return results.map((result) => {
              // base 兼容
              result.route = result.route.startsWith(site.value.base)
                ? result.route
                : withBase(result.route)
              return result
            })
          })
          .flat()
          // 过滤掉未发布的
          .filter((v) => {
            return ignorePublish.value || v.meta.publish !== false
          })

        if (finalSearchConfig.value.sort) {
          formattedResults.sort(finalSearchConfig.value.sort)
        }
        // 调用自定义过滤
        searchResult.value = formattedResults.filter(
          finalSearchConfig.value.filter ?? (() => true)
        )
      })

    nextTick(() => {
      // hack 原组件实现
      document.querySelectorAll('div[aria-disabled="true"]').forEach((v) => {
        v.setAttribute('aria-disabled', 'false')
      })
    })
  }
)

function handleClickMask(e: any) {
  if (e.target === e.currentTarget) {
    hideSearchModal()
  }
}
watch(
  () => searchModal.value,
  (newValue) => {
    if (newValue) {
      nextTick(() => {
        document
          .querySelector('div[command-dialog-mask]')
          ?.addEventListener('click', handleClickMask)
      })
    }
    else {
      document
        .querySelector('div[command-dialog-mask]')
        ?.removeEventListener('click', handleClickMask)
    }
  }
)
// TODO：搜索结果限制
const pageSize = ref(999)
const currentPage = ref(0)
const showSearchResult = computed(() => {
  // 合法性处理
  const pageIdx
    = currentPage.value % Math.ceil(searchResult.value.length / pageSize.value)
  const startIdx = pageIdx * pageSize.value
  return searchResult.value.slice(startIdx, startIdx + pageSize.value)
})

// 选择搜索结果跳转
const router = useRouter()
const route = useRoute()
function handleSelect(target: any) {
  hideSearchModal()
  if (route.path !== target.value) {
    router.go(target.value)
  }
}

// 语言切换，重载页面
const langReload = computed(() => finalSearchConfig.value.langReload ?? true)
watch(
  () => lang.value,
  () => {
    // 不在开发环境生效
    if (import.meta.env.DEV) {
      return
    }
    // 重载页面
    if (langReload.value) {
      window.location.reload()
    }
  }
)

// 清空搜索关键词
const searchInput = ref<HTMLInputElement>()
function handleClearSearch() {
  searchWords.value = ''
  nextTick(() => {
    if (!searchInput.value)
      return
    // @ts-expect-error
    searchInput.value.$el.value = ''
  })
}

// 控制结果展示形式
const showDetail = useLocalStorage('pagefind-search-showDetail', false)
function handleToggleDetail() {
  showDetail.value = !showDetail.value
}
</script>

<template>
  <div class="blog-search" data-pagefind-ignore="all">
    <div class="nav-search-btn-wait" @click="searchModal = true">
      <span>
        <svg width="14" height="14" viewBox="0 0 20 20">
          <path
            d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
            stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"
          />
        </svg>
      </span>
      <span class="search-tip">{{
        finalSearchConfig?.btnPlaceholder || 'Search'
      }}</span>
      <span class="metaKey"> {{ metaKey }} K </span>
    </div>
    <ClientOnly>
      <Command.Dialog :visible="searchModal" theme="algolia">
        <template #header>
          <div class="search-bar">
            <div class="search-actions before">
              <button class="back-button" title="Close search" @click="searchModal = false">
                <span class="vpi-arrow-left local-search-icon" />
              </button>
            </div>
            <Command.Input
              ref="searchInput" v-model:value="searchWords"
              :placeholder="finalSearchConfig?.placeholder || 'Search Docs'"
            />
            <div class="search-actions">
              <button
                :class="{ active: showDetail }" class="toggle-layout-button" type="button"
                title="Display detailed list" @click="handleToggleDetail"
              >
                <span class="vpi-layout-list local-search-icon" />
              </button>
              <button
                :disabled="!searchWords" class="clear-button" type="reset" title="Reset search"
                @click="handleClearSearch"
              >
                <span class="vpi-delete local-search-icon" />
              </button>
            </div>
          </div>
        </template>
        <template #body>
          <div class="search-dialog" :class="{ 'detail-list': showDetail }">
            <Command.List>
              <Command.Empty v-if="!searchResult.length">
                {{ finalSearchConfig?.emptyText || 'No results found.' }}
              </Command.Empty>
              <Command.Group v-else :heading="headingText">
                <Command.Item
                  v-for="item in showSearchResult" :key="item.route" :data-value="item.route"
                  @select="handleSelect"
                >
                  <div class="link">
                    <div class="title">
                      <span class="headings"><i v-if="item.meta.title" class="prefix"># </i>{{ item.meta.title }}</span>
                      <span v-if="showDateInfo && item.meta.date" class="date">
                        {{ formatShowDateFn(item.meta.date, lang) }}</span>
                    </div>
                    <div class="des" v-html="item.meta.description" />
                  </div>
                </Command.Item>
              </Command.Group>
            </Command.List>
          </div>
        </template>
        <template v-if="searchResult.length" #footer>
          <div class="command-palette-logo">
            <a href="https://github.com/cloudcannon/pagefind" target="_blank" rel="noopener noreferrer">
              <span class="command-palette-Label">{{ finalSearchConfig?.searchBy || 'Search by' }}</span>
              <LogoPagefind style="width: 77px" />
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
        </template>
      </Command.Dialog>
    </ClientOnly>
  </div>
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
