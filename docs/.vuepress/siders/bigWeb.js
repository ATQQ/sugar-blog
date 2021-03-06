module.exports = {
    root: 'bigWeb',
    children: [
        ['js', 'Javascript', '简介', [
            ['p1', '获取某年某月的天数'],
            ['p2', '日期格式化'],
            ['p3', '展开多级数组'],
            ['p4', '判断数据类型的方案'],
            ['p5', '文件上传与下载'],
            ['currying', '柯里化'],
            ['closure', '闭包'],
            ['delete', 'delete'],
            ['garbage', '垃圾回收'],
            ['throttling', '节流与防抖'],
            ['apply', 'apply,call,bind'],
            ['blob', 'blob与file'],
            ['eventloop', 'Event Loop'],
            ['promise', 'Promise'],
            ['clock', '定时器'],
            ['prototype', '原型与原型链'],
            ['scope', '作用域'],
            ['runStack', '执行上下文栈'],
            ['variableObject', '变量对象'],
            ['scopeLink', '作用域链'],
            ['ecmathis', 'ECMAScript规范解读this'],
            ['runcontext', '执行上下文'],
            ['valuePass', '参数按值传递'],
            ['likearray', '类数组与arguments'],
            ['float', '浮点数'],
            ['symbol', 'Symbol的用法'],
            ['arrowfun', '箭头函数'],
            ['typeConvert', '类型转换'],
            ['getElement', '获取dom元素的方式'],
            ['copy', '浅拷贝与深拷贝'],
            ['es6+', 'ES6+的新语法糖和方法整理'],
        ]],
        ['html', 'HTML', '简介'],
        ['regexp', 'Regexp', '正则表达式'],
        ['css', 'Css', '简介', [
            ['pseudo-element', '伪元素'],
            ['pseudo-class', '伪类'],
            ['selectors', '选择器'],
            ['p1', '伪元素before与after'],
            ['p2', '实现表格斑马纹'],
            ['reflow', '回流与重绘'],
            ['box', '盒模型'],
            ['flex', '弹性布局'],
            ['level', 'CSS层级关系'],
            ['bfc', 'BFC'],
            ['ifc', 'IFC']
        ]],
        ['node', 'Node', 'NodeJS'],
        ['vue', 'Vue', '简介', [
            ['responsive', '响应式基本原理'],
            ['routing', '路由原理'],
            ['hook', '生命周期钩子'],
            ['communicate', '组件通信'],
            ['extend', 'extend API'],
            ['mixin', 'mixin与mixins'],
            ['computed', 'computed与watch'],
            ['keep-alive', 'keep-alive'],
            ['showif', 'v-show 与 v-if'],
            ['mechanism', '❤运行机制概述'],
            ['dep', '❤响应式系统的依赖收集追踪原理'],
            ['vnode', '❤VNode实现']
        ]],
        ['browser', 'Browser', '浏览器专题内容',[
            ['core','内核'],
            ['render','渲染机制'],
            ['block','阻塞渲染'],
            ['cache','缓存机制'],
            ['storage','本地存储'],
            ['safe','安全问题']
        ]],
        ['performance', 'Performance', '性能优化'],
    ],
}