module.exports = {
    root: 'computerBase',
    children: [
        ['offer', '剑指Offer', '简介'],
        ['os', 'OS', '操作系统', [
            ['process', '进程'],
            ['thread', '线程'],
            ['difprothr', '进程与线程的区别'],
            ['communicate', '进程和线程怎么通信'],
            ['deadlock', '死锁']
        ]],
        ['Internet', 'Internet', '计算机网络', [
            ['udp', 'UDP协议'],
            ['tcp', 'TCP协议'],
            ['tcp-udp', 'TCP与UDP的区别'],
            ['http', 'HTTP协议'],
            ['clength', 'Content-Length']
        ]],
        ['design', 'Design Pattern', '设计模式', [
            ['factory', '工厂模式'],
            ['abstractfactory', '抽象工厂模式'],
            ['single', '单例模式']
        ]],
        ['algorithm', 'Algorithm And Data', '算法与数据结构'],
    ],
}