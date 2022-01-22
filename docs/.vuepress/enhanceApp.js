export default ({
    router, // 当前应用的路由实例
}) => {
    // 解决中文路由无法被正确加载的问题
    router.beforeEach((to, from, next) => {
        if (decodeURIComponent(to.path) !== to.path) {
            return next({
                ...to,
                path: decodeURIComponent(to.path),
                fullPath: decodeURIComponent(to.fullPath)
            })
        }
        next()
    })
}