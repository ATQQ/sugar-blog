<template>
  <div class="comment" id="valine-comment">
    <component
      :is="'script'"
      src="https://giscus.app/client.js"
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
      async
    >
    </component>
  </div>
</template>
<script setup></script>
<style scoped>
.comment {
  width: 100%;
  text-align: center;
  padding: 40px 0;
}
</style>
