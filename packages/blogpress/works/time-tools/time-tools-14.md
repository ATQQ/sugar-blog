---
title: 做一个CL版的时间管理工具（14）
date: 2021-08-18
tags:
 - 技术笔记
 - 个人作品
 - CLI工具
---
# 做一个CLI版的时间管理工具（14）

## 前言
在前一篇文章中完善了`timec page`指令的前后端交互逻辑,本期将完善这个指令打开页面的功能

## 本期效果预览
![图片](https://img.cdn.sugarat.top/mdImg/MTYyOTMwMDY4MzQwNA==timec-page.gif)

## 功能开发
### 完善可视化页面
由于项目采用的Vue3，所以接入[Element UI Plus组件库](https://element-plus.gitee.io/)

```sh
yarn add element-plus
```

直接全量引入饿了么UI，因为不需要Build，所以不考虑包体积带来的影响，其次使用了Vite也不用担心影响启动速度

```js
// main.js
import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import App from './App.vue';

const app = createApp(App);
app.use(ElementPlus);

app.mount('#app');
```
选用日历组件`el-calendar`，直接使用的化，默认样式如下：

![图片](https://img.cdn.sugarat.top/mdImg/MTYyOTI5ODQxMTA5Ng==629298411096)

我们可以通过插槽自定义每个单元格的内容，期望每个单元格的大概结构如下
```html
<div class="day">
    <div class="time">
        <strong>
            <span>1</span>
        </strong>
        <span>0h</span>
    </div>
    <ul class="tasks">
        <li>
            <span>任务名</span>
            <span>0.5h</span>
        </li>
        <li>
            <span>任务名2</span>
            <span>0.53h</span>
        </li>
    </ul>
</div>
```
阅读组件文档通过`#dateCell`插槽进行内容自定义
```html
<el-calendar v-model="value">
  <template #dateCell="{ data }">
    <!-- 自定义 -->
  </template>
</el-calendar>
```
其中`data`有一个属性`day`，其是一个具体的日期，格式为`yyyy-MM-dd`,例如2021-08-18

为了展示出这样的数据，先设计出一个单元格所需数据的JSON结构，下面是第一版的数据结构包含：
* 一天总耗时
* 任务列表
  * 任务名
  * 任务耗时
    * 事件列表
      * 事件名
      * 事件耗时
```js
const item = {
  time: '5.55h',
  tasks: [
    {
      title: '测试',
      time: '5.55h',
      things: [
        {
          title: '写文档',
          time: '5.55h',
        },
      ],
    },
  ],
},
```
但使用的时候发现，每一项要在插槽中使用，插槽没有暴露`v-for`渲染的方法，只有能拿到给予的日期，那么渲染的数据结构只能是个K-V的对象

优化后的数据结构如下,对外包了一层
```js
const oneDay = {
  '2021-08-18':item
}
```

于是乎页面的代码就能梳理出第一版，包含渲染每一天的数据（时间+任务），但并未包含上things的数据
```html
<template>
  <div>
    <el-calendar v-model="value">
      <template #dateCell="{ data }">
        <div class="day">
          <div class="time">
            <strong>
              <span>{{ parseDay(data.day) }}</span>
            </strong>
            <span>{{ sumData[data.day]?.time || '0h' }}</span>
          </div>
          <ul class="tasks" v-if="sumData[data.day]?.tasks?.length">
            <li v-for="(v,idx) in sumData[data.day].tasks" :key="idx">
              <span>{{ v.title }}</span>
              <span>{{ v.time }}</span>
            </li>
          </ul>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const value = ref(new Date());
const parseDay = (date) => {
  const [day] = date.split('-').slice(2);
  return +day;
};

const sumData = reactive({
  '2021-08-18': {
    time: '5.55h',
    tasks: [
      {
        title: '测试',
        time: '5.55h',
        things: [
          {
            title: '写文档',
            time: '5.55h',
          },
        ],
      },
    ],
  },
});

</script>
```
这里things的数据用`Popover 弹出框`渲染

![图片](https://img.cdn.sugarat.top/mdImg/MTYyOTI5OTQ1Mzk2Ng==629299453966)

于是乎将渲染tasks的逻辑小小改动一下，就成了下面这种，其中`#reference`插槽标识被包裹的内容，默认插槽是弹窗的内容，弹窗的标题即当天的日期`data.day`
```html
<ul class="tasks" v-if="sumData[data.day]?.tasks?.length">
    <div v-for="(v,idx) in sumData[data.day].tasks" :key="idx">
        <el-popover v-if="v?.things?.length" placement="right" :title="data.day" :width="200" trigger="click">
            <template #reference>
                <li>
                    <span>{{ v.title }}</span>
                    <span>{{ v.time }}</span>
                </li>
            </template>
            <ol class="things">
                <li v-for="(t,idx) in v.things" :key="idx">
                    <span>{{ t.title }}</span>
                    <span>{{ t.time }}</span>
                </li>
            </ol>
        </el-popover>
    </div>
</ul>
```
到此页面渲染逻辑就搞定了

接下来是从接口拿取数据，然后格式化进行展示的逻辑:
1. 引入获取每日数据接口方法`getEveryDayData`
2. 遍历返回的数据，然后对每一项数据进行格式化
3. 通过`Object.assign`将新的数据赋给旧数据`sumData`
```js
import { getEveryDayData } from '../api';
const sumData = reactive({})

const refresData = async ()=>{
  const { data } = await getEveryDayData()
  data.forEach(v=>{
    Object.assign(sumData,{
      ...parseOneDay(v)
    })
  })
}
```

接口返回的数据结构如下

![图片](https://img.cdn.sugarat.top/mdImg/MTYyOTI5OTg2NjczMw==629299866733)

没法直接使用，需要咱们清洗格式化一下，格式化数据的方法`parseOneDay`逻辑如下:
* 创建一个初始化对象，包含`time`和`tasks`属性
* 处理拿到的接口数据
* 遍历其`tasks`
  * 创建一个初始的任务，包含任务名，消耗时间，事件列表等属性
  * 遍历每个`task`的事件列表，时间累加即为对应任务的耗时
  * 任务时间累加就是当天的总耗时
* 返回的数据加上日期title包一层
```js
const parseOneDay = (data) => {
  const o = {
    time: '',
    tasks: []
  }
  if (!data || !data.title) {
    return {}
  }
  let sumTime = 0
  data.tasks.forEach(t => {
    let task = {
      title: t.title,
      time: '',
      things: []
    }

    let taskTime = 0
    t.things.forEach(thing => {
      const { time, content } = thing
      taskTime += (+time)
      task.things.push({
        title: content,
        time: `${time}h`
      })
    })
    task.time = `${taskTime}h`
    sumTime += taskTime

    o.tasks.push(task)
  })
  o.time = `${sumTime}h`
  return {
    [data.title]: o
  }
}
```

数据处理完毕后就是调用,将调用逻辑放到`onMounted`钩子中，并将执行逻辑放入`setInterval`定时器中，通过接口轮训达到数据实时展示的效果
```js
import { onMounted } from 'vue';

onMounted(()=>{
  setInterval(()=>{
    refresData()
  },1200)
})
```

## 最后
时间紧张，本文的代码可能有点shi，后续会抽时间在仓库中进行优化

由于每天空闲时间有限，本文就先到这，下一期将继续完善项目的交互和功能

如果读者还感觉意犹未尽，敬请期待后续更新，或持续关注一下[仓库](https://github.com/ATQQ/time-control)的状态

欢迎评论区提需求，交流探讨

本系列会不断的更新迭代，直至产品初代完成

* [仓库地址](https://github.com/ATQQ/time-control)

