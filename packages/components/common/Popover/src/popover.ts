export interface PopoverProps {
  placement?:
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "top"
    | "top-start"
    | "top-end"
    | "left"
    | "left-start"
    | "left-end"
    | "right"
    | "right-start"
    | "right-end";
  /**
   * 显示的内容
   *
   * @default ''
   */
  content?: string;
  /**
   * 宽度，如果不指定，则会根据内容自动计算
   */
  width?: string | number;
  /**
   * 高度，如果不指定，则会根据内容自动计算
   */
  height?: string | number;
  /**
   * 偏移量，等价于 `xOffset` 和 `yOffset`
   *
   * @default 0
   */
  offset?: number;
  /**
   * x 偏移量
   *
   * @default 0
   */
  xOffset?: number;
  /**
   * y 偏移量
   *
   * @default 0
   */
  yOffset?: number;
  /**
   * 是否禁用
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * 是否开启过渡动画
   *
   * @default true
   */
  transition?: boolean;
  /**
   * 虚拟元素，弹框将在虚拟元素上显示
   */
  virtualEl?: HTMLDivElement;
  /**
   * 自定义 z-index
   */
  zIndex?: number;
  /**
   * 弹框弹出前的回调，支持返回新的 `top`、`right`、`bottom`、`left`
   */
  beforePopup?: (
    options: PopoverTransformOptions
  ) => { top?: number; right?: number; bottom?: number; left?: number } | undefined;
}

export interface PopoverTransformOptions {
  /**
   * 弹框的 top 位置
   */
  top: number;
  /**
   * 弹框的 right 位置
   */
  right: number;
  /**
   * 弹框的 bottom 位置
   */
  bottom: number;
  /**
   * 弹框的 left 位置
   */
  left: number;
  /**
   * 弹框组件根 DOM 元素，如果传入 virtualEl 则是 virtualEl 元素
   */
  popoverElement: HTMLDivElement;
  /**
   * 弹框的 DOM 元素
   */
  popupElement: HTMLDivElement;
}
