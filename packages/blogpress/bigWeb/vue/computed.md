---
sidebar:
 title: computed与watch
 step: 6
isTimeLine: true
title: computed与watch
date: 2020-04-14
tags:
 - 大前端
 - vue
categories:
 - 大前端
---
# computed 与 watch
* ``computed`` 是计算属性，依赖其他属性计算值，并且 computed 的值有缓存，只有当计算值变化才会返回内容。
* ``watch`` 监听到值的变化就会执行回调，在回调中可以进行一些逻辑操作。

## 使用场景
* 需要依赖别的属性来动态获得值的时候可以使用 ``computed``
* 对于监听到值的变化需要做一些复杂业务逻辑的情况可以使用 ``watch``

## 对象写法
### computed
```vue
<script>
export default{
    data(){
        return {
            num:1
        }
    },
    computed:{
        doubleNum:{
            get(){
                return this.num*2
            },
            set(v){
                this.num = ~~(v/2)
            }
        }
    }
}
</script>
```

### watch
```vue
<script>
export default{
    data(){
        return {
            num:1
        }
    },
    watch:{
        num:{
            // 深度遍历
            deep: true,
            // 立即触发
            immediate: true,
            // 执行的函数
            handler(val, oldVal) {
                console.log(v,oldVal)
            }
        }
    }
}
</script>
```

