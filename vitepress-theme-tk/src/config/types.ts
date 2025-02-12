import { PermalinkOption } from "vitepress-plugin-permalink";
import { SidebarOption } from "vitepress-plugin-sidebar-resolve";
import { CatalogueOption } from "vitepress-plugin-catalogue";
import { DocAnalysisOption } from "vitepress-plugin-doc-analysis";
import { ImageViewerProps, PaginationProps } from "element-plus";
import { VNode } from "vue";

export interface KtThemeConfig {
  /**
   * 是否启用主题
   * @default true
   */
  ktTheme?: boolean;
  /**
   * 外观切换时是否开启过渡动画
   */
  viewTransition?: boolean;
  /**
   * 文章默认的作者信息
   */
  author?: string | { name: string; link?: string };
  /**
   * 首页卡片的排序
   * @default '["topArticle", "category", "tag", "docAnalysis", "friendLink"]'
   */
  homeCardSort?: ("topArticle" | "category" | "tag" | "docAnalysis" | "friendLink")[];
  /**
   * 背景色
   * @default '["#e74c3c", "#409EFF", "#DAA96E", "#0C819F", "#27ae60", "#ff5c93", "#fd726d", "#f39c12", "#9b59b6"]'
   */
  bgColor?: string[];
  /**
   * 文章列表配置
   *
   */
  post?: {
    /**
     * 摘要位置
     * @default bottom
     */
    excerptPosition?: "top" | "bottom";
    /**
     * 是否显示更多按钮
     * @default true
     */
    showMore?: boolean;
    /**
     * 更多按钮文字
     * @default '阅读全文 >'
     */
    moreLabel?: string;
    /**
     * 文章封面图模式
     * @default 'default'
     */
    coverImgMode?: "default" | "large";
    /**
     * 文章信息图标是否显示
     * @default true
     */
    showIcon?: boolean;
    /**
     * 文章日期格式，首页和文章页解析日期时使用
     * @default 'yyyy-MM-dd'
     */
    dateFormat?: "yyyy-MM-dd" | "yyyy-MM-dd hh:mm:ss" | ((date: string) => string);
    /**
     * 是否展示作者、日期、分类、标签、字数、阅读时长、浏览量等基本信息，分别作用于首页和文章页
     * 如果 showBaseInfo 为数组，则控制在哪里显示，如 ["home"]，则只在首页显示基本信息；如果为 boolean 值，则控制基本信息是否展示，如 false，则在首页和文章页都不显示基本信息
     * @default true
     */
    showBaseInfo?: boolean | ("home" | "article")[];
    /**
     * 是否在摘要位置显示文章部分文字，当为 true 且不使用 frontmatter.describe 和 <!-- more --> 时，会自动截取前 400 个字符作为摘要
     * @default false
     */
    showCapture?: boolean;
  };
  /**
   * 是否使用主题模式切换功能
   * @default true
   */
  useThemeMode?: boolean;
  /**
   * 设置当前主题模式
   * @default 'vp-default'
   */
  themeMode?:
    | "vp-default"
    | "vp-green"
    | "vp-yellow"
    | "vp-red"
    | "el-blue"
    | "el-green"
    | "el-yellow"
    | "el-red"
    | string;
  /**
   * 自定义主题模式，将会追加到内置主题模式后面
   */
  themeModeAppend?: {
    /**
     * 主题组名称
     */
    label: string;
    /**
     * 主题组提示信息，鼠标悬停时显示
     */
    tip?: string;
    /**
     * 主题组内容
     */
    options: {
      /**
       * 主题名称，用于页面文字渲染
       */
      name: string;
      /**
       * 主题标识，在 html 标签的 theme 属性添加该标识
       */
      theme: string;
    }[];
  }[];
  /**
   * 是否使用主题尺寸切换功能
   * @default true
   */
  useThemeSize?: boolean;
  /**
   * 设置当前主题尺寸
   * @default 'default'
   */
  themeSize?: "small" | "default" | "large" | string;
  /**
   * 自定义主题尺寸，将会追加到内置主题尺寸后面
   */
  themeSizeAppend?: {
    /**
     * 主题尺寸名称，用于页面文字渲染
     */
    name: string;
    /**
     * 主题尺寸标识，在 html 标签的 size 属性添加该标识
     */
    size: string;
  }[];
  /**
   *  body 背景大图配置
   */
  bodyBgImg?: {
    /**
     * body 背景大图链接。单张图片 string | 多张图片 string[], 多张图片时每隔 imgInterval 秒换一张
     */
    imgSrc?: string | string[];
    /**
     * body 背景图透明度，选值 0.1 ~ 1.0
     * @default 1
     */
    imgOpacity?: 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1;
    /**
     * body 当多张背景图时（imgSrc 为数组），设置切换时间，单位：毫秒
     * @default 15000 (15秒)
     */
    imgInterval?: number;
    /**
     * body 背景图遮罩
     * @default false
     */
    mask?: boolean;
    /**
     * body 背景图遮罩颜色，如果为数字，则是 rgba(0, 0, 0, ${maskBg})，如果为字符串，则作为背景色。mask 为 true 时生效
     * @default 'rgba(0, 0, 0, 0.2)'
     */
    maskBg?: string | number;
  };
  /**
   * 首页 Banner 配置
   */
  banner?: {
    /**
     * 是否启用 Banner
     * @default true
     */
    enabled?: boolean;
    /**
     * Banner 背景风格：default 为纯色背景，bigImg 为大图背景，grid 为网格背景
     * @default 'default'
     */
    bgStyle?: "default" | "bigImg" | "grid";
    /**
     * Banner 背景色。bgStyle 为 default 时生效
     * @default '#e5e5e5'
     */
    defaultBgColor?: string;
    /**
     * Banner 大图链接。bgStyle 为 bigImg 时生效
     * @default []
     */
    imgSrc?: string | string[];
    /**
     * 当多张大图时（imgSrc 为数组），设置切换时间，单位：毫秒
     * @default 15000 (15秒)
     */
    imgInterval?: number;
    /**
     * Banner 大图遮罩，bgStyle 为 bigImg 时生效
     * @default true
     */
    mask?: boolean;
    /**
     * Banner 遮罩颜色，如果为数字，则是 rgba(0, 0, 0, ${maskBg})，如果为字符串，则作为背景色。bgStyle 为 bigImg 且 mask 为 true 时生效
     * @default 'rgba(0, 0, 0, 0.4)'
     */
    maskBg?: string | number;
    /**
     * Banner 字体颜色
     * @default bgStyle 为 default 时为 '#000000'，其他为 '#ffffff'
     */
    textColor?: string;
    /**
     * 标题字体大小
     * @default '3.2rem'
     */
    titleFontSize?: string;
    /**
     * 描述字体大小
     * @default '1.4rem'
     */
    descFontSize?: string;
    /**
     * 描述信息风格：default 为纯文字渲染风格（如果 description 为数组，则取第一个），types 为文字打印风格，switch 为文字切换风格
     * @default 'default'
     */
    descStyle?: "default" | "types" | "switch";
    /**
     * 描述信息
     * @default ''
     */
    description?: string | string[];
    /**
     * 描述信息切换间隔时间，单位：毫秒。descStyle 为 switch 时生效
     * @default 4000 (4秒)
     */
    switchTime?: number;
    /**
     * 输出一个文字的时间，单位：毫秒。descStyle 为 types 时生效
     * @default 200 (0.2秒)
     */
    typesInTime?: number;
    /**
     * 删除一个文字的时间，单位：毫秒。descStyle 为 types 时生效
     * @default 100 (0.1秒)
     */
    typesOutTime?: number;
    /**
     * 打字与删字的间隔时间，单位：毫秒。descStyle 为 types 时生效
     * @default 800 (0.8秒)
     */
    typesNextTime?: number;
  };
  /**
   * 面包屑配置
   */
  breadcrumb?: {
    /**
     * 是否启用面包屑
     * @default true
     */
    enabled?: boolean;
    /**
     * 面包屑最后一列是否显示当前文章的文件名
     * @default false
     */
    showCurrentName?: boolean;
    /**
     * 面包屑分隔符
     * @default '/'
     */
    separator?: string;
  };
  /**
   * 博主信息 (显示在首页侧边栏)
   */
  blogger?: {
    /**
     * 博主昵称
     */
    name: string;
    /**
     * 博主头像
     */
    avatar: string;
    /**
     * 博主签名
     */
    slogan?: string;
    /**
     * 头像风格：radius 为圆形头像，可支持鼠标悬停旋转，full 为方形头像
     * @default 'radius'
     */
    avatarStyle?: "radius" | "full";
  };
  category?: {
    /**
     * 是否启用分类卡片
     * @default true
     */
    enable?: boolean;
    /**
     * 分类页卡片标题
     * @default '${svg}全部分类'
     */
    pageTitle?: string;
    /**
     * 首页卡片标题
     * @default '${svg}文章分类'
     */
    homeTitle?: string;
    /**
     * 一页显示的数量
     * @default 5
     */
    limit?: number;
    /**
     * 是否自动翻页
     * @default false
     */
    autoPage?: boolean;
    /**
     * 翻页间隔时间，单位：毫秒。autoPage 为 true 时生效
     * @default 4000 (4秒)
     */
    pageSpeed?: number;
  };
  tag?: {
    /**
     * 是否启用标签卡片
     * @default true
     */
    enabled?: boolean;
    /**
     * 标签页页卡片标题
     * @default '${svg}全部标签'
     */
    pageTitle?: string;
    /**
     * 首页卡片标题
     * @default '${svg}热门标签'
     */
    homeTitle?: string;
    /**
     * 一页显示的数量
     * @default 21
     */
    limit?: number;
    /**
     * 是否自动翻页
     * @default false
     */
    autoPage?: boolean;
    /**
     * 翻页间隔时间，单位：毫秒。autoPage 为 true 时生效
     * @default 4000 (4秒)
     */
    pageSpeed?: number;
    /**
     * 自定义 tag 的背景颜色，默认取 theme.bgColor
     */
    bgColor?: string[];
  };
  topArticle?: {
    /**
     * 是否启用精选文章卡片
     * @default true
     */
    enabled?: boolean;
    /**
     * 首页卡片标题
     * @default '${svg}精选文章'
     */
    title?: string;
    /**
     * 一页显示的数量
     * @default 5
     */
    limit?: number;
    /**
     * 是否自动翻页
     * @default false
     */
    autoPage?: boolean;
    /**
     * 翻页间隔时间，单位：毫秒。autoPage 为 true 时生效
     * @default 4000 (4秒)
     */
    pageSpeed?: number;
  };
  friendLink?: {
    /**
     * 是否启用友情链接卡片
     * @default true
     */
    enabled?: boolean;
    /**
     * 友情链接数据列表
     */
    list?: {
      /**
       * 友链名称
       */
      name: string;
      /**
       * 友链头像
       */
      avatar?: string;
      /**
       * 友链描述
       */
      desc?: string;
      /**
       * 友链链接
       */
      link?: string;
      /**
       * img 标签的 alt
       * @default name
       */
      alt?: string;
    }[];
    /**
     * 首页卡片标题
     * @default '${svg}友情链接'
     */
    title?: string;
    /**
     * 一页显示的数量
     * @default 5
     */
    limit?: number;
    /**
     * 是否自动滚动
     * @default false
     */
    autoScroll?: boolean;
    /**
     * 滚动间隔时间，单位：毫秒。autoScroll 为 true 时生效
     * @default 2500 (2.5秒)
     */
    scrollSpeed?: number;
    /**
     * 是否自动翻页
     * @default false
     */
    autoPage?: boolean;
    /**
     * 翻页间隔时间，单位：毫秒。autoPage 为 true 时生效
     * @default 4000 (4秒)
     */
    pageSpeed?: number;
  };
  docAnalysis?: {
    /**
     * 是否启用站点信息卡片
     * @default true
     */
    enabled?: boolean;
    /**
     * 首页卡片标题
     * @default '${svg}站点信息'
     */
    title?: string;
    /**
     * 项目创建时间
     */
    createTime?: string;
    /**
     * 是否开启首页的访问量和排名统计
     * @default true
     */
    siteView?: boolean;
    /**
     * 是否开启文章页的浏览量统计
     * @default true
     */
    pageView?: boolean;
    /**
     * 是否开启文章页的字数统计
     * @default true
     */
    wordsCount?: boolean;
    /**
     * 是否开启文章页的阅读时长统计
     * @default true
     */
    readingTime?: boolean;
    /**
     * 如果首页获取访问量失败，则每隔多少时间后获取一次访问量，直到获取成功或获取 5 次后
     * @default 2000 (2秒)
     */
    siteIteration: number;
    /**
     * 如果文章页获取访问量失败，则每隔多少时间后获取一次访问量，直到获取成功或获取 5 次后
     * @default 2000 (2秒)
     */
    pageIteration: number;
  };
  /**
   * 社交配置
   */
  social?: FooterConfig[];
  /**
   * 页脚配置
   */
  footerInfo?: {
    /**
     * 页脚信息
     */
    message?: string | string[];
    /**
     * 主题版权配置
     */
    theme?: FooterConfig;
    /**
     * 博客版权配置
     */
    copyright?: FooterConfig & {
      /**
       * 创建年份
       */
      createYear: number | string;
      /**
       * 后缀
       */
      suffix: string;
    };
    /**
     * ICP 备案信息配置
     */
    icpRecord?: FooterConfig;
    /**
     * 网络安全备案信息配置
     */
    securityRecord?: FooterConfig;
  };
  /**
   * 评论区配置
   */
  comment?: CommentConfig<"twikoo"> | CommentConfig<"waline"> | CommentConfig<"giscus"> | CommentConfig<"artalk">;
  plugins?: {
    /**
     * 是否启用 sidebar 插件
     * @default true
     */
    sidebar?: boolean;
    /**
     * sidebar 插件配置项
     */
    sidebarOption?: SidebarOption;
    /**
     * 是否启用 permalink 插件
     * @default true
     */
    permalink?: boolean;
    /**
     * permalinks 插件配置项
     */
    permalinkOption?: PermalinkOption;
    /**
     * 是否启用 mdH1 插件
     * @default true
     */
    mdH1?: boolean;
    /**
     * catalogues 插件配置项
     */
    catalogueOption?: CatalogueOption;
    /**
     * 是否启用 docAnalysis 插件
     * @default true
     */
    docAnalysis?: boolean;
    /**
     * docAnalysis 插件配置项
     */
    docAnalysisOption?: DocAnalysisOption;
  };
  page?: Partial<PaginationProps>;
  imageViewer?: Partial<ImageViewerProps>;
}

export interface FooterConfig {
  /**
   * 名称，如果作用在 a 标签，则鼠标悬停显示名称，否则在页面文字显示
   */
  name?: string;
  /**
   * 图标地址
   *
   * @remark 与 iconType 配合使用
   *
   * 1、iconType 为 svg 时，需要填写 svg 代码
   * 2、iconType 为 iconfont 时，需要填写 class 名
   * 3、iconType 为 img 时，需要填写图片链接
   */
  icon?: string;
  /**
   * 图标类型
   * @default 'svg'
   */
  iconType?: "svg" | "iconfont" | "img";
  /**
   * 链接，点击后跳转到新窗口，如果不设置，则无法点击
   */
  link?: string;
  /**
   * img 标签的 alt，当 iconType 为 img 时生效
   */
  imgAlt?: string;
}

export type CommentConfig<T extends keyof CommentProvider> = {
  /**
   * 评论区提供者
   * twikoo 官网：https://twikoo.js.org/
   * waline 官网：https://waline.js.org/
   * giscus 官网：https://giscus.app/zh-CN
   * artalk 官网：https://artalk.js.org/
   */
  provider: T;
  /**
   * 评论区配置项，根据 provider 不同而不同，具体看对应官网的使用介绍
   */
  options?: CommentProvider[T];
  /**
   * 自定义评论区组件，如果 provider 不满足，则可以自定义组件，返回一个 VNode，比如 .vue 组件
   * @remark 例：{ ..., render: () => <MyCommentVueComponent /> }
   */
  render?: () => VNode;
};

export type CommentProvider = {
  /**
   * twikoo 评论区配置项
   */
  twikoo: {
    /**
     * 官网其他配置项
     */
    [key: string]: any;
    envId: string;
    /**
     * twikoo.js 在线链接
     * @default 'https://cdn.jsdelivr.net/npm/twikoo@{version}/dist/twikoo.min.js'
     */
    link?: string;
    /**
     * twikoo 版本号，不定期更新为最新版
     * @default '1.6.41'
     */
    version?: string;
    /**
     * 页面渲染后多少毫秒开始渲染 twikoo，如果设置太短，可能获取的 DOM 还没加载完成
     * @default 700 (0.7秒)
     */
    timeout?: number;
    /**
     * katex 配置项，如果设置，则加载 katex
     */
    katex?: {
      /**
       * katex 的 css、core、render 的在线链接
       */
      cssLink: string;
      coreJsLink: string;
      renderJsLink: string;
      /**
       * katex 的 css、core、render 的 integrity
       */
      cssIntegrity?: string;
      coreJsIntegrity?: string;
      renderJsIntegrity?: string;
    };
  };
  /**
   * waline 评论区配置项
   */
  waline: {
    /**
     * 官网其他配置项
     */
    [key: string]: any;
    /**
     * waline 后台服务器地址
     */
    serverURL: string;
    /**
     * waline.js 在线链接，在线链接和依赖二选一，依赖安装为：`pnpm install @waline/client`。如果两个都设置，则优先使用 jsLink
     */
    jsLink?: string;
    /**
     * waline.css 在线链接，在线链接和依赖二选一，和 jsLink 搭配使用。如果安装了依赖则不需要传入，如果两个都设置，则优先使用 cssLink
     */
    cssLink?: string;
    /**
     * waline.css 的 integrity
     */
    cssIntegrity?: string;
    /**
     * 暗黑模式，具体使用请看 waline 官网
     * @default 'html[class='dark']'
     */
    dark?: string;
  };
  /**
   * giscus 评论区配置项
   */
  giscus: {
    [key: string]: any;
    repo: string;
    repoId: string;
    category: string;
    categoryId: string;
    mapping?: string;
    strict?: string;
    reactionsEnabled?: string;
    emitMetadata?: string;
    inputPosition?: string;
    lang?: string;
    theme?: string;
    loading?: string;
    /**
     * 是否使用在线链接，如果不打算安装依赖，则设为 true
     * @default false
     */
    useOnline?: boolean;
    /**
     * giscus.js 在线链接，useOnline 为 false 时生效
     * @default 'https://giscus.app/client.js'
     */
    link?: string;
    /**
     * giscus.js 的 integrity
     */
    integrity?: string;
  };
  /**
   * artalk 评论区配置项
   */
  artalk: {
    [key: string]: any;
    /**
     * artalk 后台服务器地址
     */
    server: string;
    /**
     * artalk 站点名称
     */
    site: string;
  };
};
