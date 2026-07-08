<script lang="ts" setup>
import { nextTick, onMounted, provide, ref, watch } from 'vue'

import { useCommandState } from './useCommandState'
import { useCommandEvent } from './useCommandEvent'
import { findNextSibling, findPreviousSibling } from './utils'
import type { CommandRootEmits, CommandRootProps } from './types'

defineOptions({
  name: 'Command.Root',
})

const props = withDefaults(defineProps<CommandRootProps>(), {
  theme: 'default',
})

const emit = defineEmits<CommandRootEmits>()

const ITEM_SELECTOR = '[command-item=""]'
const ITEM_KEY_SELECTOR = 'command-item-key'
const GROUP_SELECTOR = '[command-group=""]'
const GROUP_HEADING_SELECTOR = '[command-group-heading=""]'
const VALID_ITEM_SELECTOR = `${ITEM_SELECTOR}:not([aria-disabled="true"])`
const SELECTED_ITEM_SELECTOR = `${ITEM_SELECTOR}[aria-selected="true"]`
const SELECT_EVENT = 'command-item-select'

provide('theme', props.theme || 'default')
const { selectedNode, filtered, shouldRerender } = useCommandState()
const { itemInfo, rerenderList } = useCommandEvent()

const commandRef = ref<HTMLDivElement>()

function scrollSelectedIntoView() {
  const item = getSelectedItem()

  if (item) {
    if (item.parentElement?.firstElementChild === item) {
      item
        .closest(GROUP_SELECTOR)
        ?.querySelector(GROUP_HEADING_SELECTOR)
        ?.scrollIntoView({ block: 'nearest' })
    }

    item.scrollIntoView({ block: 'nearest' })
  }
}

function getSelectedItem() {
  return commandRef.value?.querySelector(SELECTED_ITEM_SELECTOR)
}

function getValidItems(rootNode: HTMLElement | undefined = commandRef.value) {
  const allItemEl = rootNode?.querySelectorAll(
    VALID_ITEM_SELECTOR,
  ) as NodeListOf<HTMLElement>
  return allItemEl ? Array.from(allItemEl) : []
}

function selectedFirstItem() {
  const [firstItem] = getValidItems()
  if (firstItem && firstItem.getAttribute(ITEM_KEY_SELECTOR))
    selectedNode.value = firstItem.getAttribute(ITEM_KEY_SELECTOR) || ''
}

function updateSelectedToIndex(index: number) {
  const items = getValidItems()
  const item = items[index]
  if (item)
    selectedNode.value = item.getAttribute(ITEM_KEY_SELECTOR) || ''
}

function updateSelectedByChange(change: 1 | -1) {
  const selected = getSelectedItem()
  const items = getValidItems()
  const index = items.findIndex(item => item === selected)

  const newSelected = items[index + change]
  if (newSelected) {
    selectedNode.value = newSelected.getAttribute(ITEM_KEY_SELECTOR) || ''
  }
  else {
    change > 0
      ? updateSelectedToIndex(0)
      : updateSelectedToIndex(items.length - 1)
  }
}

function updateSelectedToGroup(change: 1 | -1) {
  const selected = getSelectedItem()
  let group = selected?.closest(GROUP_SELECTOR)
  let item: HTMLElement | null | undefined = null

  while (group && !item) {
    group
      = change > 0
        ? findNextSibling(group, GROUP_SELECTOR)
        : findPreviousSibling(group, GROUP_SELECTOR)
    item = group?.querySelector(VALID_ITEM_SELECTOR)
  }

  if (item)
    selectedNode.value = item.getAttribute(ITEM_KEY_SELECTOR) || ''
  else
    updateSelectedByChange(change)
}

const first = () => updateSelectedToIndex(0)
const last = () => updateSelectedToIndex(getValidItems().length - 1)

function next(e: KeyboardEvent) {
  e.preventDefault()
  if (e.metaKey) {
    last()
  }
  else if (e.altKey) {
    updateSelectedToGroup(1)
  }
  else {
    updateSelectedByChange(1)
  }
}

function prev(e: KeyboardEvent) {
  e.preventDefault()
  if (e.metaKey) {
    first()
  }
  else if (e.altKey) {
    updateSelectedToGroup(-1)
  }
  else {
    updateSelectedByChange(-1)
  }
}

function handleKeyDown(e: KeyboardEvent) {
  switch (e.key) {
    case 'n':
    case 'j': {
      if (e.ctrlKey)
        next(e)
      break
    }
    case 'ArrowDown': {
      next(e)
      break
    }
    case 'p':
    case 'k': {
      if (e.ctrlKey)
        prev(e)
      break
    }
    case 'ArrowUp': {
      prev(e)
      break
    }
    case 'Home': {
      first()
      break
    }
    case 'End': {
      last()
      break
    }
    case 'Enter': {
      const item = getSelectedItem()
      if (item) {
        const event = new Event(SELECT_EVENT)
        item.dispatchEvent(event)
      }
    }
  }
}

function syncFilteredCount() {
  filtered.value.count = getValidItems().length
}

watch(
  () => selectedNode.value,
  (newVal) => {
    if (newVal)
      nextTick(scrollSelectedIntoView)
  },
  { deep: true },
)

watch(
  () => itemInfo.value,
  (item) => {
    emit('selectItem', item!)
  },
)

function rerenderMenuList(isRerender: boolean) {
  if (isRerender) {
    shouldRerender.value = isRerender
    nextTick(() => {
      syncFilteredCount()
      selectedFirstItem()
      shouldRerender.value = false
    })
  }
}

watch(
  () => rerenderList.value,
  (val) => {
    if (val)
      rerenderMenuList(val)
  },
)

onMounted(() => {
  syncFilteredCount()
  nextTick(selectedFirstItem)
})
</script>

<template>
  <div
    ref="commandRef"
    :class="theme"
    :command-theme="theme"
    @keydown="handleKeyDown"
  >
    <div command-root>
      <slot />
    </div>
  </div>
</template>
