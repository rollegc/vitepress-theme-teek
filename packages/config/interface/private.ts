export interface Private {
  /**
   * 是否启用私密功能
   *
   * @default false
   */
  enabled?: boolean;
  /**
   * 登录过期时间：1d 代表 1 天，1h 代表 1 小时，仅支持这两个单位，不加单位代表秒。过期后访问私密文章重新输入用户名和密码。默认一天
   *
   * @default '1d'
   */
  expire?: string;
  /**
   * 开启是否在网页关闭或刷新后，清除登录状态，这样再次访问网页，需要重新登录
   *
   * @default false
   */
  session?: boolean;
  /**
   * 是否使用站点登录功能，即第一次进入网站需要验证
   *
   * @default false
   */
  siteLogin?: boolean;
  /**
   * 站点级登录信息，当 siteLogin 为 true 时生效
   */
  site?: (LoginInfo & { role?: "common" | "admin" })[];
  /**
   * 页面级登录信息，登录一次后其他私密文章都可以访问
   */
  page?: LoginInfo[];
  /**
   * 登录信息分组
   */
  realm?: { [key: string]: LoginInfo[] };
}

export interface LoginInfo {
  /**
   * 用户名
   */
  username: string;
  /**
   * 密码
   */
  password: string;
  /**
   * 登录过期时间：1d 代表 1 天，1h 代表 1 小时，仅支持这两个单位，不加单位代表秒。过期后访问私密文章重新输入用户名和密码。默认一天
   *
   * @default 1d
   */
  expire?: string;
  /**
   * 开启是否在网页关闭或刷新后，清除登录状态，这样再次访问网页，需要重新登录
   *
   * @default false
   */
  session?: boolean;
  /**
   * 登录方式，once 代表一次登录，always 代表每次访问都登录
   *
   * @default 'once'
   */
  strategy?: "once" | "always";
}
