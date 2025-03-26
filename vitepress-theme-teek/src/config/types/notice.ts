import type { Route } from "vitepress";

export interface Notice {
  /**
   * 是否启用公告功能
   *
   * @default false
   */
  enabled?: boolean;
  /**
   * 公告自定义全局样式
   *
   * @example
   * ```css
   * .tk-notice a {
   *    color: var(--vp-c-brand-2);
   * }
   * ```
   */
  noticeStyle?: string;
  /**
   * 公告图标样式
   */
  iconStyle?: Record<string, any>;
  /**
   * 公告弹窗样式
   */
  popoverStyle?: Record<string, any>;
  /**
   * 公告标题，函数式需要和国际化搭配使用，根据不同语言环境返回不同标题
   *
   * @default '公告'
   */
  title?: string | ((localeIndex: string) => string);
  /**
   * 第一次进入页面，是否默认打开公告弹框
   *
   * @default true
   */
  initOpen?: boolean;
  /**
   * 弹框定时自动关闭，0 不自动消失
   *
   * @default 0
   */
  duration?: number;
  /**
   * 移动端自动最小化
   *
   * @default false
   */
  mobileMinify?: boolean;
  /**
   * 关闭公告弹框后，是否支持重新打开，如果为 false，则代表公告只显示一次
   *
   * @default true
   */
  reopen?: boolean;
  /**
   * 是否使用 localStorage 存储公告状态，如：当打开公告弹框后，下次进来则自动打开弹框
   */
  useStorage?: boolean;
  /**
   * 公告图标是否打开闪烁提示
   *
   * @default false
   */
  twinkle?: boolean;
  /**
   * 公告弹框出现位置
   *
   * @default top
   */
  position?: "top" | "center";
  /**
   * 公告图标地址
   *
   * @remark 与 noticeIconType 配合使用
   *
   * 1、noticeIconType 为 svg 时，需要填写 svg 代码
   * 2、noticeIconType 为 iconfont 时，需要填写 class 名
   * 3、noticeIconType 为 img 时，需要填写图片链接
   * 4、noticeIconType 为 el 时，需要传入 ElIcon 的组件
   */
  noticeIcon?: string;
  /**
   * 图标类型
   *
   * @default 'svg'
   */
  noticeIconType?: "svg" | "iconfont" | "img" | "el";
  /**
   * 公告弹框关闭图标地址，与 noticeIcon 配置一致
   */
  closeIcon?: string;
  /**
   * 图标类型，与 noticeIconType 配置一致
   *
   * @default 'svg'
   */
  closeIconType?: "svg" | "iconfont" | "img" | "el";
  /**
   * 路由切换后的自定义回调
   *
   * @param to 切换到的目标路由
   */
  onAfterRouteChange?: (to: Route, noticeShow: boolean, showPopover: boolean) => void;
}
