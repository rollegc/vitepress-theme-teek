export interface RiskLink {
  /**
   * 白名单，支持正则表达式
   */
  whiteList?: Array<RegExp | string>;
  /**
   * 黑名单，支持正则表达式
   *
   * @remark 如果设置了黑名单，则只拦截黑名单的链接
   */
  blackList?: Array<RegExp | string>;
}
