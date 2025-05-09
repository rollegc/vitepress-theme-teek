export interface VpContainerProps {
  /**
   * 类型
   *
   * @default 'tip'
   */
  type?: "info" | "tip" | "warning" | "danger";
  /**
   * 标题
   */
  title?: string;
  /**
   * 内容
   */
  text?: string;
}
