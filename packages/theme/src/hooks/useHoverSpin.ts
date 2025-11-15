import { type Ref, onMounted, onUnmounted } from 'vue'
import type { Theme } from '../composables/config/index'

/**
 * 元素悬停旋转
 * @param elRef 元素引用
 * @param accel 加速度
 * @param maxVel 最大角速度
 * @param decelDuration 缓停时长
 */
export function useHoverSpin(elRef: Ref<HTMLElement | null>, hoverSpinConfig?: Theme.HoverSpinConfig | boolean) {
  const { accel = 180, maxVel = 2160, decelDuration = 1500 } = hoverSpinConfig === true ? {} : hoverSpinConfig || {}
  let rafId = 0
  let lastTs = 0
  let rotation = 0
  let velocity = 0
  let decelStart = 0
  let decelStartRotation = 0
  let decelTargetRotation = 0
  let decelBias = 0
  let isDecel = false
  let hovering = false

  function animate(ts: number) {
    if (!lastTs)
      lastTs = ts
    const dt = (ts - lastTs) / 1000
    lastTs = ts

    if (hovering) {
      isDecel = false
      decelStart = 0
      velocity = Math.min(velocity + accel * dt, maxVel)
      rotation += velocity * dt
    }
    else if (isDecel) {
      const t = Math.min((ts - decelStart) / decelDuration, 1)
      const durSec = decelDuration / 1000
      const base = velocity * durSec * (t - t * t / 2)
      const smooth = 3 * t * t - 2 * t * t * t
      rotation = decelStartRotation + base + decelBias * smooth
      if (t >= 1) {
        decelTargetRotation = 0
        decelStartRotation = 0
        decelBias = 0
        rotation = decelTargetRotation
        velocity = 0
        isDecel = false
        if (rafId) {
          cancelAnimationFrame(rafId)
          rafId = 0
        }
        const el2 = elRef.value as HTMLElement | null
        if (el2)
          el2.style.transform = `rotate(${rotation}deg)`
        return
      }
    }

    const el = elRef.value as HTMLElement | null
    if (el)
      el.style.transform = `rotate(${rotation}deg)`
    if (hovering || isDecel) {
      rafId = requestAnimationFrame(animate)
    }
    else if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = 0
    }
  }

  function onEnter() {
    hovering = true
    if (!rafId) {
      lastTs = 0
      rafId = requestAnimationFrame(animate)
    }
  }

  function onLeave() {
    hovering = false
    isDecel = true
    decelStart = performance.now()
    decelStartRotation = rotation
    const durSec = decelDuration / 1000
    const S = velocity * durSec / 2
    const minTarget = decelStartRotation + S
    decelTargetRotation = Math.ceil(minTarget / 360) * 360
    decelBias = (decelTargetRotation - decelStartRotation) - S
    lastTs = 0
  }

  onMounted(() => {
    if (hoverSpinConfig === false)
      return
    const el = elRef.value
    if (!el)
      return
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
  })

  onUnmounted(() => {
    if (hoverSpinConfig === false)
      return
    const el = elRef.value
    if (el) {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
    }
    if (rafId)
      cancelAnimationFrame(rafId)
  })
}
