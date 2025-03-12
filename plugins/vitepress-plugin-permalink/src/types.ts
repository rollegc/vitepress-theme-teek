export interface PermalinkOption {
  /**
   * 忽略的文件/文件夹列表，支持正则表达式
   *
   * @default []
   */
  ignoreList?: Array<RegExp | string>;
  /**
   * 文章所在的目录，基于 package.json 所在目录，开头不需要有 /
   * @default 'vitepress 的 srcDir 配置项'
   */
  path?: string;
  /**
   * activeMatch 精确匹配指定目录下的 Markdown 文件，仅当 path 为 permalink 时生效
   *
   * 当导航的 link 设置了 permalink，插件默认会把该导航的 activeMatch 设置为 permalink 文档所在的一级目录名，以此来达到访问同一级目录下的其他 permalink 文件时（模糊匹配），导航有高亮效果
   * 有些场景需要导航精确匹配该 permalink 文档，因此可以传入该 permalink 文档所在的一级目录
   *
   * @default []
   */
  activeMatchDir?: string[];
}

export interface Permalink {
  /**
   * key 为文件相对路径，value 为永久链接
   */
  map: Record<string, string>;
  /**
   * key 为永久链接，value 为文件相对路径
   */
  inv: Record<string, string>;
}
