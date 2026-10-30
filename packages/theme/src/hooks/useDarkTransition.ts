import { useData } from 'vitepress'
import { nextTick, provide } from 'vue'
import { useDarkTransitionConfig } from '../composables/config/blog'

export function useDarkTransition() {
  const { isDark } = useData()

  const isOpenDarkTransition = useDarkTransitionConfig()

  if (!isOpenDarkTransition) {
    return
  }
  const enableTransitions = () =>
    'startViewTransition' in document
      && window.matchMedia('(prefers-reduced-motion: no-preference)').matches

  provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
    if (!enableTransitions()) {
      isDark.value = !isDark.value
      return
    }

    const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${Math.hypot(
          Math.max(x, innerWidth - x),
          Math.max(y, innerHeight - y)
        )}px at ${x}px ${y}px)`
    ]

    const transition = document.startViewTransition(async () => {
      isDark.value = !isDark.value
      await nextTick()
    })

    await transition.ready

    const anim = document.documentElement.animate(
      { clipPath: isDark.value ? clipPath.reverse() : clipPath },
      {
        duration: 300,
        easing: 'ease-in',
        // 用 forwards 而不是 both：both 会在动画开始前就应用终态，
        // 会让深→浅时新快照瞬间铺满，闪一下白
        fill: 'forwards',
        pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`
      }
    )

    // 不清掉这条动画，它的 forwards 终态会作用到下一次切换的伪元素上
    // （浅→深结束的 circle(0) 会一直裁住深→浅的旧快照），
    // 先等快照移除再清理，避免旧快照重新铺满造成闪白
    transition.finished.finally(() => anim.cancel())
  })
}
