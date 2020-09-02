export default {
    init() {
        const tj = document.querySelector('#cnzz');
        const span = document.createElement("span");
        span.id = "cnzz_stat_icon_1279199338";
        const script = document.createElement("script");
        script.src =
            "https://v1.cnzz.com/z_stat.php?id=1279199338&online=1&show=line";
        script.type = "text/javascript";
        tj.append(span);
        tj.append(script);
        const hidden = !location.pathname.endsWith("/");
        if (hidden) {
            tj.className += ' hidden-tj'
        }
    }
}