import type { PaginationProps } from "element-plus";
import type { ContainerLabel, ContainerOption } from "../markdown/plugins/container";
import type {
  Article,
  Author,
  Banner,
  Blogger,
  BodyBgImg,
  Breadcrumb,
  Category,
  CommentConfig,
  DocAnalysis,
  FooterInfo,
  FriendLink,
  Notice,
  Plugins,
  Post,
  Social,
  Tag,
  ThemeSetting,
  TopArticle,
  Wallpaper,
} from "./types/index";

export type * from "./types/index";

export interface TkThemeConfig {
  /**
   * 是否启用主题，如果为 false，则不会主题的 99% 功能，只保留永久链接、锚点滚动、深色、浅色模式过渡动画这三个功能，支持在首页 index.md 的 frontmatter 配置 tk.tkTheme
   *
   * @default true
   */
  tkTheme?: boolean;
  /**
   * 是否启用主题的首页风格，如果为 false，则首页还原到 vitepress 的默认首页，其他功能不变，支持在首页 index.md 的 frontmatter 配置 tk.tkHome
   *
   * @default true
   */
  tkHome?: boolean;
  /**
   * 是否启用锚点滚动功能，即阅读文章时，自动将 h1 ~ h6 标题添加到地址栏 # 后面
   *
   * @default true
   */
  anchorScroll?: boolean;
  /**
   * 深色、浅色模式切换时是否开启过渡动画
   *
   * @default true
   */
  viewTransition?: boolean;
  /**
   * 是否使用新版代码块样式，如果为 false 则使用官方默认样式。新版代码块支持折叠
   *
   * @default true
   */
  codeBlock?: boolean;
  /**
   * 首页卡片的位置排序，当设置了 `homeCardSort` 但没有全部补全，则剩余内容默认按照 `homeCardSort` 的顺序进行排序，支持在首页 index.md 的 frontmatter 配置 tk.homeCardSort
   *
   * @default '["topArticle", "category", "tag", "friendLink", "docAnalysis"]'
   */
  homeCardSort?: ("topArticle" | "category" | "tag" | "friendLink" | "docAnalysis")[];
  /**
   * 主题背景色，用于精选文章卡片的 top + sticky 功能和标签卡片的背景色，支持在首页 index.md 的 frontmatter 配置 tk.bgColor
   *
   * @default '["#e74c3c", "#409EFF", "#DAA96E", "#0C819F", "#27ae60", "#ff5c93", "#fd726d", "#f39c12", "#9b59b6"]'
   */
  bgColor?: string[];
  /**
   * 文章页的样式风格，default 为 Vitepress 原生风格，card 为单卡片风格，segment 为片段卡片风格，card-nav 和 segment-nav 会额外修改导航栏样式
   *
   * 支持在文章页的 frontmatter 配置 pageStyle，因此可以针对不同的文章页开启不同的样式风格
   *
   * @default 'default'
   */
  pageStyle?: "default" | "card" | "segment" | "card-nav" | "segment-nav";
  /**
   *  body 背景图片配置
   */
  bodyBgImg?: BodyBgImg;
  /**
   * 右下角的主题设置配置
   */
  themeSetting?: ThemeSetting;
  /**
   * 文章默认的作者信息，支持在文章页的 frontmatter 配置 author.[key]
   */
  author?: Author;
  /**
   * 首页 Banner 配置，支持在首页 index.md 的 frontmatter 配置，格式为 tk.banner.[key]
   */
  banner?: Banner;
  /**
   * 壁纸模式，在首页最顶部进入全屏后开启，仅当 banner.bgStyle = 'fullImg' 或 bodyBgImg.imgSrc 存在才生效，支持在首页 index.md 的 frontmatter 配置，格式为 tk.wallpaper.[key]。
   */
  wallpaper?: Wallpaper;
  /**
   * 文章列表配置，支持在首页 index.md 的 frontmatter 配置，格式为 tk.post.[key]
   */
  post?: Post;
  /**
   * 首页 Post 文章列表的分页配置，完全是 ElPagination 的 props，支持在首页文档 index.md 的 frontmatter 配置，格式为 tk.page.[key]
   */
  page?: Partial<PaginationProps>;
  /**
   * 博主信息，显示在首页左边第一个卡片，支持在首页 `index.md` 的 `frontmatter` 配置，格式为 `tk.blogger.[key]`
   */
  blogger?: Blogger;
  /**
   * 精选文章卡片配置，支持在首页 index.md 的 frontmatter 配置，格式为 tk.topArticle.[key]
   */
  topArticle?: TopArticle;
  /**
   * 分类卡片配置，支持在首页 index.md 的 frontmatter 配置，格式为 tk.category.[key]
   */
  category?: Category;
  /**
   * 标签卡片配置，支持在首页 index.md 的 frontmatter 配置，格式为 tk.tag.[key]
   */
  tag?: Tag;
  /**
   * 友情链接卡片配置，支持在首页 index.md 的 frontmatter 配置，格式为 tk.friendLink.[key]
   */
  friendLink?: FriendLink;
  /**
   * 站点信息卡片配置，支持在首页 index.md 的 frontmatter 配置，格式为 tk.docAnalysis.[key]
   */
  docAnalysis?: DocAnalysis;
  /**
   * 社交信息配置
   */
  social?: Social[];
  /**
   * 页脚配置
   */
  footerInfo?: FooterInfo;
  /**
   * 文章信息配置，支持在 frontmatter 配置，如果在首页（index.md），格式为 tk.article.[key]，如果在文章页（非 index.md），格式为 article.[key]
   */
  article?: Article;
  /**
   * 面包屑配置，支持在文章页的 frontmatter 配置 breadcrumb.[key]
   */
  breadcrumb?: Breadcrumb;
  /**
   * 公告配置
   */
  notice?: Notice;
  /**
   * 评论配置
   */
  comment?:
    | CommentConfig<"">
    | CommentConfig<"twikoo">
    | CommentConfig<"waline">
    | CommentConfig<"giscus">
    | CommentConfig<"artalk">
    | CommentConfig<"render">
    | boolean;
  /**
   * 内置 Vite 插件配置
   */
  vitePlugins?: Plugins;
  /**
   * markdown 插件列表，请不要在使用 vitepress.markdown.config 配置 md 插件，因为 config 是一个函数，vitepress 并没有做多个 config 合并，因此使用 vitepress.markdown.config 配置会覆盖主题内置 md 插件
   */
  markdownPlugins?: any[];
  /**
   * 内置 markdown 容器的 Label 配置
   */
  containerLabel?: ContainerLabel;
  /**
   * 自定义 markdown 容器配置
   */
  markdownContainers?: ContainerOption[];
}
