<script setup>
import { useData, withBase } from 'vitepress'
import { computed, onUnmounted, ref } from 'vue'
import { useGlobalAuthor, useHomeConfig } from '../composables/config/blog'

const home = useHomeConfig()
const { frontmatter, site } = useData()
const globalAuthor = useGlobalAuthor()
const author = computed(() =>
  frontmatter.value.author
  ?? frontmatter.value?.blog?.author
  ?? home?.value?.author
  ?? globalAuthor?.value
)
const logo = computed(() =>
  frontmatter.value?.logo
  ?? frontmatter.value?.blog?.logo
  ?? home?.value?.logo
  ?? site.value?.themeConfig?.logo
  ?? '/logo.png'
)
const show = computed(() => author.value || logo.value)

const imgRef = ref(null)
let rotation = 0
let velocity = 0
let isHovering = false
let animationFrameId = null
const startTime = 0

const maxVelocity = 10000 // 最大速度（度/帧）
const acceleration = 0.01 // 加速度
const deceleration = 0.999 // 减速系数

function animate() {
  if (isHovering) {
    // 加速
    velocity = Math.min(velocity + acceleration, maxVelocity)
    rotation += velocity
  }
  else {
    // 减速并回到初始位置
    velocity *= deceleration
    const normalizedRotation = rotation % 360
    // 计算回到0度的最短路径
    let targetRotation = 0
    if (normalizedRotation > 180) {
      targetRotation = 360
    }
    // 插值回到目标位置
    const diff = targetRotation - normalizedRotation
    rotation += velocity + diff * 0.02

    // 当速度非常小且接近目标位置时停止动画
    if (Math.abs(velocity) < 0.01 && Math.abs(rotation % 360) < 0.5) {
      velocity = 0
      rotation = 0
      if (imgRef.value) {
        imgRef.value.style.transform = 'rotate(0deg)'
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
      }
      return
    }
  }
  if (imgRef.value) {
    imgRef.value.style.transform = `rotate(${rotation}deg)`
  }
  animationFrameId = requestAnimationFrame(animate)
}

function onMouseEnter() {
  isHovering = true
  if (!animationFrameId) {
    animationFrameId = requestAnimationFrame(animate)
  }
}
function onMouseLeave() {
  isHovering = false
}
onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<template>
  <div v-if="show" class="blog-author">
    <img
      v-if="logo"
      ref="imgRef"
      :src="withBase(logo)"
      alt="avatar"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    >
    <p v-if="author">
      {{ author }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.blog-author {
  margin-bottom: 20px;

  img {
    display: block;
    margin: 10px auto;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: rgba(var(--bg-gradient-home));
    cursor: pointer;
  }

  p {
    text-align: center;
  }
}
</style>
