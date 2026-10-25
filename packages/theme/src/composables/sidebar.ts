import { ref } from 'vue'

const COLLAPSE_KEY = 'sugar-blog-sidebar-collapsed'
const ANIMATING_MS = 300

const isSidebarCollapsed = ref(false)
const isSidebarAutoHidden = ref(false)
let isInitialized = false
let animatingTimer: ReturnType<typeof setTimeout> | undefined

function syncClass(className: string, val: boolean) {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle(className, val)
  }
}

/** 仅在用户手动折叠/展开时短暂开启内容区过渡，避免路由切换时 padding 动画导致内容滑入 */
function withSidebarAnimating(fn: () => void) {
  if (typeof window === 'undefined') {
    fn()
    return
  }
  syncClass('sidebar-animating', true)
  fn()
  clearTimeout(animatingTimer)
  animatingTimer = setTimeout(() => {
    syncClass('sidebar-animating', false)
  }, ANIMATING_MS)
}

function initCollapsed(collapsed?: boolean) {
  if (isInitialized || typeof window === 'undefined')
    return
  isInitialized = true
  const cached = localStorage.getItem(COLLAPSE_KEY)
  const next = cached === 'true' ? true : cached === 'false' ? false : !!collapsed
  isSidebarCollapsed.value = next
  syncClass('sidebar-collapsed', next)
}

export function useSidebarToggle(options?: { collapsed?: boolean }) {
  initCollapsed(options?.collapsed)

  const collapse = () => {
    withSidebarAnimating(() => {
      isSidebarCollapsed.value = true
      if (typeof window !== 'undefined') {
        localStorage.setItem(COLLAPSE_KEY, 'true')
        syncClass('sidebar-collapsed', true)
      }
    })
  }

  const expand = () => {
    withSidebarAnimating(() => {
      isSidebarCollapsed.value = false
      if (typeof window !== 'undefined') {
        localStorage.setItem(COLLAPSE_KEY, 'false')
        syncClass('sidebar-collapsed', false)
      }
    })
  }

  // 当前页面在侧边栏中无对应文章时自动隐藏侧栏（不改写 VitePress 的 frontmatter）
  const setAutoHidden = (val: boolean) => {
    isSidebarAutoHidden.value = val
    syncClass('sidebar-auto-hidden', val)
  }

  return { isSidebarCollapsed, isSidebarAutoHidden, collapse, expand, setAutoHidden }
}
