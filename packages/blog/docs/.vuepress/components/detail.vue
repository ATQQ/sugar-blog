<template>
  <div>
    <font @click="show = !show"><slot name="title"></slot></font>
    <div v-show="show">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name:'detail',
  data() {
    return {
      show: false
    };
  }
};
</script>

<style scoped>
font {
  position: relative;
  color: #3eaf7c;
}
</style>
