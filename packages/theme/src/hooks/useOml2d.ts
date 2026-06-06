import { onBeforeUnmount, onMounted } from 'vue'
import type { ModelOptions, Widget, WidgetOptions } from 'l2d-widget'
import { useOml2dOptions } from '../composables/config/blog'

type LegacyModelOptions = ModelOptions & {
  position?: [number, number]
}

type Oml2dOptions = Omit<WidgetOptions, 'model'> & {
  model?: WidgetOptions['model']
  models?: LegacyModelOptions[]
  mobileDisplay?: boolean
  tips?: unknown
}

const defaultOptions: Partial<WidgetOptions> = {
  size: { width: 200, height: 280 },
}

function warnLegacyOptions(options: Oml2dOptions) {
  if (options.models) {
    console.warn('[sugarat-theme] oml2d.models 已废弃，请改用 l2d-widget 的 oml2d.model 配置。当前版本会自动兼容转换，更多配置请查看 https://github.com/hacxy/l2d-widget')
  }

  if (options.tips) {
    console.warn('[sugarat-theme] oml2d.tips 是 oh-my-live2d 的旧配置，l2d-widget 仅支持在 model.tips 中配置提示气泡。更多配置请查看 https://github.com/hacxy/l2d-widget')
  }
}

function normalizeModel(model: LegacyModelOptions): ModelOptions {
  return {
    ...model,
    offset: model.offset,
    tips: model.tips && {
      ...model.tips,
      style: {
        top: '-50px',
        fontSize: '14px',
        padding: '10px',
        width: '200px',
        ...model.tips.style
      }
    }
  }
}

function normalizeOptions(options: Oml2dOptions): WidgetOptions | undefined {
  const { models, mobileDisplay, ...widgetOptions } = options

  warnLegacyOptions(options)

  if (mobileDisplay === false && window.matchMedia('(max-width: 768px)').matches) {
    return
  }

  const model = widgetOptions.model ?? models
  if (!model) {
    return
  }

  return {
    ...defaultOptions,
    ...widgetOptions,
    model: Array.isArray(model)
      ? model.map(normalizeModel)
      : normalizeModel(model as LegacyModelOptions)
  }
}

export function useOml2d() {
  const oml2dOptions = useOml2dOptions()
  let widget: Widget | undefined

  const init = async () => {
    if (!oml2dOptions.value || widget) {
      return
    }

    const options = normalizeOptions(oml2dOptions.value as Oml2dOptions)
    if (options) {
      const { createWidget } = await import('l2d-widget')
      widget = createWidget(options)
    }
  }

  onMounted(() => {
    init()
  })

  onBeforeUnmount(() => {
    widget?.destroy()
  })
}
