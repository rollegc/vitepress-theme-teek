import { PermalinkOption } from "vitepress-plugin-permalink";
import { SidebarOption } from "vitepress-plugin-sidebar-resolve";
import { CatalogueOption } from "vitepress-plugin-catalogue";
import { SiteInfoOption } from "vitepress-plugin-doc-analysis";

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
   * 首页 Banner 配置
   */
  banner?: {
    /**
     * Banner 背景风格
     */
    bgStyle?: "default" | "bigImg" | "grid";
    /**
     * Banner 背景色，bgStyle 为 default 时生效
     * @default '#e5e5e5'
     */
    defaultBgColor?: string;
    /**
     * Banner 字体颜色，bgStyle 为 default 时生效
     * @default '#000000'
     */
    defaultTextColor?: string;
    /**
     * Banner 大图链接，bgStyle 为 bigImg 时生效
     */
    bigImgSrc?: string | string[];
    /**
     * Banner 遮罩颜色，bgStyle 为 bigImg 时生效
     * @default 'rgba(0, 0, 0, 0.4)'
     */
    maskBg?: string | number;
    descStyle?: "default" | "types" | "fade";
    /**
     * 描述信息
     */
    description?: string | string[];
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
     * 打字速度，descStyle 为 types 时生效
     * @default 200
     */
    typesInTime?: number;
    /**
     * 删字速度，descStyle 为 types 时生效
     * @default 100
     */
    typesOutTime?: number;
    /**
     * 打字与删字的间隔时间，descStyle 为 types 时生效
     * @default 800
     */
    typeNextTime?: number;
  };
  /**
   * 面包屑配置
   */
  breadcrumb?: {
    /**
     * 是否启用面包屑
     * @default true
     */
    enabled: boolean;
    /**
     * 面包屑最后一列是否显示当前文章的文件名
     * @default false
     */
    showCurrentName: boolean;
  };
  /**
   * 博主信息 (显示在首页侧边栏)
   */
  blogger?: {
    /**
     * 博主头像
     */
    avatar: string;
    /**
     * 博主昵称
     */
    name: string;
    /**
     * 博主签名
     */
    slogan?: string;
  };
  docAnalysis?: {
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
    mdH1: boolean;
    /**
     * catalogues 插件配置项
     */
    catalogueOption?: CatalogueOption;
    /**
     * 是否启用 siteInfo 插件
     * @default true
     */
    siteInfo?: boolean;
    /**
     * siteInfo 插件配置项
     */
    siteInfoOption?: SiteInfoOption;
  };
}
