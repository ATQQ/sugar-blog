---
title: 模板工程搭建：Vite-Vue3工程化模板
date: 2021-05-16
tags:
 - 技术笔记
 - 工程模板
categories:
 - 技术笔记
---
# 开箱即用的Vite-Vue3工程化模板
## 前言
由于临近毕业肝[毕设](https://ep2.sugarat.top)和论文，停更有一段时间了，不过好在终于肝完了大部分内容，只剩下校对工作

毕设采用技术栈Vue3，Vite，TypeScript，Node，开发过程中产出了一些其它的东西，预计会出一系列的文章进行介绍

废话不多了步入正题...

## 体验模板
>[模板仓库地址](https://github.com/ATQQ/vite-vue3-template)
><br>[线上预览](https://vite-vue3-template-2d76i8beae2d0-1256505457.tcloudbaseapp.com/)


两步到位
### 本地引入
```sh
# 方法一
npx degit atqq/vite-vue3-template#main my-project

cd my-project
```

```sh
# 方法二
git clone https://github.com/ATQQ/vite-vue3-template.git

cd vite-vue3-template
```

### 启动
```sh
# 安装依赖
yarn install
```

```sh
# 运行
yarn dev
```

## 模板介绍
### 已包含特性
* [x] [vite](https://github.com/vitejs/vite)
* [x] [vue3](https://v3.vuejs.org/)
* [x] [@vue/compiler-sfc](https://github.com/vuejs/rfcs/pull/227)
* [x] [TypeScript](https://github.com/microsoft/TypeScript/#readme)
* [x] [Vuex4.x](https://github.com/vuejs/vuex#readme)
* [x] [Vue-Router4.x](https://next.router.vuejs.org/)
* [x] [Axios](https://github.com/axios/axios)
* [x] [Provide/inject](https://v3.vuejs.org/guide/component-provide-inject.html#provide-inject)
* [x] [polyfill.io](https://github.com/Financial-Times/polyfill-service)
* [x] [Element UI Plus](https://github.com/element-plus/element-plus)
* [x] [Sass](https://github.com/sass/sass)
* [x] [Eslint](https://eslint.org/)
* [x] [Jest](https://jestjs.io/)
* [x] [Tencent CloudBase static page](https://cloud.tencent.com/document/product/876/40270)
* [x] [Tencent CloudBase Github Action](https://github.com/marketplace/actions/tencent-cloudbase-github-action)

内置了常见的工程化项目所用的内容，后文只对其中的一些特性做简单介绍
### 目录介绍
```sh
.
├── __tests__
├── dist    # 构建结果
├── public  # 公共静态资源
├── src     # 源码目录
│   ├── apis
│   ├── assets
│   ├── components
│   ├── pages
│   ├── router
│   ├── store
│   ├── @types
│   ├── utils
│   ├── shims-vue.d.ts
│   ├── env.d.ts
│   ├── main.ts
│   └── App.vue
├── README.md
├── index.html    # 应用入口
├── jest.config.ts
├── LICENSE
├── package.json
├── tsconfig.json
├── cloudbaserc.json  # 腾讯云CloudBase相关配置文件
├── vite.config.ts  # vite配置文件
└── yarn.lock
```

### Vite
Vite有多牛牪犇，我就不赘述了
<details>
<summary>简单的vite.config.ts配置文件</summary>

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  build: {
    target: 'modules', // 默认值
    // sourcemap: true,
  },
  server: {
    port: 8080,
    proxy: {
      '/api/': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ''),
      },
      '/api-prod/': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api-prod/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
    },
  },
})

```
</details>

### @vue/compiler-sfc
这个就是前段时间比较争议的一个提案，不过真香，[进一步了解](https://github.com/vuejs/rfcs/pull/227)

### Vuex
采用分业务模块的方案

目录结构
```sh
src/store/
├── index.ts
└── modules
    └── module1.ts
```

<details>
<summary>module1.ts</summary>

```ts
import { Module } from 'vuex'

interface State {
  count: number
}

const store: Module<State, unknown> = {
  namespaced: true,
  state() {
    return {
      count: 0,
    }
  },
  getters: {
    isEven(state) {
      return state.count % 2 === 0
    },
  },
  // 只能同步
  mutations: {
    increase(state, num = 1) {
      state.count += num
    },
    decrease(state) {
      state.count -= 1
    },
  },
  // 支持异步,可以考虑引入API
  actions: {
    increase(context, payload) {
      context.commit('increase', payload)
      setTimeout(() => {
        context.commit('decrease')
      }, 1000)
    },
  },
}

export default store

```
</details>

<details>
<summary>index.ts</summary>

```ts
import { createStore } from 'vuex'
import module1 from './modules/module1'

// Create a new store instance.
const store = createStore({
  modules: {
    m1: module1,
  },
})

export default store
```

</details>

main.ts中引入
```ts
import store from './store'
app.use(store)
```

视图中调用
```ts
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

// state
const count = computed(() => store.state.m1.count)
// getters
const isEven = computed(() => store.getters['m1/isEven'])
// mutations
const add = () => store.commit('m1/increase')
// actions
const asyncAdd = () => store.dispatch('m1/increase')
```

### Vue-Router
目录结构
```sh
src/router/
├── index.ts
├── Interceptor
│   └── index.ts
└── routes
    └── index.ts
```
拦截器与页面路由相分离

<details>
<summary>Interceptor/index.ts</summary>

```ts
import { Router } from 'vue-router'

declare module 'vue-router' {
    interface RouteMeta {
        // 是可选的
        isAdmin?: boolean
        // 是否需要登录
        requireLogin?: boolean
    }
}

function registerRouteGuard(router: Router) {
  /**
     * 全局前置守卫
     */
  router.beforeEach((to, from) => {
    if (to.meta.requireLogin) {
      if (from.path === '/') {
        return from
      }
      return false
    }
    return true
  })

  /**
     * 全局解析守卫
     */
  router.beforeResolve(async (to) => {
    if (to.meta.isAdmin) {
      try {
        console.log(to)
      } catch (error) {
        // if (error instanceof NotAllowedError) {
        //     // ... 处理错误，然后取消导航
        //     return false
        // } else {
        //     // 意料之外的错误，取消导航并把错误传给全局处理器
        //     throw error
        // }
        console.error(error)
      }
    }
  })

  /**
     * 全局后置守卫
     */
  router.afterEach((to, from, failure) => {
    // 改标题,监控上报一些基础信息
    // sendToAnalytics(to.fullPath)
    if (failure) {
      console.error(failure)
    }
  })
}

export default registerRouteGuard
```

</details>

<details>
<summary>routes/index.ts</summary>

```ts
import { RouteRecordRaw } from 'vue-router'
import Home from '../../pages/home/index.vue'
import About from '../../pages/about/index.vue'
import Dynamic from '../../pages/dynamic/index.vue'

const NotFind = () => import('../../pages/404/index.vue')
const Index = () => import('../../pages/index/index.vue')
const Axios = () => import('../../pages/axios/index.vue')
const Element = () => import('../../pages/element/index.vue')
const routes: RouteRecordRaw[] = [
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFind },
  {
    path: '/',
    name: 'index',
    component: Index,
    children: [
      { path: 'home', component: Home, name: 'home' },
      { path: 'about', component: About, name: 'about' },
      { path: 'axios', component: Axios, name: 'axios' },
      { path: 'element', component: Element, name: 'element' },
      {
        path: 'dynamic/:id',
        component: Dynamic,
        meta: {
          requireLogin: false,
          isAdmin: true,
        },
        name: 'dynamic',
      },
    ],
  },
]

export default routes
```

</details>

<details>
<summary>router/index.ts</summary>

```ts
import { createRouter, createWebHistory } from 'vue-router'
import registerRouteGuard from './Interceptor'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_ROUTER_BASE as string),
  routes,
})

// 注册路由守卫
registerRouteGuard(router)

export default router
```

</details>

main.ts中引入
```ts
import router from './router'
app.use(router)
```

### Axios
对axios的简单包装

<details>
<summary>ajax.ts</summary>

```ts
import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_AXIOS_BASE_URL,
})

/**
 * 请求拦截
 */
instance.interceptors.request.use((config) => {
  const { method, params } = config
  // 附带鉴权的token
  const headers: any = {
    token: localStorage.getItem('token'),
  }
  // 不缓存get请求
  if (method === 'get') {
    headers['Cache-Control'] = 'no-cache'
  }
  // delete请求参数放入body中
  if (method === 'delete') {
    headers['Content-type'] = 'application/json;'
    Object.assign(config, {
      data: params,
      params: {},
    })
  }

  return ({
    ...config,
    headers,
  })
})

/**
 * 响应拦截
 */
instance.interceptors.response.use((v) => {
  if (v.data?.code === 401) {
    localStorage.removeItem('token')
    // alert('即将跳转登录页。。。', '登录过期')
    // setTimeout(redirectHome, 1500)
    return v.data
  }
  if (v.status === 200) {
    return v.data
  }
  // alert(v.statusText, '网络错误')
  return Promise.reject(v)
})
export default instance
```
</details>

api目录结构
```sh
src/apis/
├── ajax.ts
├── index.ts
└── modules
    └── public.ts
```
分业务模块编写接口调用方法，通过**apis/index.ts**对外统一导出
```ts
export { default as publicApi } from './modules/public'
```
注入全局的Axios实例，Vue2中通常是往原型（prototype）上挂载相关方法，在Vue3中由于使用CreateApp创建实例，所以推荐使用provide/inject 来传递一些全局的实例或者方法

main.ts
```ts
import Axios from './apis/ajax'

const app = createApp(App)

app.provide('$http', Axios)
```

视图中使用
```ts
import { inject } from 'vue'

const $http = inject<AxiosInstance>('$http')
```

### polyfill.io
部分浏览器可能对ES的新语法支持程度不一致，存在一定的兼容问题，此时就需要使用polyfill(垫片)

polyfill.io是一个垫片服务，直接通过cdn按需引入垫片，不影响包体积

工作原理是通过解析客户端的UA信息，然后根据查询参数，判断是否需要垫片，不需要则不下发

简单使用
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <link rel="icon" href="/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vite App</title>
  <script
    src="https://polyfill.alicdn.com/polyfill.min.js?features=es2019%2Ces2018%2Ces2017%2Ces5%2Ces6%2Ces7%2Cdefault"></script>
</head>

<body>
  <div id="app"></div>
  <script type="module" src="/src/main.ts"></script>
</body>

</html>
```

查询参数在线生成->[url-builder](https://polyfill.io/v3/url-builder/)

由于官方服务是部署在非大陆，所以延迟较高，由于[polyfill-service](https://github.com/Financial-Times/polyfill-service)是开源的，所以可以自己进行搭建

国内大厂也有一些镜像:
* https://polyfill.alicdn.com/polyfill.min.js
* https://polyfill.meituan.com/polyfill.min.js

### element UI Plus
Vue3版本的Element UI 组件库，虽然有些坑，但勉强能用 O(∩_∩)O哈哈~

按需引入在使用过程中发现Dev和Prod环境下的样式表现有差异，固采用全量引入的方式

utils/elementUI.ts
```ts
import { App } from '@vue/runtime-core'

// 全量引入
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import 'dayjs/locale/zh-cn'
import locale from 'element-plus/lib/locale/lang/zh-cn'

export default function mountElementUI(app: App<Element>) {
  app.use(ElementPlus, { locale })
}
```

main.ts
```ts
import mountElementUI from './utils/elementUI'

mountElementUI(app)
```

