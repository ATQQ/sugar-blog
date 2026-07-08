import { computed, reactive, toRefs } from 'vue'

interface FilteredItem {
  count: number
  items: Map<string, any>
  groups: Set<string>
}

interface State {
  selectedNode: string
  selectedGroup: string
  shouldRerender: boolean
  search: string
  filtered: FilteredItem
}

const state = reactive<State>({
  selectedNode: '',
  selectedGroup: '',
  shouldRerender: false,
  search: '',
  filtered: {
    count: 0,
    items: new Map(),
    groups: new Set(),
  },
})

function useCommandState() {
  const isSearching = computed(() => state.search !== '')

  const resetStore = () => {
    state.search = ''
    state.filtered.count = 0
    state.filtered.items = new Map()
    state.filtered.groups = new Set()
  }

  return {
    isSearching,
    resetStore,
    ...toRefs(state),
  }
}

export { useCommandState }
