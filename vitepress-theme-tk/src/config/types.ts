import { PermalinkOption } from "vitepress-plugin-permalink";
import { SidebarOption } from "vitepress-plugin-sidebar-resolve";

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
  plugins?: {
    /**
     * 是否禁用 sidebar 插件
     * @default false
     */
    sidebar?: boolean;
    /**
     * sidebar 插件配置项
     */
    sidebarOptions?: SidebarOption;
    /**
     * 是否禁用 permalink 插件
     * @default false
     */
    permalink?: boolean;
    /**
     * permalinks 插件配置项
     */
    permalinkOptions?: PermalinkOption;
    /**
     * 是否禁用 mdH1 插件
     * @default false
     */
    mdH1: boolean;
  };
}
