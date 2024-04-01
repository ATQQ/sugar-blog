<script setup lang="ts">
import { computed, h, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useElementSize, useElementVisibility, useWindowSize } from '@vueuse/core'
import { useData, useRouter } from 'vitepress'
import Artalk from 'artalk'

// import 'artalk/dist/Artalk.css'
import { ElIcon } from 'element-plus'
import { Comment } from '@element-plus/icons-vue'
import { useBlogConfig } from '../composables/config/blog'
import type { Theme } from '../composables/config/index'

// const el = ref<HTMLElement | null>(null)
const el = ref(null)

const router = useRouter()
const page = useData().page

let artalk: Artalk

const { comment: _comment } = useBlogConfig()
const commentConfig = computed(() =>
  _comment === false ? undefined : _comment
)
const artalkConfig = computed(() => commentConfig.value ? (commentConfig.value as Theme.ArtalkConfig) : undefined)

const commentIsVisible = useElementVisibility(el)

function handleScrollToComment() {
  document.querySelector('#artalk-comment')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

onMounted(() => {
  nextTick(() => {
    if (artalkConfig.value) {
      initArtalk(getConfByPage())
    }
  })
})

watch(() => router.route.path, () => {
  nextTick(() => {
    artalk.update(getConfByPage())
    artalk.reload()
  })
})

onUnmounted(() => {
  artalk.destroy()
})

function initArtalk(conf: any) {
  artalk = Artalk.init({
    el: el.value,
    emoticons: '/assets/emoticons/default.json',
    gravatar: {
      mirror: 'https://cravatar.cn/avatar/'
    },
    ...conf
  })

  loadExtraFuncs()
}

function getConfByPage() {
  return {
    pageKey: router.route.path,
    pageTitle: page.value.title,
    server: artalkConfig.value?.options.server,
    site: artalkConfig.value?.options.site,
  }
}

function loadExtraFuncs() {
  // // 图片灯箱插件
  // artalk.on('list-loaded', () => {
  //   document.querySelectorAll('.atk-comment .atk-content').forEach(($content) => {
  //     const imgEls = $content.querySelectorAll<HTMLImageElement>('img:not([atk-emoticon]):not([atk-lightbox])')
  //     imgEls.forEach((imgEl) => {
  //       imgEl.setAttribute('atk-lightbox', '')
  //       const linkEl = document.createElement('a')
  //       linkEl.setAttribute('class', 'atk-img-link')
  //       linkEl.setAttribute('href', imgEl.src)
  //       linkEl.setAttribute('data-src', imgEl.src)
  //       linkEl.append(imgEl.cloneNode())
  //       imgEl.replaceWith(linkEl)
  //     })
  //     // @ts-expect-error
  //     if (imgEls.length)
  //       lightGallery($content, { selector: '.atk-img-link' })
  //   })
  // })

  // 夜间模式
  const HTMLElement = document.querySelector('html')
  if (HTMLElement) {
    const darkMode = HTMLElement.classList.contains('dark')
    artalk.setDarkMode(darkMode)

    new MutationObserver((mList) => {
      mList.forEach((m) => {
        if (m.attributeName !== 'class')
          return

        // @ts-expect-error
        const darkMode = m.target.classList.contains('dark')
        artalk.setDarkMode(darkMode)
      })
    }).observe(HTMLElement, { attributes: true })
  }
}

const { width } = useWindowSize()
const mobileMinify = computed(() => width.value < 768 && (commentConfig.value?.mobileMinify ?? true))

const CommentIcon = commentConfig.value?.icon
  ? h('i', {
    onVnodeMounted(vnode) {
      if (vnode.el) {
        vnode.el.outerHTML = commentConfig.value?.icon
      }
    },
  })
  : h(Comment)

const $vpDoc = document.querySelector('.vp-doc')
const e = ref<any>($vpDoc)
const { width: _docWidth } = useElementSize(e)
const docWidth = computed(() => `${_docWidth.value}px`)

const labelText = computed(() => {
  return commentConfig.value?.label ?? '评论'
})
</script>

<template>
  <div
    v-if="artalkConfig && artalkConfig.type === 'artalk' && docWidth" id="artalk-comment" ref="el"
    style="margin-top: 20px;"
  />
  <div v-show="!commentIsVisible" class="comment-btn-wrapper">
    <span v-if="!mobileMinify && labelText" class="icon-wrapper-text" @click="handleScrollToComment">
      <ElIcon :size="20">
        <CommentIcon />
      </ElIcon>
      <span class="text">
        {{ labelText }}
      </span>
    </span>
    <span v-else class="icon-wrapper" @click="handleScrollToComment">
      <ElIcon :size="20">
        <CommentIcon />
      </ElIcon>
    </span>
  </div>
</template>

<style scoped lang="scss">
.comment-btn-wrapper {
  position: fixed;
  width: v-bind(docWidth);
  text-align: right;
  bottom: 40px;
  font-size: 16px;
  transition: all 0.3s ease-in-out;
  opacity: 0.6;
  display: flex;
  justify-content: right;
  z-index: 200;

  &:hover {
    opacity: 1;
  }

  .icon-wrapper,
  .icon-wrapper-text {
    cursor: pointer;
    border-radius: 50%;
    position: relative;
    right: -80px;
    background-color: var(--vp-c-bg);
    box-shadow: var(--box-shadow);
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--vp-c-brand-soft);
    color: var(--vp-c-brand-1);

    &:hover {
      box-shadow: var(--box-shadow-hover);
    }
  }

  .icon-wrapper-text {
    border-radius: 2px;
    padding: 2px 6px;

    span.text {
      font-size: 12px;
      margin-left: 4px;
    }
  }
}

@media screen and (max-width: 1200px) {
  .comment-btn-wrapper {

    .icon-wrapper,
    .icon-wrapper-text {
      position: static;
    }
  }
}

:root {
  --vp-c-brand: #558fb5;
  --vp-c-brand-light: #498cb8;
  --vp-c-brand-lighter: #549ccc;
  --vp-c-brand-dark: #366482;
  --vp-c-brand-darker: #244f6b;
  --vp-code-block-bg: #f6f8fa;
  --vp-c-divider: #dfe2e5;

  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: linear-gradient(90deg, #0083ff, #37dfd9);
}

.dark {
  --vp-c-bg: #22272e;
  --vp-c-bg-alt: #22272e;
  --vp-code-block-bg: #2b313a;
  --vp-c-text-2: #8094a8;
  --vp-button-alt-bg: #1e2224;
  --vp-button-alt-border: #2d3235;
  --vp-c-bg-soft: #1e2224;
  --vp-c-divider-light: #2d3235;
  --vp-c-divider: #34404c;
  --vp-c-black: #22272e;
  --vp-c-bg-soft: #2b313a;
}

.VPHome .clip {
  font-weight: 500;
  font-size: 1.5em;
  margin-bottom: 0.5em;
  display: inline-block;
}

.VPHome .VPButton.brand {
  border-color: #0083ff;
  color: #fff;
  background-color: #0083ff;

  &:hover {
    border-color: #007CF0;
    color: #fff;
    background-color: #007CF0;
  }
}

/** 一起摇摆 **/
.wave {
  display: inline-block;
  transform-origin: center bottom;
  animation: upAnimation 2.33s ease .8s 3 both;
}

@keyframes upAnimation {
  0% {
    transform: rotate(0deg);
    transition-timing-function: cubic-bezier(0.215, .61, .355, 1);
  }

  10% {
    transform: rotate(-12deg);
    transition-timing-function: cubic-bezier(0.215, .61, .355, 1);
  }

  20% {
    transform: rotate(12deg);
    transition-timing-function: cubic-bezier(0.215, .61, .355, 1);
  }

  28% {
    transform: rotate(-10deg);
    transition-timing-function: cubic-bezier(0.215, .61, .355, 1);
  }

  36% {
    transform: rotate(10deg);
    transition-timing-function: cubic-bezier(0.755, .5, .855, .06);
  }

  42% {
    transform: rotate(-8deg);
    transition-timing-function: cubic-bezier(0.755, .5, .855, .06);
  }

  48% {
    transform: rotate(8deg);
    transition-timing-function: cubic-bezier(0.755, .5, .855, .06);
  }

  52% {
    transform: rotate(-4deg);
    transition-timing-function: cubic-bezier(0.755, .5, .855, .06);
  }

  56% {
    transform: rotate(4deg);
    transition-timing-function: cubic-bezier(0.755, .5, .855, .06);
  }

  60% {
    transform: rotate(0deg);
    transition-timing-function: cubic-bezier(0.755, .5, .855, .06);
  }

  100% {
    transform: rotate(0deg);
    transition-timing-function: cubic-bezier(0.215, .61, .355, 1);
  }
}

.vp-doc>div>img {
  max-width: 100%;
  margin: 1.5em auto;
}

img[atk-emoticon] {
  display: initial;
}

/* 由于 body 未添加一致的 transition，导致其他地方暗黑模式切换加 transition 比较怪 */
.vp-doc div[class*='language-'] {
  transition: none;
}

.vp-doc :not(pre)>code {
  transition: none;
}

.vp-doc {
  table {
    border-collapse: collapse;
    margin: 1rem 0;
    display: block;
    overflow-x: auto
  }

  td,
  th {
    padding: .6em 1em;
  }
}

/* 侧边栏 */
.VPSidebar::-webkit-scrollbar {
  width: 7px
}

.VPSidebar::-webkit-scrollbar-track {
  background-color: transparent
}

.VPSidebar::-webkit-scrollbar-thumb {
  background-color: var(--vp-c-divider)
}

/*details block patch*/
.custom-block.details>summary {
  cursor: pointer;
}

.vp-code-group .tabs>* {
  color: var(--vp-c-text-1) !important;
}

.vp-code-group .tabs::after {
  background-color: var(--vp-c-divider)
}
</style>
