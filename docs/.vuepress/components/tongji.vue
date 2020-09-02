<template>
  <div id="cnzz" class="tj"></div>
</template>
<script>
export default {
  mounted() {
    import("./../tongji").then((res) => {
      res.default.init();
    });
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
