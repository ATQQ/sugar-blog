<template>
  <SWUpdatePopup v-slot="{ enabled, reload, message, buttonText }">
    <div v-if="enabled" class="my-sw-update-popup">
      <div class="title">{{message}}</div>
      <div class="btnContainer">
        <a class="checkWhy" href="/_configDoc/show/sw.html"><button>为什么需要手动更新🤔</button></a>
        <hr>
        <button @click="reload">👉 {{ buttonText }} 👈</button>
        <div></div>
      </div>
    </div>
  </SWUpdatePopup>
</template>

<script>
import SWUpdatePopup from '@vuepress/plugin-pwa/lib/SWUpdatePopup.vue';

export default {
  components: { SWUpdatePopup },
};
</script>

<style>
.my-sw-update-popup {
  text-align: right;
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #fff;
  font-size: 20px;
  padding: 10px;
  background-color: #3eaf7c;
  border-radius: 5px;
}

.my-sw-update-popup .title {
  font-size: 1rem;
  text-align: center;
  color: #000;
  color: #fff;
}
.btnContainer {
  text-align: center;
  margin-top: 10px;
}
.btnContainer button {
  color: #fff;
  background: #3eaf7c;
  border: 1px solid #fff;
  padding: 5px 10px;
  border-radius: 4px;
}
.checkWhy button{
  color: #3eaf7c;
  background: #fff;
  border: 1px solid #3eaf7c;
}
</style>
