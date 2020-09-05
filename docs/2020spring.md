# 2020前端春招经验分享(掘金处女作),从面试小白到老油条的蜕变|掘金技术征文
>终于上岸了呜呜呜...,终于又能愉快的写代码了

*tip:为方便阅读部分内容细节使用折叠*

![图片](https://img.cdn.sugarat.top/mdImg/MTU4NzEzMjEzMjc4NQ==587132132785)

# 自我介绍
大三双非本科,大一开始学前端,今年2月底开始投实习,不久前终于收到了美团的offer,心花怒放

**初生牛犊不怕虎,前期没好好准备,浪费了太多好机会,奉劝大家一定要好好复习和总结**
<details>
  <summary>
  <font color='3eaf7c'>→面试历程(不含笔试时间)</font>
  </summary>
  <ol>
    <li>2月25日:阿里淘系一面</li>
    <li>2月26日:CVTE一面(凉)</li>
    <li>3月13日:腾讯一面</li>
    <li>3月23日:阿里淘系二面(凉)</li>
    <li>3月24日:字节一面(凉)</li>
    <li>3月25日:腾讯二面</li>
    <li>3月26日:腾讯三面(凉)</li>
    <li>3月28日:美团一面</li>
    <li>3月31日:美团二面</li>
    <li>4月03日:美团hr面</li>
    <li>4月03日:蘑菇街一面</li>
    <li>4月09日:蘑菇街二面(拒)</li>
    <li>4月10日:TW一面</li>
    <li>4月10日:腾讯换部门捞起来一面(凉)</li>
    <li>4月12日:百度一,二,三面技术</li>
    <li><font color='3eaf7c'>4月13日:美团OC(上岸)</font></li>
    <li>4月16日:网易云一面</li>
    <li>4月16日:TW二面</li>
  </ol>
</details>


>当淘系前端二面凉了之后,周围同学都陆续上岸了,我开始慌了,就海投了一波


![图片](https://img.cdn.sugarat.top/mdImg/MTU4NzE3NjQxNjA1NA==587176416055)
<details>
  <summary>
  <font color='3eaf7c'>→目前还在流程中</font>
  </summary>
  <ol>
    <li>百度</li>
    <li>TW</li>
    <li>网易云</li>
    <li>腾讯</li>
    <li>快手</li>
  </ol>
</details>

下面开始干货分享,请各位细细品,如有不足之处还请斧正
# 面试前应该做哪些准备?
## 1.一些知识储备
>这里主要是根据我的面试经验总结的一些面试高频的知识点供大家参考,以树形结构展开(避免贴图劝退)

>对前端的计算机基础考查相比后端开发已经简单了许多,大厂一二面也特别爱考查这部分内容

>如果并没有深入了解或使用Node,大家可以不用刻意去准备Node
<details>
    <summary>
        <font color='3eaf7c'>计算机基础知识</font>
    </summary>
    <ul>
        <li>
            <details>
                <summary>
                    <font color='3eaf7c'>算法与数据结构</font>
                </summary>
                <ol>
                    <li>链表</li>
                    <li>堆/栈</li>
                    <li>哈希表</li>
                    <li>二叉树</li>
                    <li>各种排序,尤其是快排</li>
                    <li>BST</li>
                    <li>KMP</li>
                    <li>二分</li>
                </ol>
            </details>
        </li>
        <li>
            <details>
                <summary>
                    <font color='3eaf7c'>操作系统</font>
                </summary>
                <ol>
                    <li>线程相关的问题</li>
                    <li>进程相关的问题</li>
                    <li>进程与线程进行对比所产生的问题</li>
                </ol>
            </details>
        </li>
        <li>
            <details>
                <summary>
                    <font color='3eaf7c'>计算机网络</font>
                </summary>
                <ol>
                    <li>TCP相关</li>
                    <li>UDP相关</li>
                    <li>HTTP相关</li>
                    <li>DNS相关</li>
                </ol>
            </details>
        </li>
        <li>
            <details>
                <summary>
                    <font color='3eaf7c'>设计模式</font>
                </summary>
                <ol>
                    <li>工厂模式</li>
                    <li>抽象工厂模式</li>
                    <li>单例模式</li>
                </ol>
            </details>
        </li>
    </ul>
</details>
<details>
    <summary>
        <font color='3eaf7c'>大前端</font>
    </summary>
    <ul>
        <li>
            <details>
                <summary>
                    <font color='3eaf7c'>JS(包含ES6)</font>
                </summary>
                <ol>
                    <li>DOM事件触发的几个阶段(捕获,目标,冒泡)相关问题</li>
                    <li>值类型与引用类型相关问题</li>
                    <li>函数柯里化</li>
                    <li>闭包</li>
                    <li>this指向判断</li>
                    <li>apply,call,bind</li>
                    <li>event loop</li>
                    <li>promise</li>
                    <li>定时器</li>
                    <li>原型与原型链</li>
                    <li>箭头函数</li>
                    <li>类型转换</li>
                    <li>async与await</li>
                    <li>类数组</li>
                    <li>节流防抖</li>
                    <li>垃圾回收机制</li>
                    <li>typeof与instanceof</li>
                    <li>==与===</li>
                    <li>JS中的继承实现</li>
                    <li>let,const,var区别</li>
                    <li>各种遍历数组的方式比较(for,forof,forin,forEach)</li>
                </ol>
            </details>
        </li>
        <li>
            <details>
                <summary>
                    <font color='3eaf7c'>CSS</font>
                </summary>
                <ol>
                    <li>回流与重绘</li>
                    <li>盒模型</li>
                    <li>弹性布局(flex)</li>
                    <li>栅栏布局(grid)</li>
                    <li>display各种值及其作业</li>
                    <li>position各种值及其作用</li>
                    <li>BFC(概念,如何触发,特点)</li>
                    <li>display:none,visibility:hidden,opacity:0区别</li>
                    <li>CSS层级关系,样式权重计算</li>
                    <li>CSS伪类</li>
                    <li>CSS伪元素</li>
                    <li>斑马纹实现</li>
                    <li>简单动画的实现</li>
                    <li>小球从屏幕左滚动到右xxxpx</li>
                    <li>子元素相对于父元素水平居中的方法</li>
                    <li>子元素相对于父元素水平垂直居中的方法</li>
                    <li>如何做页面主题(皮肤)切换</li>
                </ol>
            </details>
        </li>
        <li>
            <details>
                <summary>
                    <font color='3eaf7c'>VUE(针对没看源码)</font>
                </summary>
                <ol>
                    <li>数据双向绑定,数据响应式实现的原理</li>
                    <li>生命周期</li>
                    <li>组件之间通信方法(父子,兄弟,祖孙,任意)</li>
                    <li>v-if,v-show异同</li>
                    <li>路由原理,为什么地址发生改变,浏览器不会刷新</li>
                    <li>权限管理</li>
                </ol>
            </details>
        </li>
        <li>
            <details>
                <summary>
                    <font color='3eaf7c'>浏览器</font>
                </summary>
                <ol>
                    <li>缓存机制</li>
                    <li>页面渲染原理(过程)</li>
                    <li>本地存储</li>
                    <li>浏览器安全相关问题(SQL注入,XSS,CSRF,DNS劫持,点击劫持)</li>
                    <li>跨域相关问题(原因,解决方式)</li>
                    <li>同源策略</li>
                    <li>预检请求</li>
                </ol>
            </details>
        </li>
        <li>
            <details>
                <summary>
                    <font color='3eaf7c'>性能优化</font>
                </summary>
                <ol>
                    <li>Webpack代码打包优化</li>
                    <li>网络层面优化</li>
                    <li>首屏加载优化</li>
                </ol>
            </details>
        </li>
        <li>
            <details>
                <summary>
                    <font color='3eaf7c'>小程序</font>
                </summary>
                <ol>
                    <li>小程序的特点</li>
                    <li>你对小程序的发展看法</li>
                    <li>小程序的原理</li>
                    <li>小程序与传统移动端Web的区别</li>
                </ol>
            </details>
        </li>
        <li>
            <details>
                <summary>
                    <font color='3eaf7c'>Node</font>
                </summary>
                <ol>
                    <li>node中的Event loop</li>
                    <li>node中的进程与线程相关问题</li>
                </ol>
            </details>
        </li>
        <li>
            正则表达式简单使用
        </li>
    </ul>
</details>
## 2.总结自己的项目
>如果你的项目非常有意思的话,不妨多多总结一下其闪光点,如果你的项目非常有意思,很容易与面试官产生共鸣,妥妥的面试+分,也能让他留下一个印象

主要从:
* 项目背景
* 对于多人协作项目在项目中所担任的职责,以及对项目的贡献
* 遇到了什么难题,如何解决的
* 项目的创新点
* 你有什么收获
* 项目所用技术栈,项目产出(web(PC/Mobile),app,小程序?)

这几个方面,更加细节之处可以参考[面试被问项目经验不用慌，按这个步骤回答绝对惊艳](https://juejin.im/post/5e7aed9c6fb9a07cac1d872d)

## 3.根据当前面试的进度做相应的复习
>部分公司的职位可能需要4+1 甚至 5+1 ,小生太菜鸡,尚未触及

对于2+1的面试
* 一面:计算机基础+前端相关
* 二面:项目+计算机基础+前端相关
* hr面:非技术的开放性问题

对于3+1的面试
* 一,二面:计算机基础+前端相关
* 三面:项目+非技术开放性问题+一点点大前端相关
* hr面:非技术的开放性问题

## 4.面试中自我介绍打草稿
>大多数面试开场就是叫你介绍一下自己,这个环节还是非常重要的,说得好,能够面试官留下深刻印象

>但需要注意在自我介绍的时候,不要给自己挖坑,面试官一般会根据你自我介绍中的项目经历,或者个人技术栈展开提问,如果对某一门技术栈只停留在使用/了解阶段(Hello World),尽量不要提

1. 个人基本信息:姓名,目前状况(大三,应届),兴趣爱好
2. 前端的学习经历
3. 实习经历
4. 项目经历可以简单介绍一下
   1. 你收货最大的项目
   2. 最近做的一个项目
   3. 自己最自豪的个人作品

## 5.面试中常常问的非技术问题准备
>一定要自己下来打打草稿,临场发挥难免不完美

<details>
    <summary>
    <font color='3eaf7c'>展开查看</font>
    </summary>
    <ol>
        <li>除开发外有什么其他兴趣爱好吗</li>
        <li>毕业后直接工作还是考研,为什么不考研</li>
        <li>未来/近5年的职业规划</li>
        <li>你认为自己的优势/长处是什么</li>
        <li>你认为自己有什么不足之处</li>
        <li>为什么选择前端</li>
        <li>平时是如何学习的,最近在看什么</li>
        <li>如何平衡学校的课程学习与前端的自学与开发</li>
        <li>你觉得自己最成功的一次分享或者成果是什么</li>
        <li>有投其它公司吗?有结果了没?为什么没过,你知道原因吗</li>
        <li>为什么选择我们</li>
    </ol>
</details>

# 面试中
1. 如果是初次面试难免会紧张,这个不可避免,随着面试次数增加应增加自己的自信心,减少紧张时间
2. 语速不能过快
3. 面试官提问后,不要急于回答,可以在大脑中思考几秒中整理回答的思路,再脱口而出,出口成章,减少回答时卡顿
4. 当遇到手撕代码的时候,如果思考了一段时间,一点思路都没有,就直接给面试官说,避免长时间耗着(面试时长是有限的一般技术面再1小时左右短的30-40分钟)
5. 手撕代码,如果你有解决方案即便不是最优的也可以写上,然后面试官会问你有不有更优的解法(或者优化空间),你可以借此再思考一小会儿,没有的话直接告知面试官(部分面试官在当你结束这题作答的时候,会告诉你一个解法的思路)
6. 一般在面试快结束时,面试官会问你有什么问题需要问他,不要说没有问题,可以问问部门的一些情况,面试官职级,负责的产品,前端部门有开源项目没,当前面试的什么部门,未来工作Base在哪里等等,也可以聊聊与工作无关的,畅所欲言,**交流得愉快的话也能给面试加分**

# 面试后
及时整理面试内容,大多数情况下面试都会遇到知识盲点,一定要下来去查资料了解,填上这个点,为下次面试做足准备

如果面完了HR面切忌不要放松(除非有100%的把握通过),身边不少HR面挂掉的例子,不然还是继续投,该笔试的笔试,该面就面

# 面试中所遇问题整理(附部分自我回答)
>以面试题类型分类整理,为什么不按公司分?在我看来同一个公司不同的人面难有太多相同的面试题,只有综合多家的经验才能百战不殆

<details>
    <summary>
    <font color='3eaf7c'>
        <h2 style='display:inline'>0.在浏览器中输入URL到页面渲染的整个过程(详解,非常高频的考点)</h2>
    </font>
    </summary>

## 构建请求行
```text
GET   /     HTTP/1.1
方法  请求路径 请求的协议/版本
```
## 查找强缓存
检查资源是否存在强缓存,存在的话直接进行资源解析

## 读取DNS缓存
1. 浏览器先检查自身缓存中有没有被解析过的这个域名对应的ip地址，如果有，解析结束
2. 检查操作系统缓存中有没有对应的已解析过的结果(win中的hosts文件)
3. 都没有则进行下一步

## DNS解析
1. 请求本地域名服务器（LDNS）来解析这个域名,没有则进行下一步
2. DNS 根服务器查询

## 建立TCP连接
可以在此简述建立TCP链接的3次握手的过程
1. ``客户端``向``服务端``发送请求报文
2. ``服务端``收到请求报文,同意连接则向``客户端``发送一个应答
3. ``客户端``收到``服务端``的应答,并告知``服务端``我准备好了

TCP 的一些特性
* 建立连接需要进行三次握手
* 断开连接都需要四次握手
* 在传输数据的过程中，通过各种算法保证数据的可靠性
* 相比 UDP 来说不那么的高效。

## 判断是否是Https请求
是:进行``TLS握手``

**基本过程**
1. 客户端向服务器端索要并验证公钥
2. 双方协商生成”对话密钥”
3. 双方采用”对话密钥”进行加密通信

>在 TLS 握手阶段，两端使用非对称加密的方式来通信，但是因为非对称加密损耗的性能比对称加密大，所以在正式传输数据时，两端使用对称加密的方式通信

否:发起Http请求
## 发送HTTP请求
向服务端正式发送http请求

## 返回HTTP报文
服务器处理请求响应结果,并返回Http报文

**判断状态码是什么?**

200:继续解析，如果 4xx 或 5xx 的话就会报错，如果 3xx 进行重定向

如果是**gzip**格式的话会先解压一下，然后通过文件的编码格式去解码文件

## 浏览器解析渲染页面
1. 针对下载完成后的HTML文件
   * 词法分析:标记化
   * 语法分析:构建DOM树
2. 解析HTML(超文本标记语言)-->DOM(文档对象模型)树
   * 遇到 script 标签的话，会判断是否存在 async 或者 defer属性
      * async:并行进行下载,下载完成后并执行js
      * defer:先并行下载文件，然后等待 HTML 解析完成后顺序执行。
      * 如果都没有:就会阻塞住渲染流程直到 JS 下载并执行完毕
   * 遇到link下载并解析CSS(层叠样式表)-->CSSOM(CSS对象模型)树
     * link标签引用
     * style标签中的样式
     * 元素的内嵌style属性
3. DOM树 + CSSOM树 --> Render Tree(渲染树):CSSOM 树和 DOM 树构建完成后开始生成渲染树
4. 回流(Layout):根据生成的渲染树,回流得到节点的几何信息(位置,尺寸)
   * 计算可见的Dom节点在设备视口的位置和尺寸,这个计算阶段就是回流
   * 为了知道每个可见节点在视口的确切大小和位置,浏览器从渲染树的根节点进行遍历
5. 重绘(Painting):根据渲染树与回流得到的节点几何信息,得到节点的绝对像素
   * 经过生成的渲染树和回流阶段,得到了所有可见节点具体的几何信息与样式,然后将渲染树的每个节点转换成屏幕上的实际像素,这个阶段就叫重绘节点
6. 将像素发送给GPU绘制,合成图层,然后展示在页面上

## 断开TCP连接
简述断开进行4次数握手过程
1. ``客户端``对``服务端``发送释放连接的请求
2. ``服务端``收到``客户端``的请求后,告知应用层释放连接
3. ``服务端``将数据发送完毕后,再向``客户端``发送释放连接请求
4. ``客户端``收到释放请求后,并向``服务端``发送确认释放的应答,同意释放

</details>
<details>
    <summary>
    <font color='3eaf7c'>
        <h2 style='display:inline'>1.算法与数据结构</h2>
    </font>
    </summary>
    <ol>
        <li>查找一个字符串是否在另一个字符串中存在,考查KMP</li>
        <li>链表转置,迭代/递归</li>
        <li>合并两个有序链表</li>
        <li>合并两棵BST</li>
        <li>构建BST</li>
        <li>二叉树前/中/后序遍历</li>
        <li>TopK问题</li>
        <li>
        <details>
            <summary>
            <font color='3eaf7c'>二叉树深度优先/DFS,广度优先(层序遍历)/BFS</font>
            </summary>

```js
// DFS借助栈
function dfs(root){
    let stack = []
    if(!root){
        stack.push(root)
    }
    while(stack.length!==0){
        let node = stack.pop()
        console.log(node.value)
        if(node.right){
            stack.push(node.right)
        }
        if(node.left){
            stack.push(node.left)
        }
    }
}

// BFS借助队列
function bfs(root){
    let queue = []
    if(!root){
        queue.push(root)
    }
    while(queue.length!==0){
        let node = queue.shift()
        console.log(node.value)
        if(node.left){
            stack.push(node.left)
        }
        if(node.right){
            stack.push(node.right)
        }
    }
}
```

</details>
        </li>
        <li>
                <details>
            <summary>
            <font color='3eaf7c'>快速排序</font>
            </summary>

```js
function quickSort(array) {
    const _quickSort = (arr, left, right) => {
        if (left >= right) {
            return
        }
        let o = left
        let start = left
        let end = right
        while (left < right) {
            while (arr[right] >= arr[o] && right > left) {
                right--
            }
            while (arr[left] <= arr[o] && left < right) {
                left++
            }
            if (left !== right) {
                swap(arr, left, right)
            }
        }
        [arr[o],arr[left]] = [arr[left],arr[o]]
        _quickSort(arr, start, left - 1)
        _quickSort(arr, left + 1, end)
    }
    _quickSort(array, 0, array.length - 1)
}
```

</details>
        </li>
    </ol>
</details>

<details>
    <summary>
    <font color='3eaf7c'>
        <h2 style='display:inline'>2.计算机网络</h2>
    </font>
    </summary>
    <ol>
        <li>TCP与UDP的区别</li>
        <li>简述HTTP(把你知道的与HTTP相关的都吐露出来)</li>
        <li>HTTP中常用首部字段有哪些?你了解哪些HTTP首部</li>
        <li>HTTP状态码有哪些,各代表什么</li>
        <li>HTTP常用方法有哪些</li>
        <li>
        <details>
            <summary>
            <font color='3eaf7c'>简述UDP</font>
            </summary>

* 面向无连接:不需要在正式传递数据之前先连接起双方
* 数据报文的搬运工:不保证有序且不丢失的传递到对端
* 没有任何控制流量的算法,以恒定速率传输
* 适用于对网络通讯质量要求不高但实时性要求高的地方
  * 直播,语音,视屏等场景

</details>
        </li>
        <li>
            <details>
            <summary>
            <font color='3eaf7c'>简述TCP</font>
            </summary>

* 面向有连接:建立链接三次握手,断开四次握手
* 在传输数据的过程中，通过各种算法保证数据的可靠性
* 应用场景
  * HTTP
  * FTP
  * 网游

</details>
        </li>
        <li>
                    <details>
            <summary>
            <font color='3eaf7c'>为什么TCP要经历三次握手,不是一次或者两次</font>
            </summary>

* 防止出现失效的连接请求报文段被服务端接收的情况，从而产生错误
* 如果一次:客户端发送连接请求后，没有收到服务端的应答，是没法判断连接是否成功的
* 如果两次:客户端发送连接请求后，等待服务器端的应答。如过客户端的SYN过了一段时间没有到达服务器端，客户端链接超时，会重新发送一次连接，如果重发的这次服务器端收到了，且应答了客户端，连接就建立了。但是建立后，第一个SYN也到达服务端了，这时服务端会认为这是一个新连接，会再给客户端发送一个ACK，这个ACK当然会被客户端丢弃。但是此时服务器端已经为这个连接分配资源了，而且服务器端会一直维持着这个资源，会造成浪费

</details>
        </li>
                <li>
                    <details>
            <summary>
            <font color='3eaf7c'>HTTP与HTTPS的区别</font>
            </summary>

* HTTP是明文传输的
* HTTP(80) 和 HTTPS(443) 使用不同的端口
* HTTP 页面响应速度比 HTTPS 快
* HTTPS 是建构在 SSL/TLS 之上的 HTTP 协议,HTTPS 比 HTTP 要更耗费服务器资源
* HTTPS是在HTTP上建立SSL/TLS加密层，并对传输数据进行加密

</details>
        </li>
        <li>
                    <details>
            <summary>
            <font color='3eaf7c'>HTTP2的特点</font>
            </summary>

* 多路复用
* Header压缩
* 服务端主动 Push资源
* HTTP/2 中引入了新的编码机制，所有传输的数据都会被分割，并采用二进制格式编码

</details>
        </li>
        <li>
        <details>
            <summary>
            <font color='3eaf7c'>HTTP2使用条件</font>
            </summary>

* 支持Http2的服务端与客户端
* 域名就必须是https(基于TLS/1.2或以上版本的加密连接)

</details>
        </li>
        <li>
        <details>
            <summary>
            <font color='3eaf7c'>简述TLS协议工作过程</font>
            </summary>

利用非对称加密实现身份认证和密钥协商，对称加密算法采用协商的密钥对数据加密，基于散列函数验证信息的完整性

</details>
        </li>
    </ol>
</details>
<details>
    <summary>
    <font color='3eaf7c'>
        <h2 style='display:inline'>3.操作系统</h2>
    </font>
    </summary>
    <ol>
        <li>线程与进程的概念/区别/如何工作</li>
        <li>进程|线程之间如何通信的</li>
        <li>进程如何切换</li>
    </ol>
</details>
<details>
    <summary>
    <font color='3eaf7c'>
        <h2 style='display:inline'>4.JS</h2>
    </font>
    </summary>
    <ol>
         <li>
        <details>
            <summary>
            <font color='3eaf7c'>为什么typeof null == 'object'|null是对象吗</font>
            </summary>

null不是对象
>虽然 typeof null 会输出 object，但是这只是 JS 存在的一个悠久 Bug。在 JS 的最初版本中使用的是 32 位系统，为了性能考虑使用低位存储变量的类型信息，000 开头代表是对象，然而 null 表示为全零，所以将它错误的判断为 object

</details>
        </li>
         <li>
        <details>
            <summary>
            <font color='3eaf7c'>什么是函数柯里化</font>
            </summary>

把一个接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回(接受剩下的参数而且返回结果的)新函数的技术

</details>
        </li>
         <li>
        <details>
            <summary>
            <font color='3eaf7c'>对象类型和原始值类型的不同之处</font>
            </summary>

**对象**
* 对象类型存储的是(地址)指针:声明一个对象会在内存中开辟一块空间存放值
* 变量赋值的时候是赋值的地址:新变量修改会影响原变量
* 存在深浅拷贝问题

**值类型**
* 赋值的时候拷贝的一个新的值,不会影响原来的

</details>
        </li>
        <li>
        <details>
            <summary>
            <font color='3eaf7c'>typeof能否正确判断类型</font>
            </summary>

能够判断
* number
* string
* boolean
* undefined
* symbol
* function

</details>
        </li>
        <li>
        <details>
            <summary>
            <font color='3eaf7c'>instanceof能正确判断类型的原因是什么</font>
            </summary>

* 通过原型链进行判断
* 每个对象都有一个原型,instanceof会沿着原型链进行判断,直到最顶层原型为止
* 可以通过`Symbol.hasInstance`重定义instanceof的行为,所以instanceof的结果不一定绝对正确

</details>
        </li>
        <li>
        <details>
            <summary>
            <font color='3eaf7c'>什么是原型,原型链</font>
            </summary>

* 每一个js对象在创建的时候就会自动关联另一个对象，这个对象就是`原型`，每一个对象都会从原型"继承"属性
* 相互关联的原型组成的链状结构就是`原型链`

</details>
        </li>
        <li>
        <details>
            <summary>
            <font color='3eaf7c'>this指向如何判断,箭头函数的 this 是什么</font>
            </summary>

* 对于普通函数来说,this->window
* 对于对象来说,谁调用函数谁就是this
* new 的方式,this永远被绑定在实例上
* bind/call/apply对于这些函数来说，this 取决于第一个参数，如果第一个参数为空，那么就是 window
* 不管给函数 bind 几次，function中的 this 永远由第一次 bind 决定
* 箭头函数本身是没有this
* 箭头函数中的this取决于包裹箭头函数的第一个普通函数的this
* 箭头函数使用bind,call,this无效

**一个笔试题**
```js
let obj2 = {
    name: 'obj2'
}

const obj = {
    name: 'obj',
    say1() {
        console.log(this.name)
    },
    obj1: {
        name: 'obj1',
        say2() {
            console.log(this.name);
        }
    },
    say3() {
        const fn = () => {
            console.log(this.name);
        }
        fn()
    },
    say4() {
        const fn = function () {
            console.log(this.name);
        }
        fn()
    },
    say5() {
        const fn = () => {
            console.log(this.name);
        }
        fn.call(obj2)
    },
    say6() {
        const fn = function () {
            console.log(this.name);
        }
        fn.call(obj2)
    }
}

let a = obj.say1
let b = obj.obj1.say2
a() 
b()
obj.say1()
obj.obj1.say2()
obj.say3()
obj.say4()
obj.say5()
obj.say6()
```
结果
```js
undefined
undefined
obj
obj1
obj
undefined
obj
obj2
```
</details>
        </li>
                <li>
        <details>
            <summary>
            <font color='3eaf7c'>== 和 === 有什么区别</font>
            </summary>

**==**
* 首先会判断两者类型是否相同。相同的话就直接进行比较
* 如果对比双方的类型不一样的话，就会进行类型转换
* null 与 undefined : true
* string 与 number : string->number
* 其中一方为 boolean:boolean -> number
* object 与 string、number、symbol : object -> 原始值类型

**===**
* 判断两者类型和值是否相同,都相同则`true`

</details>
        </li>
                <li>
        <details>
            <summary>
            <font color='3eaf7c'> 什么是闭包,其特点与缺点</font>
            </summary>

**1.简单定义**

`闭包`就是能够读取其它函数内部变量的函数

**2.使用场景**

* 需要重用一个变量,又要保护变量不会被污染
* 将一个变量长期驻扎在内存当中可用于循环取值
* 私有变量计数器,外部无法访问,避免全局变量额污染

**3.特点**

参数与变量不会被垃圾回收机制回收

**4.与作用域相比较**
* 全局变量
  * 优:可重用
  * 缺:容易污染
* 局部变量
  * 优:不会被污染,仅函数内部可用
  * 缺:不可重用

**5.缺点**
* 比普通函数占用更多的内存。
* 内存泄漏的影响，当内存泄漏到一定程度会影响你的项目运行变得卡顿等等问题
* 释放方法:将引用内层函数对象的变量赋值为null

</details>
        </li>
        <li>
        <details>
            <summary>
            <font color='3eaf7c'>浅拷贝/深拷贝是什么,如何实现?</font>
            </summary>

**浅拷贝**
* 只拷贝一层,深层次的对象只能拷贝对象的引用

**浅拷贝实现**
* `Object.assign`
* 展开运算符`...`

**深拷贝**
* 完整的拷贝一个深层次的对象

**深拷贝实现**
>面试中一般不会考虑过多的边界问题,一般考查递归实现一个能够拷贝对象与数组混合的对象
* JSON.parse(JSON.stringify(object))
  * 忽略undefined
  * 忽略symbol
  * 不能序列化函数
  * 不能解决循环引用的对象
* 递归实现deepClone

</details>
        </li>
        <li>
        <details>
            <summary>
            <font color='3eaf7c'>Promise 有几种状态,分别是什么</font>
            </summary>

三种状态
* pending:等待
* resolved:完成
* rejectde:拒绝

一旦从等待状态变成为其他状态就永远不能更改状态

</details>
        </li>
        <li>
        <details>
            <summary>
            <font color='3eaf7c'>你了解async/await吗,简单描述一下</font>
            </summary>

* 特点
  *  一个函数如果加上async 那么其返回值是Promise,async 就是将函数返回值使用 Promise.resolve() 进行包裹
  * await只能配合async使用 不能单独使用
* 优点
  * 相比于Promise来说优势在于能够写出更加清晰的调用链
* 缺点
  * 因为await将异步代码变成了同步代码,如果多个异步之间没有关系,会导致性能降低
* 原理
  * await 就是 generator 加上 Promise 的语法糖，且内部实现了自动执行 generator

</details>
        </li>
        <li>
        <details>
            <summary>
            <font color='3eaf7c'>事件的触发过程是怎么样的</font>
            </summary>

事件触发有三个阶段:
* 捕获阶段
* 目标阶段
* 冒泡阶段

</details>
        </li>
        <li>
        <details>
            <summary>
            <font color='3eaf7c'>什么是事件代理</font>
            </summary>

如果一个节点中的子节点是动态生成的，那么子节点需要注册事件的话应该注册在父节点上
* 节省内存,不需要给每个子节点注册一次
* 不需要给子节点注销事件

</details>
        </li>
        <li>
        <details>
            <summary>
            <font color='3eaf7c'>什么是同源策略,什么是跨域,如何解决</font>
            </summary>

浏览器有`同源策略`,如果:`协议`,`端口`,`域名`有一个不同就是`跨域`

**解决方法**
* jsonp
* 服务端开启CROS支持
* Nginx反向代理

</details>
        </li>
        <li>
        <details>
            <summary>
            <font color='3eaf7c'>你知道什么是预检请求吗</font>
            </summary>

使用后端开启CROS解决跨域的方式，会把请求分成两种类型:
* 简单请求
* 复杂请求

对于复杂请求，首先会发起一个预检请求,请求方法为options,通过该请求来判断服务器是否允许跨域

</details>
        </li>
        <li>
        <details>
            <summary>
            <font color='3eaf7c'>你知道什么是event loop,简单描述一下</font>
            </summary>

>执行 JS 代码的时候其实就是往执行栈中放入函数,当遇到异步的代码时，会被挂起并在需要执行的时候加入到 Task（有多种 Task） 队列中,一旦执行栈为空，Event Loop 就会从 Task 队列中拿出需要执行的代码并放入执行栈中执行

**Event Loop执行顺序**
* 同步代码
* 执行完所有同步代码后，执行栈为空，查询是否有异步代码需要执行
* 执行 微任务,如果在执行microtask的过程中，又产生了microtask，那么会加入到队列的末尾，也会在这个周期被调用执行
* 执行完所有微任务后，如有必要会渲染页面:
  * 判断document是否需要更新:浏览器是 60Hz 的刷新率，每 16.6ms 才会更新一次。
  * 判断是否有 resize 或者 scroll 事件，有的话会去触发事件:所以 resize 和 scroll 事件也是至少 16ms 才会触发一次，并且自带节流功能。
  * 判断是否触发了 media query
  * 更新动画并且发送事件
  * 判断是否有全屏操作事件
  * 执行 requestAnimationFrame 回调
  * 更新界面
* 然后开始下一轮 Event Loop，执行宏任务中的异步代码，也就是 setTimeout 中的回调函数

**总结**
* 宏队列macrotask一次只从队列中取一个任务执行，执行完后就去执行微任务队列中的任务
* 微任务队列中所有的任务都会被依次取出来执行，直到microtask queue为空
* 只要执行UI rendering，它的节点是在执行完所有的microtask之后，下一个macrotask之前，紧跟着执行UI render

**微任务**
* promise
* MutationObserver
* process.nextTick（node）

**宏任务**
* script
* xhr
* setTimeout
* setInterval
* setImmediate(node)
* requestAnimationFrame(浏览器)
* I/O
* UI rendering(浏览器)

</details>
        </li>
                <li>
        <details>
            <summary>
            <font color='3eaf7c'>var、let 及 const 区别</font>
            </summary>

全局作用域下:
  * 使用 var 声明的变量会被挂载到window上
  * 使用 let 和 const 声明的变量，不会被挂载到 window 上
  * 使用 var 声明的变量会被提升到作用域的顶部,函数也会被提升，并且优先于变量提升

let 与 const 不能在声明前就使用,作用基本一致,后者声明的变量不能再次赋值

</details>
        </li>
        <li>ES6有哪些新特性,你了解到的</li>
    </ol>
</details>

<details>
    <summary>
    <font color='3eaf7c'>
        <h2 style='display:inline'>5.CSS</h2>
    </font>
    </summary>
    <ol>
        <li>
        <details>
            <summary>
                <font color='3eaf7c'>
                    什么是回流与重绘
                </font>
            </summary>

**回流**

计算可见的Dom节点在设备视口的位置和尺寸,这个计算阶段就是`回流`

为了知道每个可见节点在视口的确切大小和位置,浏览器从渲染树的根节点进行遍历

**重绘**

经过生成的渲染树和回流阶段,得到了所有可见节点具体的几何信息与样式,然后将渲染树的每个节点转换成屏幕上的实际像素,这个阶段就叫`重绘`节点
    
</details>
        </li>
        <li>
        <details>
            <summary>
                <font color='3eaf7c'>
                    CSS层级关系
                </font>
            </summary>

**权重**
* tag(标签选择器):1
* class(类选择器):10
* id(id选择器):100
* tag行内样式:1000
* !important最大

权重一样的情况下,后声明的覆盖前面的

 </details>
        </li>
        <li>
        <details>
            <summary>
                <font color='3eaf7c'>
                    你了解BFC吗,如何触发
                </font>
            </summary>
BFC规范(块级格式化上下文：block formatting context)

* 规定了内部的Block Box如何布局:内部的Box会在垂直方向上一个接一个放置
* Box垂直方向的距离由margin决定
* 每个元素的margin box 的左边，与包含块border box的左边相接触
* BFC的区域不会与float box重叠
* 属于同一个BFC的两个相邻Box的margin会发生重叠
* 计算BFC的高度时，浮动元素也会参与计算
* 隔离的独立容器，容器里面的子元素不会影响到外面的元素

**如何触发**
* float值不为none
* overflow不为visible
* display的值为inline-block、table-cell、table-caption
* position的值为absolute或fixed

</details>
        </li>
        <li>弹性布局flex</li>
        <li>栅栏布局grid</li>
        <li>display属性值有哪些,分别是什么作用</li>
        <li>position属性值有哪些,分别有什么作用</li>
        <li>display:none,opactiy:0,visibility:hidden区别</li>
    </ol>
</details>

<details>
    <summary>
    <font color='3eaf7c'>
        <h2 style='display:inline'>6.VUE</h2>
    </font>
    </summary>
    <ol>
        <li>数据双向绑定,数据响应式实现的原理</li>
        <li>生命周期</li>
        <li>组件之间通信方法(父子,兄弟,祖孙,任意)</li>
        <li>v-if,v-show异同</li>
        <li>路由原理,为什么地址发生改变,浏览器不会刷新</li>
        <li>权限管理</li>
    </ol>
</details>
<details>
    <summary>
    <font color='3eaf7c'>
        <h2 style='display:inline'>7.浏览器相关问题</h2>
    </font>
    </summary>
    <ol>
        <li>缓存机制</li>
        <li>页面渲染原理(过程)</li>
        <li>本地存储</li>
        <li>浏览器安全相关问题(SQL注入,XSS,CSRF,DNS劫持,点击劫持)</li>
    </ol>
</details>
<details>
    <summary>
    <font color='3eaf7c'>
        <h2 style='display:inline'>8.性能优化</h2>
    </font>
    </summary>
    <ol>
        <li>Webpack代码打包优化</li>
        <li>网络层面优化</li>
        <li>首屏加载优化</li>
    </ol>
</details>
<details>
    <summary>
    <font color='3eaf7c'>
        <h2 style='display:inline'>9.小程序</h2>
    </font>
    </summary>
    <ol>
        <li>小程序的特点</li>
        <li>你对小程序的发展看法</li>
        <li>小程序的原理</li>
        <li>小程序与传统移动端Web的区别</li>
    </ol>
</details>

*因篇幅有限,内容太多,部分未回答的内容与6-9部分的题目回答,都整理在了我的→[博客](https://sugarat.top)←中,欢迎大家戳链接查看*

>下面分享(水货)一下个人是如何跳进前端这个"坑"
# 在校经历
专业是"计算机科学与技术",学院的培养方向为嵌入式开发工程师,在上大学前,想的学计算机学做游戏,大一开学后的新生研讨课就直接来了当头一棒,专业只教嵌入式相关知识

我想嵌入式就嵌入式嘛,哪晓得培养计划也太落后了,全是理论课,实验课也是给个试验箱,比着实验报告一步步做,啥东西都学不到.跟我想象中的(智能电子设备开发)差太远了,然后就自学U3D去了,学了几个月听说独立游戏开发没有"钱途",就刹车了,刚好学校有个软件开发的比赛,跟同学组了个队就参加了,三个人(1划水,1JAVA,我就只好搞前端了),这一搞就覆水难收了,从此踏上前端不归路

最开始学的东西非常杂,周围也没有前端大佬,自己摸索着学习,走了不少弯路,接了不少商业外包和学校的比赛项目,导致后端技术也蹭蹭蹭的学了不少,但还没有一个深入的点,大二的时候就在考虑到底做后端还是前端亦或是"伪全栈(会写页面+CRUD)",后来思考了一段时间选择了前端,觉得前端更容易出成果,更容易实现自己的想法,然后开始系统性的学习前端

在大三的时候开始准备复习春招找工作,看了看牛客上的面经,发现好多技术名词都不知道,很多点自己都还不会,被做项目的能力迷惑了,心想凉了,自己开始慌了,然后把手里的项目加急赶完,然后杜绝一切外包和学校的项目,开始紧张的复习

**比较喜欢的一句鸡汤**

<center><h2>你的指尖,拥有改变世界的力量</h2></center>

当没有学习动力的时候,默念几遍鸡汤,想想未来的规划,然后就又充满学习的激情了

# 最后
感谢掘金的各位大佬,是大佬们分享的经验把我抬进大厂的,
非常感谢阿里淘系的面试官提的建议,及时指出了我面试中的一些问题,最终虽然没有通过阿里的面试,但受益匪浅,依旧感到非常幸运

# 最最后
第一次在掘金发文,大伙给个赞呗,我想'薅'掘金的羊毛

**个人站点**
* [Github](https://github.com/ATQQ)
* [博客](https://sugarat.top)
* [博客园](https://www.cnblogs.com/roseAT/)

<comment/>
<tongji/>