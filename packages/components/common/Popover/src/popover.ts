import type { UsePopoverSizeOptions, NumStr } from "@teek/hooks";

export interface PopoverProps {
  placement?: UsePopoverSizeOptions["placement"];
  /**
   * 显示的内容
   *
   * @default ''
   */
  content?: string;
  /**
   * 宽度，如果不指定，则会根据内容自动计算
   */
  width?: NumStr;
  /**
   * 高度，如果不指定，则会根据内容自动计算
   */
  height?: NumStr;
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
  triggerEl?: HTMLDivElement;
  /**
   * 自定义 z-index
   */
  zIndex?: number;
  /**
   * popper 添加类名
   */
  popperClass?: string;
  /**
   * popper 添加样式
   */
  popperStyle?: object;
  /**
   * 弹框弹出前的回调，支持返回新的 `top`、`right`、`bottom`、`left`
   */
  beforePopup?: (
    options: PopoverTransformOptions
  ) => { top?: NumStr; right?: NumStr; bottom?: NumStr; left?: NumStr } | undefined;
}

export interface PopoverTransformOptions {
  /**
   * 弹框的 top 位置
   */
  top: NumStr;
  /**
   * 弹框的 right 位置
   */
  right: NumStr;
  /**
   * 弹框的 bottom 位置
   */
  bottom: NumStr;
  /**
   * 弹框的 left 位置
   */
  left: NumStr;
  /**
   * 触发弹框的 DOM 元素，如果传入 virtualEl 则是 virtualEl 元素
   */
  triggerElement: HTMLDivElement;
  /**
   * 弹框的 DOM 元素
   */
  popoverElement: HTMLDivElement;
}
