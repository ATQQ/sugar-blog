<template>
  <div class="blog-search" v-if="openSearch" data-pagefind-ignore="all">
    <div class="nav-search-btn-wait" @click="searchModal = true">
      <svg width="14" height="14" viewBox="0 0 20 20">
        <path
          d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
          stroke="currentColor"
          fill="none"
          fill-rule="evenodd"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
      <span v-if="!isMinimized" class="search-tip">{{
        searchConfig?.btnPlaceholder || '搜索'
      }}</span>
      <span v-if="!isMinimized" class="metaKey"> {{ metaKey }} K </span>
    </div>
    <Command.Dialog :visible="searchModal" theme="algolia">
      <template #header>
        <Command.Input
          v-model:value="searchWords"
          :placeholder="searchConfig?.placeholder || '请输入要搜素的内容'"
        />
      </template>
      <template #body>
        <div class="search-dialog">
          <Command.List>
            <Command.Empty v-if="!searchResult.length">{{
              searchConfig?.emptyText || 'No results found.'
            }}</Command.Empty>
            <Command.Group v-else :heading="headingText">
              <Command.Item
                v-for="item in searchResult"
                :data-value="item.route"
                :key="item.route"
                @select="handleSelect"
              >
                <div class="link">
                  <div class="title">
                    <span>{{ item.meta.title }}</span>
                    <span class="date">
                      {{ formatDate(item.meta.date, 'yyyy-MM-dd') }}</span
                    >
                  </div>
                  <div class="des" v-html="item.meta.description"></div>
                </div>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </div>
      </template>
      <template #footer v-if="searchResult.length">
        <div class="command-palette-logo">
          <a
            v-if="openSearch === 'pagefind'"
            href="https://github.com/cloudcannon/pagefind"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="command-palette-Label">Search by</span>
            <logo-pagefind style="width: 77px" />
          </a>
        </div>
        <ul class="command-palette-commands">
          <li>
            <kbd class="command-palette-commands-key"
              ><svg width="15" height="15" aria-label="Enter key" role="img">
                <g
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.2"
                >
                  <path
                    d="M12 3.53088v3c0 1-1 2-2 2H4M7 11.53088l-3-3 3-3"
                  ></path>
                </g></svg></kbd
            ><span class="command-palette-Label">to select</span>
          </li>
          <li>
            <kbd class="command-palette-commands-key"
              ><svg width="15" height="15" aria-label="Arrow down" role="img">
                <g
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.2"
                >
                  <path d="M7.5 3.5v8M10.5 8.5l-3 3-3-3"></path>
                </g></svg></kbd
            ><kbd class="command-palette-commands-key"
              ><svg width="15" height="15" aria-label="Arrow up" role="img">
                <g
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.2"
                >
                  <path d="M7.5 11.5v-8M10.5 6.5l-3-3-3 3"></path>
                </g></svg></kbd
            ><span class="command-palette-Label">to navigate</span>
          </li>
          <li>
            <kbd class="command-palette-commands-key"
              ><svg width="15" height="15" aria-label="Escape key" role="img">
                <g
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.2"
                >
                  <path
                    d="M13.6167 8.936c-.1065.3583-.6883.962-1.4875.962-.7993 0-1.653-.9165-1.653-2.1258v-.5678c0-1.2548.7896-2.1016 1.653-2.1016.8634 0 1.3601.4778 1.4875 1.0724M9 6c-.1352-.4735-.7506-.9219-1.46-.8972-.7092.0246-1.344.57-1.344 1.2166s.4198.8812 1.3445.9805C8.465 7.3992 8.968 7.9337 9 8.5c.032.5663-.454 1.398-1.4595 1.398C6.6593 9.898 6 9 5.963 8.4851m-1.4748.5368c-.2635.5941-.8099.876-1.5443.876s-1.7073-.6248-1.7073-2.204v-.4603c0-1.0416.721-2.131 1.7073-2.131.9864 0 1.6425 1.031 1.5443 2.2492h-2.956"
                  ></path>
                </g></svg></kbd
            ><span class="command-palette-Label">to close</span>
          </li>
        </ul>
      </template>
    </Command.Dialog>
  </div>
</template>

<script lang="ts" setup>
// @ts-nocheck
import { computed, nextTick, ref, watch, onBeforeMount, onMounted } from 'vue'
import { Command } from 'vue-command-palette'
import { useRoute, useRouter, withBase } from 'vitepress'
import { useMagicKeys, useWindowSize } from '@vueuse/core'
import { chineseSearchOptimize, formatDate } from '../utils'
import { useArticles, useBlogConfig } from '../composables/config/blog'
import { Theme } from '../composables/config'
import LogoPagefind from './LogoPagefind.vue'

const windowSize = useWindowSize()

const isMinimized = computed(() => windowSize.width.value < 760)
const flexValue = computed(() => (isMinimized.value ? 0 : 1))
const { search: searchConfig } = useBlogConfig()

const headingText = computed(() => {
  return searchConfig?.heading
    ? searchConfig.heading.replace(
        /\{\{searchResult\}\}/,
        searchResult.value.length
      )
    : `共: ${searchResult.value.length} 个搜索结果`
})
const openSearch = computed(() =>
  searchConfig instanceof Object
    ? searchConfig.mode ?? true
    : searchConfig ?? true
)

const addInlineScript = () => {
  const scriptText = `import('${withBase('/_pagefind/pagefind.js')}')
        .then((module) => {
          window.__pagefind__ = module
        })
        .catch(() => {
          console.log('not load /_pagefind/pagefind.js')
        })`
  const inlineScript = document.createElement('script')
  inlineScript.innerHTML = scriptText
  document.head.appendChild(inlineScript)
}

onBeforeMount(() => {
  if (openSearch.value === 'pagefind') {
    addInlineScript()
  }
})

const metaKey = ref('')
onMounted(() => {
  metaKey.value = /(Mac|iPhone|iPod|iPad)/i.test(navigator?.platform)
    ? '⌘'
    : 'Ctrl'
})
const searchModal = ref(false)
const searchWords = ref('')
const docs = useArticles()
const docsMap = computed(() => {
  const map = new Map<string, Theme.PageData.meta>()
  docs.value.forEach((doc) => {
    map.set(withBase(doc.route.replace(/index$/, '')), doc.meta)
  })
  return map
})

const keys = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.ctrlKey && e.key === 'k' && e.type === 'keydown') e.preventDefault()
  }
})
const CmdK = keys['Meta+K']
const CtrlK = keys['Ctrl+K']
// eslint-disable-next-line dot-notation, prefer-destructuring
const Escape = keys['Escape']

watch(CtrlK, (v) => {
  if (v) {
    searchModal.value = true
  }
})
watch(CmdK, (v) => {
  if (v) {
    searchModal.value = true
  }
})
watch(Escape, (v) => {
  if (v) {
    searchModal.value = false
  }
})

const searchResult = ref<Theme.PageData[]>([])
const inlineSearch = () => {
  if (!searchWords.value) {
    searchResult.value = []
    return
  }
  searchResult.value = docs.value
    .filter((v) =>
      `${v.meta.description}${v.meta.title}`.includes(searchWords.value)
    )
    .map((v) => {
      return {
        ...v,
        meta: {
          ...v.meta,
          description:
            v.meta?.description?.replace(
              new RegExp(`(${searchWords.value})`, 'g'),
              '<mark>$1</mark>'
            ) || ''
        }
      }
    })
  searchResult.value.sort((a, b) => {
    return +new Date(b.meta.date) - +new Date(a.meta.date)
  })
}

watch(
  () => searchWords.value,
  async () => {
    if (openSearch.value === 'pagefind') {
      // dev-server兜底
      // @ts-ignore
      if (!window?.__pagefind__?.search) {
        inlineSearch()
      } else {
        // @ts-ignore
        await window?.__pagefind__
          ?.search?.(chineseSearchOptimize(searchWords.value))
          .then(async (search: any) => {
            const result = await Promise.all(
              search.results.map((v: any) => v.data())
            )
            searchResult.value = result.map((result) => {
              const { url, excerpt } = result
              const targetRoute = url.replace(/\.html$/, '')
              const meta = docsMap.value.get(targetRoute)
              if (meta) {
                return {
                  route: targetRoute,
                  meta: {
                    ...meta,
                    description: excerpt
                  }
                }
              }
              return {
                route: url,
                meta: {
                  ...result.meta,
                  description: excerpt
                }
              }
            })
          })
      }
    } else {
      inlineSearch()
    }
    nextTick(() => {
      // hack 原组件实现
      document.querySelectorAll('div[aria-disabled="true"]').forEach((v) => {
        v.setAttribute('aria-disabled', 'false')
      })
    })
  }
)

const handleClickMask = (e: any) => {
  if (e.target === e.currentTarget) {
    searchModal.value = false
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
    } else {
      document
        .querySelector('div[command-dialog-mask]')
        ?.removeEventListener('click', handleClickMask)
    }
  }
)

// 搜索结果分页？
// const pageSize = ref(6)
// const currentPage = ref(0)
// const showSearchResult = computed(() => {
//   // 合法性处理
//   const pageIdx =
//     currentPage.value % Math.ceil(searchResult.value.length / pageSize.value)
//   const startIdx = pageIdx * pageSize.value
//   return searchResult.value.slice(startIdx, startIdx + pageSize.value)
// })

const router = useRouter()
const route = useRoute()
const handleSelect = (target: any) => {
  searchModal.value = false
  if (!route.path.startsWith(target.value)) {
    // searchWords.value = ''
    router.go(target.value)
  }
}
</script>

<style lang="scss" scoped>
.blog-search {
  flex: v-bind(flexValue);
  display: flex;
  padding-left: 32px;
  .nav-search-btn-wait {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    box-sizing: border-box;

    .metaKey {
      margin-left: 10px;
      font-size: 12px;
    }

    &:hover {
      border: 1px solid var(--vp-c-brand);
      border-radius: 6px;
    }

    .search-tip {
      color: #909399;
      font-size: 12px;
      padding-left: 10px;
    }
  }
}
</style>

<style lang="scss">
@import '../styles/scss/global.scss';
@import '../styles/scss/algolia.scss';

div[command-group] {
  display: block !important;
}
div[command-item] {
  display: flex !important;
}
.search-dialog {
  div[command-item] > div.link {
    width: 100%;
  }
  div[command-item] .title {
    display: flex;
    justify-content: space-between;
  }

  div[command-item] .des {
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: keep-all;
    white-space: nowrap;
  }

  div[command-item] .date {
    min-width: 80px;
  }
  div[command-item] mark {
    background: none;
    color: var(--vp-c-brand);
  }

  div[command-item][aria-selected='true'] mark,
  div[command-item]:hover mark {
    color: inherit;
    text-decoration: underline;
  }
}
</style>
