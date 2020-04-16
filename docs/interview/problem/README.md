# Q&A

前端面试常见问题与个人的总结整理

**下面是记录的所有面试题目录:smile:**
## js
<solve ok>[原始类型有哪些？](../js/primitiveType.md)</solve>
<solve ok>[null是对象吗？](../js/nullobj.md)</solve>
<solve ok>[为什么0.1+0.2!=0.3?](../js/numNotEqual.md)</solve>
<solve ok>[对象类型与原始类型的不同之处?](../js/objDiffPrim.md)</solve>
<solve ok>[函数参数是对象会发生什么问题?](../js/objparam.md)</solve>
<solve ok>[typeof能否正常判断类型?](../js/typeof.md)</solve>
<solve ok>[instanceof能正确判断类型的原因是什么?](../js/instanceof.md)</solve>
<solve ok>[概述原型与原型链?](../../bigWeb/js/prototype.md)</solve>
<solve ok>[如何正确判断this?](../js/this.md)</solve>
<solve ok>[==与===有什么区别?](../js/equal.md)</solve>
<solve ok>[什么是闭包?](../js/closure.md)</solve>
<solve ok>[深拷贝与浅拷贝?](../js/copy.md)</solve>
<solve ok>[为什么使用模块化？JS实现模块化的几种方式](../js/module.md)</solve>
<solve ok>[Promise的特点/优点/缺点？](../js/promise.md#特点)</solve>
<solve ok>[什么是Promise链？](../js/promise.md#promise链)</solve>
<solve ok>[Promise构造函数执行和then函数执行有什么区别？](../js/promise.md#promise链)</solve>
<solve ok>[async及await的特点/优点/缺点是什么？]((../js/asyncawait.md))</solve>
<solve ok>[await原理是什么？](../js/asyncawait.md)</solve>
<solve ok>[new原理是什么？](../js/new.md)</solve>
<solve ok>[new创建对象与字面量创建对象的区别？](../js/new.md)</solve>
<solve ok>[v8下的垃圾回收机制？](../js/v8garbage.md)</solve>
<solve ok>[事件触发过程是怎么样的？](../js/event.md)</solve>
<solve ok>[什么是事件代理？](../js/event.md)</solve>
<solve ok>[什么是跨域？使用同源策略的原因？](../internet/cros.md)</solve>
<solve ok>[解决跨域的方式？](../internet/cros.md)</solve>
<solve ok>[什么是预检请求？](../internet/cros.md#预检请求)</solve>
<solve ok>[什么是函数柯里化？](../../bigWeb/js/currying.md#柯里化)</solve>
<solve ok>[JS的垃圾回收机制？](../../bigWeb/js/garbage.md)</solve>
<solve ok>[什么是节流,防抖？](../../bigWeb/js/throttling.md#防抖)</solve>
<solve ok>[浏览器与Node中event loop?他们有何不同？](../../bigWeb/js/eventloop.md)</solve>
<solve ok>[概述一下js中的词法作用域？](../../bigWeb/js/scope.md)</solve>

## css
<solve ok>[什么是回流与重绘？](../../bigWeb/css/reflow.md#回流)</solve>
<solve ok>[什么是盒模型？](../../bigWeb/css/box.md)</solve>
<solve ok>[CSS的层级关系？](../../bigWeb/css/level.md)</solve>
<solve ok>[什么是BFC？](../../bigWeb/css/bfc.md)</solve>
<solve>[什么是IFC？](../../bigWeb/css/ifc.md)</solve>
<solve ok>[flex弹性布局？](../../bigWeb/css/flex.md)</solve>
<solve>[grid布局？](http://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html)</solve>
<solve ok>[display属性有哪些?作用分别是什么?](../css/display.md)</solve>
<solve ok>[position的值有哪些?](../css/position.md)</solve>
<solve >display:none,opactiy:0,visibility:hidden区别</solve>

## vue
<solve ok>[实现数据的响应式的原理？](../../bigWeb/vue/bindData.md)</solve>
<solve>路由原理,为什么浏览器不会刷新</solve>

## ES6
<solve ok>[常见es6问题?](../js/es6.md)</solve>
<solve ok>[Symbol的用法?](../../bigWeb/js/symbol.md)</solve>
<solve ok>[箭头函数特点?](../../bigWeb/js/arrowfun.md#特点)</solve>
<solve ok>[什么是提升/暂时性死区?var/let/const区别](../other/promote.md)</solve>

## 小程序
<solve ok>[小程序的特点?](../mini/feature.md)</solve>
<solve ok>[小程序的原理?](../mini/principle.md)</solve>
<solve ok>[与传统移动web的异同?](../mini/differentweb.md)</solve>
<solve>小程序是如何与webview通信的?</solve>

## 浏览器
<solve ok>[浏览器的缓存机制？](../../bigWeb/browser/cache.md)</solve>
<solve ok>[什么是强缓存/协商缓存？](../../bigWeb/browser/cache.md#强缓存)</solve>
<solve ok>[协商缓存的作用？如何工作的？](../../bigWeb/browser/cache.md#协商缓存)</solve>
<solve ok>[浏览器安全问题？](../../bigWeb/browser/safe.md)</solve>


## 编程题
<solve>如何实现继承？</solve>
<solve>实现new</solve>
<solve>节流与防抖实现</solve>
<solve>实现call/apply/bind</solve>
<solve>实现setTimeout/setInterval</solve>
<solve>并发请求?</solve>
<solve>实现一个ajax</solve>
<solve>vue原理</solve>
<solve>如何实现垂直居中</solve>
<solve>KMP</solve>
<solve>quicksort</solve>
<solve>实现36进制转换</solve>
<solve>树的遍历方式,前/中/后,层次</solve>
<solve>对称二叉树</solve>
<solve>实现36进制转换</solve>
<solve>如何实现 a==1&&a==2 -- true</solve>

## 网络
<solve ok>[概述一下TCP](../../computerBase/Internet/tcp.md)</solve>
<solve ok>[概述一下UDP](../../computerBase/Internet/udp.md)</solve>
<solve ok>[TCP与UDP区别](../../computerBase/Internet/tcp-udp.md)</solve>
<solve ok>[概述HTTP](../../computerBase/Internet/http.md)</solve>
<solve ok>[HTTP与HTTPS的区别](../../computerBase/Internet/http.md#HTTPS)</solve>
<solve ok>[TLS协议握手过程,如何工作的](../../computerBase/Internet/http.md#TLS)</solve>
<solve ok>[HTTP2的特点](../../computerBase/Internet/http.md#http2)</solve>
<solve ok>[如何才能使用HTTP2,有什么前提条件](../../computerBase/Internet/http.md#如何使用)</solve>
<solve ok>[HTTP3中使用的QUIC协议基于UDP的原因?](../../computerBase/Internet/http.md#QUIC)</solve>
<solve ok>[如果响应头Content-Length=0那么是发出来被截取了还是没发出来?](../../computerBase/Internet/clength.md)</solve>

## 操作系统
<solve ok>[线程与进程的概念/区别/如何工作的?](../../computerBase/os/difprothr.md)</solve>
<solve>进程之间如何进行切换的?</solve>
<solve ok>[进程和线程怎么通信?](../../computerBase/os/communicate.md)</solve>

## 综合问题
<solve ok>[怎么理解前端工程化？](../other/engineering.md)</solve>
<solve ok>[浏览器输入url之后到网页显示发生了什么](../other/inputurl.md)</solve>
<solve ok>[原型如何实现继承,Class 如何实现继承,Class 本质是什么](../other/inherit.md)</solve>
<solve ok>[typeof 是否能正确判断类型,instanceof 能正确判断对象的原理是什么](../other/judgeType.md)</solve>
<solve ok>[对象类型和原始类型的不同之处？函数参数是对象会发生什么问题？](../other/object.md)</solve>
<solve ok>[原始类型有哪几种？null 是对象吗？](../other/primitive.md)</solve>
<solve ok>[什么是提升？什么是暂时性死区？var、let 及 const 区别？](../other/promote.md)</solve>
<solve ok>[原始类型有哪几种？null 是对象吗？](../other/primitive.md)</solve>
<solve ok>[如何理解原型？如何理解原型链？](../other/prototype.md)</solve>

## 非技术问题
<solve>未来的职业规划</solve>
<solve>除开发外的兴趣爱好</solve>
<solve>自己的长处/优势</solve>
<solve>自己的不足</solve>
<solve>跟其它候选人相比,你觉得你的优势在哪里</solve>
<solve>对前端工程化的理解</solve>
<solve>为什么选择前端</solve>
<solve>平时怎么学习的,最近在看什么</solve>
<solve>你觉得自己最成功的一次分享或者成果是什么</solve>
<solve>你如何看待前端这个行业</solve>
<solve>你为什么会选择我们</solve>

## 目录
