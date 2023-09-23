<script setup lang="ts">
import { ElButton } from 'element-plus'

const props = defineProps<{
  href: string
  text?: string
}>()
</script>

<template>
  <p class="action">
    <a :href="href"><ElButton type="success" round size="large">戳我 {{ text }}</ElButton></a>
  </p>
</template>

<style scoped>
.action {
  margin: 1.8rem auto;
  text-align: center;
}

.nav-link {
  display: inline-block;
  font-size: 1.2rem;
  color: #fff;
  background-color: #3eaf7c;
  padding: 0.3rem 2rem;
  border-radius: 4px;
  transition: background-color 0.1s ease;
  box-sizing: border-box;
  border-bottom: 1px solid #389d70;
}
</style>
