export interface DocAnalysisOption {
  /**
   * 忽略的文件/文件夹列表，支持正则表达式
   *
   * @default []
   */
  ignoreList?: Array<RegExp | string>;
  /**
   * 文章所在的目录，基于 package.json 所在目录，开头不需要有 /
   *
   * @default 'vitepress 的 srcDir 配置项'
   */
  srcDir?: string;
  /**
   * 是否忽略每个目录下的 index.md 文件
   *
   * @default false
   */
  ignoreIndexMd?: boolean;
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
  wordCount: number;
  readingTime: string;
  frontmatter: Record<string, any>;
}
