<template>
  <div class="comment">
    <div id="comments"></div>
    <span :id="pathname" class="leancloud_visitors" data-flag-title="Your Article Title">
      <em class="post-meta-item-text">浏览量：</em>
      <i class="leancloud-visitors-count"></i>
    </span>
  </div>
</template>

<script>
// Use import
import Valine from "valine";

export default {
  data() {
    return {
      pathname: window.location.pathname,
    };
  },
  mounted() {
    new Valine({
      el: "#comments",
      appId: "L3HgpT2JA3KJFUots3ql2AAd-gzGzoHsz",
      appKey: "cmU9sBLuIqYl5QLS1aCYIKzK",
      placeholder: "请在此处留下你的评论(支持markdown)",
      visitor: true,
      path: window.location.pathname,
      avatar: "monsterid",
    });
  },
};
</script>

<style>
</style>