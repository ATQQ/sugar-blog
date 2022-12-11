<template>
    <a class="blog-item" :href="route">
        <!-- 左侧信息  -->
        <div class="info-part">
            <!-- 标题 -->
            <p class="title">{{ title }}</p>
            <!-- 简短描述 -->
            <p class="description" v-if="!!description">{{ description }}</p>
            <div class="badge-list">
                <span>{{ author || '粥里有勺糖' }}</span>
                <span class="split">{{ showTime }}</span>
                <span v-if="tag">{{tag.join(' · ')}}</span>
            </div>
        </div>
        <!-- TODO封面图片 -->
        <div class="cover-img"
            style="background-image: url('https://img-bsy.txrpic.com/preview/photo/00/01/23/13/51miz-P1231387-17837374.jpg?imageMogr2/quality/90/thumbnail/!800x%3E')">
        </div>
    </a>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { formatShowDate } from './index';

const props = defineProps<{
    route: string
    title: string
    date: string
    sticky?: number
    description?: string
    tag?: string[]
    author?: string
    cover?: string
}>()

const showTime = computed(() => {
    return formatShowDate(props.date)
})
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>