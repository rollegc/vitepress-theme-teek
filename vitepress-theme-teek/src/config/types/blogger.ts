export interface Blogger {
  /**
   * 博主昵称
   */
  name: string;
  /**
   * 博主头像
   */
  avatar: string;
  /**
   * 博主签名
   */
  slogan?: string;
  /**
   * 头像风格：radius 为圆形头像，可支持鼠标悬停旋转，full 为方形头像
   *
   * @default 'full'
   */
  avatarStyle?: "radius" | "full";
}
