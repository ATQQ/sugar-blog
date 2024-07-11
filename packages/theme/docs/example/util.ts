import type { DefaultTheme } from 'vitepress/theme'

export function defineExamples(examples: IExample[]) {
  return examples.map((v) => {
    if (v.avatar.includes('//cdn.upyun.sugarat.top')) {
      v.avatar = `${v.avatar}-wh30`
    }
    return v
  })
}

type IExample = SiteInfo & Author
interface SiteInfo {
  /**
   * 站点封面
   */
  cover: string
  /**
   * 站点链接
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
  /**
   * 头像
   */
  avatar: string
  /**
   * 昵称
   */
  nickname: string
  /**
   * 个人主页（介绍页）
   */
  home?: string
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
