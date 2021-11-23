const link = (name, url) => {
    return {
        name,
        url
    }
}
const tdItem = (...rest) => rest
export default {
    name: '校招 - 算法题 - 排序',
    th: ['题目', '学习资料', '在线练习'],
    td: [
        tdItem('快速排序', [
            link('坐在马桶上看算法：快速排序', 'https://pianshen.com/article/8324800316/'),
            link('漫画算法', 'https://mp.weixin.qq.com/s/PQLC7qFjb74kt6PdExP8mw'),
        ], link('题链', 'https://leetcode-cn.com/problems/sort-an-array/')),
        tdItem('冒泡排序', '-', link('题链', 'https://leetcode-cn.com/problems/sort-an-array/')),
        tdItem('选择排序', '-', link('题链', 'https://leetcode-cn.com/problems/sort-an-array/')),
        tdItem('堆排序', '-', link('题链', 'https://leetcode-cn.com/problems/sort-an-array/')),
        tdItem('插入排序', '-', link('题链', 'https://leetcode-cn.com/problems/sort-an-array/')),
    ]
}