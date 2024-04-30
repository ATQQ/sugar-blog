import { onMounted } from 'vue'
import type { Options } from 'oh-my-live2d'
import { useOml2dOptions } from '../composables/config/blog'

const defaultModelOptions: any = {
  scale: 0.08,
  position: [-30, 0],
  stageStyle: {
    width: 220
  },
  mobilePosition: [-10, 0],
  mobileScale: 0.05,
  mobileStageStyle: {
    width: 150
  },
}
const defaultOptions: Options = {
  tips: {
    copyTips: {
      duration: 2000,
      message: ['复制成功，感谢您的支持！'],
    },
    style: {
      top: '-50px',
      fontSize: '14px',
      padding: '10px',
      width: '200px'
    },
    mobileStyle: {
      top: '-80px',
      left: '80px',
      fontSize: '14px',
      padding: '4px 10px',
      width: '110px'
    }
  }
}
export function useOml2d() {
  const oml2dOptions = useOml2dOptions()
  onMounted(async () => {
    if (oml2dOptions) {
      const { loadOml2d } = await import('oh-my-live2d')
      loadOml2d({
        ...defaultOptions,
        ...oml2dOptions,
        models: oml2dOptions?.models?.map(model => ({
          ...defaultModelOptions,
          ...model,
          stageStyle: {
            ...defaultModelOptions.stageStyle,
            ...model.stageStyle
          },
          mobileStageStyle: {
            ...defaultModelOptions.mobileStageStyle,
            ...model.mobileStageStyle
          }
        })),
        tips: {
          ...defaultOptions.tips,
          ...oml2dOptions.tips,
          style: {
            // @ts-expect-error
            ...defaultOptions?.tips?.style,
            // @ts-expect-error
            ...oml2dOptions?.tips?.style
          },
          mobileStyle: {
            // @ts-expect-error
            ...defaultOptions?.tips?.mobileStyle,
            // @ts-expect-error
            ...oml2dOptions?.tips?.mobileStyle
          },
          copyTips: {
            // @ts-expect-error
            ...defaultOptions?.tips?.copyTips,
            // @ts-expect-error
            ...oml2dOptions?.tips?.copyTips
          }
        }
      })
    }
  })
}
