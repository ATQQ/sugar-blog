<template>
    <div class="join-group">
        <p>🎉 欢迎加群交流
            <a href="https://qm.qq.com/q/rqMyNvGyvS" target="_blank" rel="noopener noreferrer">主题QQ交流群：681489336</a>
            ，微信交流群：加好友备注“主题”
        </p>
        <p v-if="showImg">
            <img src="https://img.cdn.sugarat.top/mdImg/MTY5NTA0NTAzMjAzMQ==695045032031" alt="QQ交流群">
        </p>
    </div>
</template>
<script setup>
const props = defineProps({
    showImg: {
        type: Boolean,
        default: false
    }
})
</script>
<style scoped>
.join-group {
    text-align: center;
}

.join-group img {
    width: 200px;
    display: inline-block;
    cursor: pointer;
}

.join-group p {
    padding: 16px 0;
}

.join-group a {
    background: linear-gradient(90deg, #58e3f5, #dabcfc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    padding-bottom: 4px;
    border-bottom: 1px dashed #58e3f5;
    font-weight: bolder;
}
</style>