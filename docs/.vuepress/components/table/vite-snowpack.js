const link = (name, href) => {
    return {
        name,
        href
    }
}
const tdItem = (...rest) => rest
export default {
    name: 'vite-snowpack',
    th: ['名称', '定位','进一步介绍', '相关动态'],
    td: [
        tdItem(
            link('vite', 'https://github.com/vitejs/vite'),
            '下一代前端开发与构建工具',
            ['Dev：通过原生 ES 模块提供源文件的开发服务器，具有丰富的内置特性和快得惊人的模块热替换(HMR)','Prod：使用Rollup打包代码，预配置为输出高度优化后的静态资源。','此外，Vite 通过其插件 API 和 JavaScript API 具有高度的扩展性，并提供全面的类型支持。'],
            ['在有些人眼里 Vite 还很新，其实 npm 月下载量已经过百万了。','Vue 3 的官方工具链很快就会全面默认推荐 Vite','Nuxt 3 / Storybook 兼容 webpack / Vite','SvelteKit, Astro, Solid 等等新兴框架全部转向 Vite','Shopify 基于 React 的新框架 Hydrogen 也全面押注 Vite。']
        ),
        tdItem(
            link('snowpack', 'https://github.com/snowpackjs/snowpack'),
            'ESM驱动的前端构建工具',
            ['Dev：原生 ESM 开发服务器','Prod：认构建输出是未打包的，由实际使用的“优化器”做后续工作，以适应不同需求（ webpack, Rollup，甚至是 ESbuild）'],
            'Snowpack的作者 Fred K.Schott 表示已经没有精力去维护snowpack了，打算交给社区维护。'
        )
    ]
}