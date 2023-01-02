<template>
  <div>
    <h1>
      <span class="name">{{ name }}</span>
      <span class="motto" v-show="motto">{{ motto }}</span>
    </h1>
    <div class="inspiring-wrapper">
      <h2 @click="changeSlogan" v-show="!!inspiring">{{ inspiring }}</h2>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import { useBlogConfig } from '../composables/config/blog'

const { site, frontmatter } = useData()

const name = computed(
  () => (frontmatter.value.blog?.name ?? site.value.title) || ''
)
const motto = computed(() => frontmatter.value.blog?.motto || '')
const inspiring = computed(() => frontmatter.value.blog?.inspiring || '')

const { home } = useBlogConfig()

const changeSlogan = async () => {
  // TODO: 自定义事件
  if (typeof home?.handleChangeSlogan !== 'function') {
    return
  }
  const newSlogan = await home.handleChangeSlogan()
  if (typeof newSlogan !== 'string' || !newSlogan.trim()) {
    return
  }
  inspiring.value = newSlogan
  setTimeout(async () => {
    inspiring.value = newSlogan
  })
}
</script>
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
  margin-top: 16px;
  height: 24px;
  width: auto;
}

h2 {
  animation: fade-in 0.5s ease-in-out;
  cursor: pointer;
  text-align: center;
  font-size: 20px;
}
</style>
