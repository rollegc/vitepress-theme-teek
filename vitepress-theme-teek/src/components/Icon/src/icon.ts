export interface IconProps {
  /**
   * 图标
   */
  icon?: string;
  /**
   * 图标类型
   *
   * @default 'svg'
   */
  iconType?: "svg" | "iconfont" | "img" | "component";
  /**
   * 图标大小
   *
   * @default 'inherit'
   */
  size?: string | number;
  /**
   * 图标颜色
   *
   * @default 'var(--vp-c-text-1)'
   */
  color?: string;
  /**
   * 图标是否可悬停
   *
   * @default false
   */
  hover?: boolean;
  /**
   * 图标悬停时的颜色，仅当 hover 为 true 时有效
   *
   * @default 'var(--vp-c-brand-1)'
   */
  hoverColor?: string;
  /**
   * img 标签的 alt，当 iconType 为 img 时生效
   */
  imgAlt?: string;
  /**
   * 自定义图标样式
   */
  style?: Record<string, string>;
}
