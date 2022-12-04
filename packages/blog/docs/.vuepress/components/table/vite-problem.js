const link = (name, href) => {
    return {
        name,
        href
    }
}
const img = (src)=>{
    return {
        src
    }
}
const tdItem = (...rest) => rest
export default {
    name: 'vite-problem',
    th: ['问题', '目的','说明'],
    td: [
        tdItem(
            '入口文件处理',
            '让Vite能在正常的webpack项目里工作',
            ['Vite 开发模式下，是一个服务器，其入口默认是根目录index.html，生产模式下，默认也使用 <root>/index.html 作为其构建入口点','webpack入口为JS，通过HtmlWepackPlugin与public下的模板进行关联']
        ),
        tdItem(
            '配置文件处理',
            '将工程里的webpack配置转换为vite配置',
            '针对业务框架，通常都会有一套自己的配置方案，此时Vite和webpack可以复用这一套配置，通过不同的适配器转换，进而应用到不同构建工具中'
        ),
        tdItem(
            '封装Vite相关能力，简化用户使用成本',
            '能力内置到CLI工具中，实现webpack工程的一键接入',
            'Vite支持通过命令行传参的方式指定配置文件的位置'
        )
    ]
}