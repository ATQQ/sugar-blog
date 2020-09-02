import Valine from "valine";

export default {
    init() {
        const pathname = window.location.pathname
        document.querySelector('#pathname').id = pathname
        new Valine({
            el: "#comments",
            appId: "L3HgpT2JA3KJFUots3ql2AAd-gzGzoHsz",
            appKey: "cmU9sBLuIqYl5QLS1aCYIKzK",
            placeholder: "请在此处留下你的评论(支持markdown)",
            visitor: true,
            path: pathname,
            avatar: "monsterid",
        });
    }
}