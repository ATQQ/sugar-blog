// 主题独有配置
import { getThemeConfig } from '@sugarat/theme/node';

// 详见文档: https://theme.sugarat.top/
const blogTheme = getThemeConfig({
  // 文章默认作者
  author: '粥里有勺糖',
  // 友链
  friend: [
    {
      nickname: '粥里有勺糖',
      des: '你的指尖用于改变世界的力量',
      avatar:
        'https://img.cdn.sugarat.top/mdImg/MTY3NDk5NTE2NzAzMA==674995167030',
      url: 'https://sugarat.top',
    },
    {
      nickname: 'Vitepress',
      des: 'Vite & Vue Powered Static Site Generator',
      avatar:
        'https://vitepress.dev/vitepress-logo-large.webp',
      url: 'https://vitepress.dev/',
    },
  ],
  // 开启离线的全文搜索支持（如构建报错可注释下面的配置再次尝试）
  search: 'pagefind',
  popover: {
    title: '公告',
    body: [
      {
        type: 'text',
        content:
          'QQ交流群：681489336 🎉🎉',
      },
      {
        type: 'text',
        content:
          '👇公众号👇---👇 微信 👇',
      },
      {
        type: 'image',
        src: 'https://img.cdn.sugarat.top/mdImg/MTYxNTAxODc2NTIxMA==615018765210',
      },
      {
        type: 'text',
        content:
          '欢迎大家加群&私信交流',
      },
      {
        type: 'button',
        content: '博客',
        link: 'https://sugarat.top',
      },
    ],
    duration: 0,
  },
});

export { blogTheme };
