<template>
  <div class="codepen-iframe">
    <p>
      codepen示例：
      <a :href="href" target="_blank">源地址</a>
    </p>
    <iframe
      height="265"
      style="width: 100%;"
      scrolling="no"
      :title="title"
      :src="src"
      frameborder="no"
      loading="lazy"
      allowtransparency="true"
      allowfullscreen="true"
    >
      See the Pen
      <a href="https://codepen.io/sugarInSoup/pen/poydMpe">fake-element</a> by sugar
      (
      <a href="https://codepen.io/sugarInSoup">@sugarInSoup</a>) on
      <a href="https://codepen.io">CodePen</a>.
    </iframe>
  </div>
</template>

<script>
export default {
  name: "codepen",
  props: {
    src: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "demo",
    },
  },
  data() {
    return {
      href: "",
    };
  },
  mounted() {
    this.href = this.src.replace("embed", "pen");
  },
};
</script>