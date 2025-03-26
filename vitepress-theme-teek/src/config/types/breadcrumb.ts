export interface Breadcrumb {
  /**
   * 是否启用面包屑
   *
   * @default true
   */
  enabled?: boolean;
  /**
   * 面包屑最后一列是否显示当前文章的文件名
   *
   * @default false
   */
  showCurrentName?: boolean;
  /**
   * 面包屑分隔符
   *
   * @default '/'
   */
  separator?: string;
}
