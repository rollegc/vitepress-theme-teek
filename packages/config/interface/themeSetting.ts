import type { Message } from "@teek/components/common/Message/src/message";

export interface ThemeSetting {
  /**
   * 是否启用主题风格，如果为 false，则不会显示切换按钮
   *
   * @default true
   */
  useThemeStyle?: boolean;
  /**
   * 设置当前主题风格
   *
   * @default 'vp-default'
   */
  themeStyle?:
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
   * 自定义主题风格，将会追加到内置主题风格后面
   */
  themeStyleAppend?: {
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
      style: string;
    }[];
  }[];
  /**
   * 是否使用主题尺寸切换功能
   *
   * @default true
   */
  useThemeSize?: boolean;
  /**
   * 设置当前主题尺寸
   *
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
   * 回到顶部后的回调
   */
  backTopDone?: (TkMessage: Message) => void;
  /**
   * 滚动到评论后的回调
   */
  toCommentDone?: (TkMessage: Message) => void;
}
