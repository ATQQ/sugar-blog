import { onMounted, ref } from 'vue'

const isSidebarCollapsed = ref(false)
let isInitialized = false

function syncClass(val: boolean) {
  if (typeof document !== 'undefined') {
    if (val) {
      document.documentElement.classList.add('sidebar-collapsed')
    }
    else {
      document.documentElement.classList.remove('sidebar-collapsed')
    }
  }
}

export function useSidebarToggle() {
  onMounted(() => {
    if (!isInitialized && typeof window !== 'undefined') {
      isInitialized = true
      const cached = localStorage.getItem('sugar-blog-sidebar-collapsed')
      if (cached === 'true') {
        isSidebarCollapsed.value = true
        syncClass(true)
      }
    }
  })

  const collapse = () => {
    isSidebarCollapsed.value = true
    if (typeof window !== 'undefined') {
      localStorage.setItem('sugar-blog-sidebar-collapsed', 'true')
      syncClass(true)
    }
  }

  const expand = () => {
    isSidebarCollapsed.value = false
    if (typeof window !== 'undefined') {
      localStorage.setItem('sugar-blog-sidebar-collapsed', 'false')
      syncClass(false)
    }
  }

  return { isSidebarCollapsed, collapse, expand }
}
