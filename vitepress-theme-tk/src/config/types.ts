import { PermalinkOption } from "vitepress-plugin-permalink";
import { SidebarOption } from "vitepress-plugin-sidebar-resolve";

export interface ThemeConfig {
  /**
   * 外观切换时是否开启过渡动画
   */
  viewTransition?: boolean;
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
