<template>
  <div class="leetcode">
    leetcode：<slot></slot
    ><a :href="href" target="_blank"
      >题链</a
    >
  </div>
</template>

<script>
export default {
  name: 'LeetCode',
  props: {
    href: {
      default: '',
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.leetcode {
  margin: 0 0;
  font-weight: bold;
}
a {
  color: #3eaf7c;
}
</style>
