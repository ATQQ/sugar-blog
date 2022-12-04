import Valine from "valine";

export default {
  init() {
    const pathname = window.location.pathname
    const $comment = document.querySelector('#valine-comment')
    $comment.innerHTML = ''
    const $comments = document.createElement('div')
    $comments.id = 'comments'
    const $pathname = document.createElement('span')
    $pathname.id = pathname
    $pathname.setAttribute('data-flag-title', document.title)
    $pathname.innerHTML = `
        <em class="post-meta-item-text"
        >阅读量：</em
      >
      <i
        class="leancloud-visitors-count"
      ></i>
        `
    $comment.appendChild($comments)
    // $comment.appendChild($pathname)
    setTimeout(() => {
      new Valine({
        el: "#comments",
        appId: "L3HgpT2JA3KJFUots3ql2AAd-gzGzoHsz",
        appKey: "cmU9sBLuIqYl5QLS1aCYIKzK",
        placeholder: "请在此处留下你的评论(支持markdown)",
        recordIP: true,
        visitor: true,
        path: pathname,
        avatar: "monsterid",
      });
    }, 2000)
  }
}