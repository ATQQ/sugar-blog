<template>
  <details>
    <summary>
      <mark
        ><font color="darkred">{{ title }}</font></mark
      >
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