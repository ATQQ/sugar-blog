<template>
  <div class="comment">
    <div id="comments"></div>
    <span id="pathname" class="leancloud_visitors" data-flag-title="Your Article Title">
      <em class="post-meta-item-text">浏览量：</em>
      <i class="leancloud-visitors-count"></i>
    </span>
  </div>
</template>

<script>
export default {
  name: "comment",
  mounted() {
    import("./../comment").then((res) => {
      res.default.init();
    });
  },
};
</script>

<style>
</style>