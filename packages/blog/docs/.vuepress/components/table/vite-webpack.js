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
    name: 'vite-webpack',
    th: ['类型', '图解','代表产品'],
    td: [
        tdItem(
            'Bundle',
            img('https://img.cdn.sugarat.top/mdImg/MTYzODYwMzMyMzA1NA==638603323054'),
            'Webpack'
        ),
        tdItem(
            'Native ESM',
            img('https://img.cdn.sugarat.top/mdImg/MTYzODYwMzQ1NDQwOQ==638603454409'),
            'Vite，Snowpack'
        ),
    ]
}