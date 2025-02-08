export interface DocAnalysisOption {
  /**
   * 忽略的文件/文件夹列表，支持正则表达式
   *
   * @default []
   */
  ignoreList?: Array<RegExp | string>;
  /**
   * 文章所在的目录，基于 package.json 所在目录
   */
  base?: string;
  /**
   * 1 分钟内阅读的中文字数
   * @default 300
   */
  cn?: number;
  /**
   * 1 分钟内阅读的英文字数
   * @default 160
   */
  en?: number;
}

export interface FileInfo {
  filePath: string;
  relativePath: string;
}

export interface FileWords {
  fileInfo: FileInfo;
  wordsCount: number;
  readingTime: string;
  frontmatter: Record<string, any>;
}
