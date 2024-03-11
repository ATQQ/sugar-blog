import { onMounted } from 'vue'
import { useOml2dOptions } from '../composables/config/blog'

export function useOml2d() {
  const oml2dOptions = useOml2dOptions()
  onMounted(async () => {
    if (oml2dOptions) {
      const { loadOml2d } = await import('oh-my-live2d')
      loadOml2d(oml2dOptions)
    }
  })
}
