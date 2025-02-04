export interface CatalogueOption {
  /**
   * 指定扫描的文件/文件夹列表，支持正则表达式
   *
   * @default ["目录页"]
   */
  includeList?: Array<RegExp | string>;
  /**
   * 文章所在的目录，基于 package.json 所在目录
   */
  base?: string;
}
