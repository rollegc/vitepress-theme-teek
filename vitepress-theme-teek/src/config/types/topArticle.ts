export interface TopArticle {
  /**
   * 是否启用精选文章卡片
   *
   * @default true
   */
  enabled?: boolean;
  /**
   * 首页卡片标题
   *
   * @default '${svg}精选文章'
   */
  title?: string | ((localeIndex: string, svg: string) => string);
  /**
   * 一页显示的数量
   *
   * @default 5
   */
  limit?: number;
  /**
   * 是否自动翻页
   *
   * @default false
   */
  autoPage?: boolean;
  /**
   * 翻页间隔时间，单位：毫秒。autoPage 为 true 时生效
   *
   * @default 4000 (4秒)
   */
  pageSpeed?: number;
}
