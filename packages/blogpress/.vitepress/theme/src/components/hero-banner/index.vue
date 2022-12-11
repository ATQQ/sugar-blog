<template>
  <div>
    <h1>
      <span class="author">粥里有勺糖</span
      ><span class="motto">你的指尖,拥有改变世界的力量</span>
    </h1>
    <div class="soul-wrapper">
      <h2 @click="changeSoul" v-show="!!soulSoup">{{ soulSoup }}</h2>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const soulSoup = ref('千万不要因为走得太久，而忘记了我们为什么出发')
const changeSoul = () => {
  soulSoup.value = ''
  setTimeout(() => {
    // TODO: 接口抓数据
    soulSoup.value = Math.random()
  })
}
</script>
<style lang="scss" scoped>
h1 {
  text-align: center;
  .author {
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

.soul-wrapper {
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
