<template>
  <div class="comment">
    <div id="comments"></div>
    <span
      id="pathname"
      class="leancloud_visitors"
      data-flag-title="Your Article Title"
    >
      <em class="post-meta-item-text">阅读量：</em>
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

<style scoped>
.comment {
  width: 100%;
  text-align: center;
  padding: 40px 0;
}
#comments {
  max-width: 840px;
  margin: 0 auto;
  padding: 0 20px;
}
</style>