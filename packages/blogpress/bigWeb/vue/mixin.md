---
sidebar:
 title: mixin与mixins
 step: 5
isTimeLine: true
title: mixin与mixins
date: 2020-04-14
tags:
 - 大前端
 - vue
categories:
 - 大前端
---
# mixin 与 mixins
## mixin
mixin 用于全局混入，会影响到每个组件实例，通常插件都是这样做初始化的。

```vue
<script>
Vue.mixin({
    beforeCreate(){
        console.log('init success')
    }
})
</script>
```
## mixins
多个组件中有相同的业务逻辑，就可以将这些逻辑剥离出来，通过 mixins 混入代码

```vue
<script>
let myMixin = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  },
  data(){
      return{
          msg:"hello world!"
      }
  }
}

// 定义一个使用混入对象的组件
var Component = Vue.extend({
  mixins: [myMixin],
  template:"<h1>{{msg}}</h1>"
})

new Component().$mount("#app")
</script>
```

