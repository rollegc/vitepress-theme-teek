export interface ArticleShare {
  /**
   * 是否开启文章链接分享功能
   *
   * @default false
   */
  enabled?: boolean;
  /**
   * 分析按钮图标
   *
   * @default 'shareIcon'
   */
  icon?: string;
  /**
   * 分享按钮文本
   *
   * @default '分享此页面'
   */
  text?: string;
  /**
   * 复制成功图标
   *
   * @default 'thumbsIcon'
   */
  copiedIcon?: string;
  /**
   * 复制成功文本
   *
   * @default '链接已复制'
   */
  copiedText?: string;
  /**
   * 是否包含查询参数
   *
   * @default false
   */
  query?: boolean;
  /**
   * 是否包含哈希值
   *
   * @default false
   */
  hash?: boolean;
}
