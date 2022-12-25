---
sidebar:
 title: 组件通信
 step: 3
isTimeLine: true
title: 组件通信
date: 2020-04-14
tags:
 - 大前端
 - vue
categories:
 - 大前端
---
# 组件通信
## 父子通信
### props与emit
>父组件通过 props 传递数据给子组件，子组件通过 emit 发送事件传递数据给父组件,这种父子通信方式也就是典型的单向数据流，父组件通过 props 传递数据，子组件不能直接修改 props， 而是必须通过发送事件的方式告知父组件修改数据。
```vue
<!--父组件中-->
<input :param1="val" @changeparam1="callback"/>
<!--子组件中-->
<script>
  this.$emit('changeparam1', 1)
</script>
```

### v-model
>v-model 默认会解析成名为 value 的 prop 和名为 input 的事件。这种语法糖的方式是典型的双向绑定，但是究其根本，还是通过事件的方法让父组件修改数据。

**子组件**
```vue
<div>
    <input @input="handleInput" :value="value"/>
</div>
<script>
export default{
    props: {
        value: String
    },
    methods: {
        handleInput(e) {
            this.$emit('input', e.target.value)
        }
    }
}
</script>
```
**父组件**
```vue
<h1>{{param1}}</h1>
<fw-input v-model="param1"></fw-input>
<script>
export default{
    date(){
        return {
            param:'666'
        }
    }
}
</script>
```
### $parent与$children 
>通过访问 $parent 或者 $children 对象来访问组件实例中的方法和数据

**子组件**
```vue
<div><button @click="changeParent" type="button">{{value}}</button></div>
<script>
export default{
    data(){
        return{
            value:'child'
        }
    },
    methods: {
        changeParent(e) {
            this.$parent.$data.param1='change by child'
        }
    }
}
</script>
```
**父组件**
```vue
<h1>{{param1}}</h1>
<fw-child></fw-child>
<button @click="changeChild" type="button">parent</button>

<script>
export default{
    data(){
        return{
            param1: '123'
        }
    },
    methods: {
        changeChild(){
            this.$children[0].$data.value='change by parent'
        }
    }
}
</script>
```

### $listeners
>$listeners 属性会将父组件中的 (不含 .native 修饰器的) v-on 事件监听器传递给子组件，子组件可以通过访问 $listeners 来自定义监听器。

**子组件**
```vue
<div><input v-on="inputListeners" :value="value"/></div>
<script>
export default{
    props: {
        value: String
    },
    computed: {
        inputListeners() {
            let that = this;
            return Object.assign({}, that.$listeners, {
                input(e) {
                    that.$emit('input', e.target.value)
                }
            })
        }
    }
}
</script>
```
**父组件**
```vue
<h1>{{param1}}</h1>
<fw-input2 v-model="param1"></fw-input2>
<script>
export default{
    data(){
        return{
            param1: '123'
        }
    }
}
</script>
```

### .sync
>.sync 属性是个语法糖，可以很简单的实现子组件与父组件通信
**子组件**
```vue
<div><input @input="handleInput" :value="value"/></div>
<script>
export default{
    props: {
        value: String
    },
    methods: {
        handleInput(e) {
            this.$emit('update:value', e.target.value)
        }
    }
}
</script>
```
**父组件**
```vue
<h1>{{param1}}</h1>
<fw-input3 :value.sync="param1"></fw-input3>
<script>
export default{
    data(){
        return{
            param1: '123'
        }
    }
}
</script>
```

## 兄弟组件通信
>通过查找父组件中的子组件实现，**this.$parent.$children**，在 $children 中可以通过组件 name 查询到需要的组件实例，然后进行通信。

## 跨多层次组件通信
### provide / inject
**子组件**
```vue
<div>{{parentValue}}</div>
<script>
export default{
    inject:['parentValue']
}
</script>
```
**父组件**
```vue
<deep-child></deep-child>
<script>
export default{
    provide:{
        parentValue:666
    }
}
</script>
```

## 任意组件
使用 ``Vuex`` 或者 ``Event Bus``

## 示例
[CodePen:示例](https://codepen.io/sugarInSoup/pen/wvapBYB)

