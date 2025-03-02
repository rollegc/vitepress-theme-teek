export interface IconProps {
  icon: string;
  iconType?: "svg" | "iconfont" | "img" | "el";
  size?: string | number;
  color?: string;
  hover?: boolean;
  hoverColor?: string;
  imgAlt?: string;
  style?: Record<string, string>;
}
