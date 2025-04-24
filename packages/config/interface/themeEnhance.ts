import type { ThemeColor, LayoutMode, SpotlightStyle } from "../../components/theme/ThemeEnhance/src/themeEnhance";

export interface ThemeEnhance {
  /**
   * 位置，top 为导航栏右侧，bottom 为右下角
   */
  position?: "top" | "bottom";
  /**
   * 布局切换配置
   */
  layoutSwitch?: {
    /**
     * 禁用布局切换
     */
    disabled?: boolean;
    /**
     * 布局切换的默认模式
     *
     * @default LayoutMode.Original
     */
    defaultMode?: LayoutMode | "fullWidth" | "sidebarWidthAdjustableOnly" | "bothWidthAdjustable" | "original";
    /**
     * 禁用布局切换帮助提示
     *
     * @default false
     */
    disableHelp?: boolean;
    /**
     * 禁用布局切换动画
     */
    disableAnimation?: boolean;
    /**
     * 内容布局最大宽度滑块配置
     */
    docLayoutMaxWidth?: {
      /**
       * 内容布局最大宽度的默认百分比
       *
       * @default 80 (80%)
       */
      defaultMaxWidth?: number;
      /**
       * 禁用内容布局最大宽度帮助提示
       *
       * @default false
       */
      disableHelp?: boolean;
    };
    /**
     * 页面布局最大宽度滑块配置
     */
    pageLayoutMaxWidth?: {
      /**
       * 页面布局最大宽度的默认百分比
       *
       * @default 100 (100%)
       */
      defaultMaxWidth?: number;
      /**
       * 禁用页面布局最大宽度帮助提示
       *
       * @default false
       */
      disableHelp?: boolean;
    };
  };
  /**
   * 布局主题色配置
   */
  themeColor?: {
    /**
     * 禁用布局主题色切换
     *
     * @default false
     */
    disabled?: boolean;
    /**
     * 布局默认主题色
     *
     * @default ThemeColor.vpDefault
     */
    defaultColor?:
      | ThemeColor
      | "vp-default"
      | "vp-green"
      | "vp-yellow"
      | "vp-red"
      | "el-blue"
      | "el-green"
      | "el-yellow"
      | "el-red";
    /**
     * 是否将颜色扩散到全局（根据主题色计算其他颜色）
     *
     * @default false
     */
    defaultSpread?: boolean;
    /**
     * 禁用聚光灯帮助提示
     *
     * @default false
     */
    disableHelp?: boolean;
    /**
     * 是否在移动端禁用
     *
     * @default false
     */
    disabledInMobile?: boolean;
    /**
     * 自定义主题色，将会追加到内置主题色后面
     */
    append?: {
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
        label: string;
        /**
         * 主题标识，在 html 标签的 theme 属性添加该标识
         */
        value: string;
      }[];
    }[];
  };
  /**
   * 聚光灯配置
   */
  spotlight?: {
    /**
     * 禁用聚光灯
     *
     * @default false
     */
    disabled?: boolean;
    /**
     * 聚光灯默认样式
     *
     * @default SpotlightStyle.Aside
     */
    defaultStyle?: SpotlightStyle | "aside" | "under";
    /**
     * 禁用聚光灯帮助提示
     *
     * @default false
     */
    disableHelp?: boolean;
    /**
     * 聚光灯默认开关状态
     *
     * @default false
     */
    defaultToggle?: boolean;
  };
}
