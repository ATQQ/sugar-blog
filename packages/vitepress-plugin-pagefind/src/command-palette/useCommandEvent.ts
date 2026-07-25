import { ref } from 'vue'
import type { ItemInfo } from './types'

export interface Events {
  selectItem: ItemInfo
  rerenderList: boolean
}

// 与 useCommandState 一致，使用模块级共享状态，
// 确保 CommandRoot / CommandList / CommandItem 读写同一份事件源。
const itemInfo = ref<ItemInfo>()
const rerenderList = ref(false)

function useCommandEvent() {
  return {
    itemInfo,
    rerenderList,
  }
}

export { useCommandEvent }
