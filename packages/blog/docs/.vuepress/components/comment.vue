<template>
  <div class="comment" id="valine-comment">
    <!-- <div id="comments"></div>
    <span
      id="pathname"
      class="leancloud_visitors"
      flag-title="Your Article Title"
    >
      <em class="post-meta-item-text"
        >阅读量：</em
      >
      <i
        class="leancloud-visitors-count"
      ></i>
    </span>-->
    <script src="https://giscus.app/client.js"
        data-repo="ATQQ/sugar-blog"
        data-repo-id="MDEwOlJlcG9zaXRvcnkyNDEyNDUyOTk="
        data-category="Announcements"
        data-category-id="DIC_kwDODmEcc84COVc6"
        data-mapping="pathname"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="top"
        data-theme="light"
        data-lang="zh-CN"
        crossorigin="anonymous"
        async>
</script>


  </div>
</template>

<script>
export default {
  name: 'comment',
  mounted() {
    // import('./../comment').then(
    //   (res) => {
    //     res.default.init();
    //   }
    // );
  },
};
</script>

<style scoped>
.comment {
  width: 100%;
  text-align: center;
  padding: 40px 0;
}
</style>

<style>
#comments {
  max-width: 840px;
  margin: 0 auto;
  padding: 0 20px;
}
</style>
