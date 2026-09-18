export default {
  paths: () => [
    { params: { title: '动态路由1', description: 'foo1 description', version: '1.0.0' }, content: '动态渲染内容1' },
    { params: { title: '动态路由2', description: 'foo1 descriptionxx', version: '2.0.0' }, content: '## 测试内容' },
  ],
  // VitePress 2 不会在 frontmatter 里插值 {{ $params }}，未加引号时还会被 YAML 解析成对象，导致 escapeHtml 崩溃
  transformPageData(pageData) {
    const { title, description } = pageData.params ?? {}
    if (title)
      pageData.title = title
    if (description)
      pageData.description = description
  }
}
