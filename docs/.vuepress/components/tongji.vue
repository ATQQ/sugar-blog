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
  font-size: 12px;
}
.hidden-tj {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
}
.home-tj {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -100px;
}
</style>
