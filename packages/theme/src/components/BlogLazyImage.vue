<script lang="ts" setup>
import { useData, useRoute } from 'vitepress'
import { computed, onMounted, ref, watch } from 'vue'
import { useBlogConfig } from '../composables/config/blog'

const routeData = useRoute()
const { frontmatter } = useData()
const { article } = useBlogConfig()
const openLazy = computed(() => {
  return (frontmatter.value.lazy || article?.lazy) ?? true
})
const imageList = ref<HTMLImageElement[]>([])
const currentObserver = ref<IntersectionObserver>()
const refresh = () => {
  if (openLazy.value) {
    const docDomContainer = window.document.querySelector('#VPContent')
    const imgs = docDomContainer?.querySelectorAll<HTMLImageElement>(
      '.content-container .main img'
    )
    // 销毁旧的
    imageList.value.forEach((v) => currentObserver.value?.unobserve(v))

    // 存新的
    imageList.value = Array.from(imgs as unknown as HTMLImageElement[])

    // 初始化
    imageList.value.forEach((img) => {
      const src = img.getAttribute('src')
      if (src) {
        img.removeAttribute('src')
        img.setAttribute('data-src', src)
      }
    })

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target
          const src = img.getAttribute('data-src')
          if (src) {
            img.setAttribute('src', src)
          }
          observer.unobserve(img)

          console.log('render', src)
        }
      })
    })

    // 监听
    imageList.value.forEach((img) => {
      observer.observe(img)
    })
  }
}
watch(routeData, () => {
  refresh()
})

onMounted(() => {
  refresh()
})
</script>
