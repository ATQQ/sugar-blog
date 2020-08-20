<template>
  <div ref="tj" class="tj"></div>
</template>
<script>
export default {
  mounted() {
    const tj = this.$refs.tj;
    const span = document.createElement('span');
    span.id = 'cnzz_stat_icon_1279199338';
    const script = document.createElement('script');
    script.src =
      'https://v1.cnzz.com/z_stat.php?id=1279199338&online=1&show=line';
      script.type = 'text/javascript'
    tj.append(span);
    tj.append(script);
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
</style>
