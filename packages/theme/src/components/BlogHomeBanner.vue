<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useData } from 'vitepress'
import { useHomeConfig } from '../composables/config/blog'

const { site, frontmatter } = useData()
const home = useHomeConfig()

const name = computed(
  () => (frontmatter.value.blog?.name ?? site.value.title) || home?.value?.name || ''
)
const motto = computed(() => frontmatter.value.blog?.motto || home?.value?.motto || '')

const inspiring = ref('')
const inspiringList = computed<string[]>(() => {
  return [
    ...new Set(
      [frontmatter.value.blog?.inspiring, home?.value?.inspiring]
        .flat()
        .filter(v => !!v)
    )
  ]
})
const inspiringIndex = ref<number>(-1)
const inspiringTimeout = computed<number>(
  () => frontmatter.value.blog?.inspiringTimeout || home?.value?.inspiringTimeout || 0
)

watch(inspiringTimeout, () => {
  startTimer()
})
const timer = ref<any>(0)
function startTimer() {
  if (timer.value) {
    clearTimeout(timer.value)
  }
  if (inspiringTimeout.value > 0) {
    timer.value = setTimeout(() => {
      changeSlogan()
    }, inspiringTimeout.value)
  }
}
onMounted(() => {
  changeSlogan()
})

onUnmounted(() => {
  if (timer.value) {
    clearTimeout(timer.value)
  }
})

// TODO：SSR 支持
async function changeSlogan() {
  // 顺手启动定时器
  startTimer()

  if (inspiringList.value.length < 1)
    return

  inspiringIndex.value = (inspiringIndex.value + 1) % inspiringList.value.length
  const newValue = inspiringList.value[inspiringIndex.value]
  if (newValue === inspiring.value)
    return

  // 重新渲染数据，同时触发动画
  inspiring.value = ''
  setTimeout(() => {
    inspiring.value = newValue
  }, 100)
}
</script>

<template>
  <div>
    <h1>
      <span class="name">{{ name }}</span>
      <span v-show="motto" class="motto">{{ motto }}</span>
    </h1>
    <div class="inspiring-wrapper">
      <h2 v-show="!!inspiring" @click="changeSlogan">
        {{ inspiring }}
      </h2>
    </div>
  </div>
</template>

<style lang="scss" scoped>
h1 {
  text-align: center;
  .name {
    transition: all 0.25s ease-in-out 0.04s;
    transform: translateY(0px);
    opacity: 1;
    font-weight: bold;
    margin: 0 auto;
    font-size: 36px;
  }

  .motto {
    position: relative;
    bottom: 0px;
    font-size: 14px;
    margin-left: 10px;

    &::before {
      content: '- ';
    }
  }
}

@media screen and (max-width: 500px) {
  .motto {
    display: none;
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.inspiring-wrapper {
  margin: 16px 0;
  height: 32px;
  width: auto;

  h2 {
    animation: fade-in 0.5s ease-in-out;
    cursor: pointer;
    text-align: center;
    font-size: 20px;
    line-height: 1.6;
  }
}
</style>
