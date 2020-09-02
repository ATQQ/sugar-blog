<template>
  <div id="comments"></div>
</template>

<script>
// Use import
import Valine from "valine";

export default {
  mounted() {
    new Valine({
      el: "#comments",
      appId: "L3HgpT2JA3KJFUots3ql2AAd-gzGzoHsz",
      appKey: "cmU9sBLuIqYl5QLS1aCYIKzK",
    });
  },
};
</script>

<style>
</style>