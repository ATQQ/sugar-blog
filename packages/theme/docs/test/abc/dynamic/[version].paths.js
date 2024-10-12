export default {
  paths: () => [
    { params: { title: 'foo1', description: 'foo1 description', version: '1.0.0' }, content: 'foo1 content' },
    { params: { title: 'foo2', description: 'foo1 descriptionxx', version: '2.0.0' }, content: '## 测试内容' },
    { params: { title: 'bar3', description: 'foo1 descriptionxx', version: '3.0.0' } },
    { params: { title: 'bar4', description: 'foo1 descriptionxx', version: '4.0.0' } }
  ]
}
