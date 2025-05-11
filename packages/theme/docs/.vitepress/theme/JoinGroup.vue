<script setup>
const props = defineProps({
  showImg: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="join-group" data-pagefind-ignore="all">
    <template v-if="!showImg">
      <details>
        <summary>🎉 <span>欢迎加入主题交流群，查看二维码</span></summary>
        <div class="scan-card-list">
          <div class="scan-card">
            <img src="https://img.cdn.sugarat.top/mdImg/MTY5NTA0NTAzMjAzMQ==695045032031" alt="QQ交流群">
            <span>
              QQ交流群
            </span>
            <a href="https://qm.qq.com/q/rqMyNvGyvS" target="_blank" rel="noopener noreferrer">681489336</a>
          </div>
          <div class="scan-card">
            <img src="https://image-uploader.sugarat.top/images/sugar/theme.png" alt="微信群">
            <span>微信交流群</span>
            <br>
          </div>
        </div>
        <p>如扫码无法加入，可加好友备注“主题”</p>
      </details>
    </template>
    <template v-else>
      <p>
        🎉 欢迎扫码加入主题交流群
      </p>
      <div v-if="showImg" class="scan-card-list">
        <div class="scan-card">
          <img src="https://img.cdn.sugarat.top/mdImg/MTY5NTA0NTAzMjAzMQ==695045032031" alt="QQ交流群">
          <span>
            QQ交流群
          </span>
          <a href="https://qm.qq.com/q/rqMyNvGyvS" target="_blank" rel="noopener noreferrer">681489336</a>
        </div>
        <div class="scan-card">
          <img src="https://image-uploader.sugarat.top/images/sugar/theme.png" alt="微信群">
          <span>微信交流群</span>
          <br>
        </div>
      </div>
      <p>如扫码无法加入，可加好友备注“主题”</p>
    </template>
  </div>
</template>

<style scoped lang="scss">
.join-group {
  text-align: center;

  img {
    max-width: 200px;
    display: inline-block;
    cursor: pointer;
  }

  p {
    padding: 16px 0;
  }

  a,summary>span {
    background: linear-gradient(90deg, #58e3f5, #dabcfc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    padding-bottom: 4px;
    border-bottom: 1px dashed #58e3f5;
    font-weight: bolder;
  }
}
.scan-card-list {
  display: flex;
  align-items: center;
  justify-content: center;
  .scan-card{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 16px;
    img {
      height: 200px;
      border-radius: 8px;
    }
    span {
      margin-top: 8px;
      font-size: 16px;
      font-weight: bold;
    }
  }
}
details,summary{
  padding-bottom: 10px;
}
</style>
