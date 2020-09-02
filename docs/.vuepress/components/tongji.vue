<template>
  <div ref="tj" class="tj" :class="hidden?'hidden-tj':''"></div>
</template>
<script>
export default {
  data() {
    return {
      hidden: false,
    };
  },
  mounted() {
    const tj = this.$refs.tj;
    const span = document.createElement("span");
    span.id = "cnzz_stat_icon_1279199338";
    const script = document.createElement("script");
    script.src =
      "https://v1.cnzz.com/z_stat.php?id=1279199338&online=1&show=line";
    script.type = "text/javascript";
    tj.append(span);
    tj.append(script);

    // 非README不展示
    this.hidden = !window.location.pathname.endsWith("/");
  },
};
</script>
<style lang="css">
#cnzz_stat_icon_1279199338 {
  padding: 1rem 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.hidden-tj {
  position: absolute;
  z-index: -1;
}
</style>
