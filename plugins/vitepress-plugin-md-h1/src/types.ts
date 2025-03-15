export interface MdH1Option {
  /**
   * 忽略的文件路径，支持正则表达式
   *
   * @default []
   */
  ignoreList?: Array<RegExp | string>;
}
