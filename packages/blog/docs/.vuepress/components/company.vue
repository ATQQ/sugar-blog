<template>
  <div class="company">
    公司：
    <span>{{value.replace(/,/g,'，')}}</span>
  </div>
</template>

<script>
export default {
  name: "company",
  props: {
    value: {
      default: "",
      type: String,
      required: true
    }
  }
};
</script>

<style scoped>
.company {
  margin: 0 0;
  font-weight: bold;
}
span {
  color: #3eaf7c;
}
</style>
