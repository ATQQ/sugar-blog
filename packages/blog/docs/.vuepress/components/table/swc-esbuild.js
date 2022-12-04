const link = (name, href) => {
    return {
        name,
        href
    }
}

const tdItem = (...rest) => rest
export default {
    name: 'swc-esbuild',
    th: ['名称', '定位', '快的体现', '代码压缩', '代码转换', '替代Babel'],
    td: [
        tdItem(
            link('SWC', 'https://github.com/swc-project/swc'),
            ['SWC (stands for Speedy Web Compiler) ', '一个用 Rust 编写的超快的Typescript/JavaScript 编译器'],
            ['在单线程上，SWC 比 Babel 快20倍，在四核上快70倍', link('详细对比数据', 'https://swc.rs/docs/benchmarks')],
            '✅',
            '✅',
            '✅'
        ),
        tdItem(
            link('esbuild', 'https://github.com/evanw/esbuild'),
            '一个非常快的 JavaScript 和 CSS 的打包与压缩工具',
            ['vite：打包器预构建依赖比使用javascript快 10-100 倍。', link('详细对比数据', 'https://esbuild.github.io/faq/#benchmark-details')],
            '✅',
            '✅',
            '-'
        )
    ]
}