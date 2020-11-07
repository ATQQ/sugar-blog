<template>
  <details>
    <summary>
      <font color="#3eb07c">{{ title }}</font>
    </summary>
    <slot></slot>
  </details>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "点击查看输出结果",
    },
  },
};
</script>

<style>
</style>