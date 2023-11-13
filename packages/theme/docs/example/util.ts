import type { DefaultTheme } from 'vitepress/theme'

export function defineExamples(examples: IExample[]) {
  return examples.map((v) => {
    return {
      ...v,
      members: [v.author].flat().filter(Boolean)
    }
  })
}

interface IExample {
  /**
   * 博客信息
   */
  blog: BlogInfo
  /**
   * 作者信息
   */
  author?: Author
}
interface BlogInfo {
  /**
   * 博客封面
   */
  cover: string
  /**
   * 博客链接
   */
  link: string
  /**
   * 站点名称
   */
  name?: string
  /**
   * 站点介绍
   */
  desc?: string
}

interface Author {
  avatar: string
  name: string
  link?: string
}

interface TeamMember {
  // Avatar image for the member.
  avatar: string

  // Name of the member.
  name: string

  // Title to be shown below member's name.
  // e.g. Developer, Software Engineer, etc.
  title?: string

  // Organization that the member belongs.
  org?: string

  // URL for the organization.
  orgLink?: string

  // Description for the member.
  desc?: string

  // Social links. e.g. GitHub, Twitter, etc. You may pass in
  // the Social Links object here.
  // See: https://vitepress.dev/reference/default-theme-config.html#sociallinks
  links?: DefaultTheme.SocialLink[]

  // URL for the sponsor page for the member.
  sponsor?: string
}
