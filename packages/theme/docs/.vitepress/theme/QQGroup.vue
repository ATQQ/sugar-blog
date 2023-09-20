<template>
    <div class="qq-group">
        <p>🎉 欢迎加入 <a href="https://qm.qq.com/q/rqMyNvGyvS" target="_blank" rel="noopener noreferrer">主题QQ交流群：681489336</a></p>
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
.qq-group {
    text-align: center;
}

.qq-group img {
    width: 200px;
    display: inline-block;
    cursor: pointer;
}

.qq-group p {
    padding: 16px 0;
}

.qq-group a {
    background: linear-gradient(90deg, #58e3f5, #dabcfc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    padding-bottom: 4px;
    border-bottom: 1px dashed #58e3f5;
    font-weight: bolder;
}
</style>