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
  data() {
    return {
      show: false
    };
  }
};
</script>

<style scoped>
h3 {
  display: inline-block;
  color: #3eaf7c;
  cursor: pointer;
  margin: 10px 0;
}
font {
  position: relative;
}
font::after {
    right: -25px;
    position: absolute;
    content: '♥';
    top: -1px;
    display: inline-block;
}
</style>
