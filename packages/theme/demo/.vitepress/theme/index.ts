import { BlogTheme, Theme } from '@sugarat/theme'
import { ElMessage } from 'element-plus'
import { h } from 'vue'

const AIWords = [
  '无论多么沉重的负担，也不要忘记微笑；无论多么漫长的路程，也不要忘记坚持',
  '生活的真谛不在繁华，而在于淡泊'
]

const homeProps: Theme.HomeConfig = {
  handleChangeSlogan() {
    ElMessage.success({
      message: '支持点击修改内容',
      duration: 888
    })
    return AIWords[Math.floor(Math.random() * AIWords.length)]
  }
}

export default {
  ...BlogTheme,
  Layout: h(BlogTheme.Layout, homeProps)
}
