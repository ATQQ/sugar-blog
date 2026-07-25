import { defineComponent, h } from 'vue'
import Root from './CommandRoot.vue'
import Dialog from './CommandDialog.vue'
import Group from './CommandGroup.vue'
import Input from './CommandInput.vue'
import Item from './CommandItem.vue'
import List from './CommandList.vue'
import { useCommandState } from './useCommandState'

const Empty = defineComponent({
  name: 'Command.Empty',
  setup(props, { attrs, slots }) {
    // Search.vue 已通过 v-if 与结果列表互斥挂载，这里直接渲染即可。
    // 不再依赖 filtered.count，避免列表同步滞后时出现空白。
    return () =>
      h(
        'div',
        {
          'command-empty': '',
          'role': 'presentation',
          ...attrs,
        },
        slots,
      )
  },
})

const Loading = defineComponent({
  name: 'Command.Loading',
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'div',
        {
          'command-loading': '',
          'role': 'progressbar',
          ...attrs,
        },
        slots,
      )
  },
})

const Separator = defineComponent({
  name: 'Command.Separator',
  setup(props, { attrs }) {
    return () =>
      h('div', {
        'command-separator': '',
        'role': 'separator',
        ...attrs,
      })
  },
})

const Command = Object.assign(Root, {
  Root,
  Dialog,
  Empty,
  Group,
  Input,
  Item,
  List,
  Loading,
  Separator,
}) as typeof Root & {
  readonly Root: typeof Root
  readonly Dialog: typeof Dialog
  readonly Empty: typeof Empty
  readonly Group: typeof Group
  readonly Input: typeof Input
  readonly Item: typeof Item
  readonly List: typeof List
  readonly Loading: typeof Loading
  readonly Separator: typeof Separator
}

export { Command, useCommandState }
export type {
  CommandGroupProps,
  CommandInputEmits,
  CommandInputProps,
  CommandItemEmits,
  CommandItemProps,
  CommandRootEmits,
  CommandRootProps,
} from './types'
