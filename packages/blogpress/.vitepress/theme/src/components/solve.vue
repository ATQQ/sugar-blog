<script>
export default {
  name: 'Solve',
  props: {
    ok: {
      default: false,
      type: Boolean
    }
  }
}
</script>

<template>
  <p class="solve">
    <i v-if="ok" class="ok">✅</i>
    <i v-else class="wait">❌</i>
    <slot />
  </p>
</template>

<style scoped lang="scss">
.solve {
  margin: 0 0;
  display: flex;
  align-items: center;
  :deep(p) {
    margin: 0 0;
  }
}
.ok {
  color: #3eaf7c;
  font-weight: bold;
}
.wait {
  color: #2c3e50;
}
.ok,
.wait {
  padding-right: 1em;
}
</style>
