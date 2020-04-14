<template>
  <span @click="handleShow">
    <slot></slot>
    <div
      :style="{
        visibility: show ? 'visible' : 'hidden',
        opacity: show ? '1' : '0',
      }"
      class="introduce"
      v-if="content || title"
    >
      <div class="title">{{ title }}</div>
      <section class="content" v-if="content">
        {{ content }}
      </section>
    </div>
  </span>
</template>

<script>
export default {
  props: {
    content: {
      default: '',
      type: String,
    },
    title: {
      default: '',
      type: String,
    },
  },
  data() {
    return {
      show: false,
      timer: null,
    };
  },
  methods: {
    handleShow() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      if (this.show) {
        this.show = false;
        return;
      }
      this.show = true;
      this.timer = setTimeout(() => {
        this.show = false;
      }, 1500);
    },
  },
};
</script>

<style scoped>
span {
  color: #3eaf7c;
  font-weight: bold;
  cursor: pointer;
  position: relative;
  padding: 0 4px;
}
span .introduce {
  transition: all 0.3s ease-in-out;
}
.introduce {
  width: 140px;
  max-height: 90px;
  position: absolute;
  font-weight: normal;
  background-color: #fff;
  border: 3px solid #3eaf7c;
  border-radius: 5px;
  left: -55px;
  z-index:1;
}

.introduce::before {
  content: ' ';
  display: block;
  position: absolute;
  border: 5px solid transparent;
  border-bottom-color: #3eaf7c;
  left: 50%;
  transform: translateX(-50%);
  top: -12px;
}
.introduce .title {
  text-align: center;
  font-size: 14px;
}
.introduce .content {
  padding: 5px;
  display: block;
  text-align: left;
  text-indent: 1em;
  color: #2c3e50;
  max-height: 55px;
  overflow-y: scroll;
  font-size: 12px;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}
.introduce .content::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
</style>
