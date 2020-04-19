function jsSidebar(group, introduction) {
    return [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
                ['es6', 'ees6面试题'],
                ['primitiveType', '原始类型有哪些'],
                ['nullobj', 'null是对象吗'],
                ['numNotEqual', '为什么0.1+0.2!=0.3'],
                ['objDiffPrim', '对象类型与原始类型的不同之处'],
                ['objparam', '函数参数是对象会发生什么问题'],
                ['typeof', 'typeof能否正常判断类型'],
                ['instanceof', 'instanceof能正确判断类型的原因是什么'],
                ['this', '如何正确判断this'],
                ['equal', '==与===有什么区别'],
                ['copy', '浅拷贝与深拷贝'],
                ['module', '为什么要使用模块化？都有哪几种方式可以实现模块化，各有什么特点？'],
                ['closure', '什么是闭包?'],
                ['promise', 'Promise 的特点与优缺点？什么是 Promise 链？Promise 构造函数执行和 then 函数执行有什么区别？'],
                ['asyncawait', 'async 及 await 的特点与优缺点？await 原理是什么？'],
                ['new', 'new 的原理是什么？通过 new 的方式创建对象和通过字面量创建有什么区别'],
                ['v8garbage', 'V8 下的垃圾回收机制是怎么样的'],
                ['event', 'V8 事件触发过程是怎么样的,什么是事件代理']
            ]
        }
    ]
}

function otherSidebar(group, introduction) {
    let res = [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
                ['engineering', '前端工程化'],
                ['inputurl', '输入URL到页面渲染的整个过程发生了什么?'],
                ['primitive', '原始类型有哪几种？null 是对象嘛？'],
                ['object', '对象类型和原始类型的不同之处？函数参数是对象会发生什么问题？'],
                ['judgeType', 'typeof 是否能正确判断类型？instanceof 能正确判断对象的原理是什么？'],
                ['prototype', '如何理解原型？如何理解原型链？'],
                ['promote', '什么是提升？什么是暂时性死区？var、let 及 const 区别？'],
                ['inherit', '原型如何实现继承？Class 如何实现继承？Class 本质是什么？']
            ]
        }
    ]
    addChildNums(res)
    return res;
}

function internetSidebar(group, introduction) {
    return [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
                ['cros', '同源策略,跨域,解决跨域的方式,同源策略']
            ]
        }
    ]
}
function cssSidebar(group, introduction) {
    return [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
                ['display', 'display属性有哪些,作用分别是什么'],
                ['position', 'position的值有哪些,作用分别是什么']
            ]
        }
    ]
}
function miniSidebar(group, introduction) {
    return [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
                ['feature', '小程序的特点'],
                ['principle', '小程序的原理'],
                ['differentweb', '与传统移动web的异同']
            ]
        }
    ]
}


function performanceSidebar(group, introduction) {
    return [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
                ['firstScreenRender', '如何加快首屏渲染']
            ]
        }
    ]
}

function experienceSidebar(group, introduction) {
    return [
        {
            title: group,
            collapsable: false,
            sidebarDepth: 2,
            children: [
                ['', introduction],
                ['tencent-video1', '腾讯视频一面'],
                ['tencent-video2', '腾讯视频二面'],
                ['tencent-video3', '腾讯视频三面'],
                ['tencent2-video1', '腾讯一面'],
                ['meituan-dd', '美团点评一,二,HR面'],
                ['baidu', '百度一,二,三技术面'],
                ['mogu', '蘑菇街一面'],
                ['wy-1', '网易云音乐一面'],
                ['thoughtWorks', '思特沃克初试+复试'],
                ['2020spring_wechat', '2020前端春招经验分享']
            ]
        }
    ]
}

/**
 * 为侧边导航栏目加上序号
 * @param {Object} res 
 */
function addChildNums(res) {
    res[0].children.forEach((v, i) => {
        if (i > 0) {
            v[1] = `${i}.${v[1]}`
        }
    })
    return res;
}

const { NavSider } = require('./object')

const interviewSider = new NavSider('interview')
interviewSider.addChildSider('js', jsSidebar('JsInterview', 'js面试题'))
interviewSider.addChildSider('other', otherSidebar('other', '前端面试综合问题'))
interviewSider.addChildSider('internet', internetSidebar('Internet', '网络相关面试题'))
interviewSider.addChildSider('css', cssSidebar('CSS', 'CSS相关面试题'))
interviewSider.addChildSider('mini', miniSidebar('Mini Program', '小程序相关面试题'))
interviewSider.addChildSider('performance', performanceSidebar('Performance', '性能优化相关面试题'))
interviewSider.addChildSider('experience', experienceSidebar('Experience', '面经'))

module.exports = interviewSider.getSiders()