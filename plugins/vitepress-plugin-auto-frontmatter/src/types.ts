import type { GlobOptions } from "tinyglobby";

export interface AutoFrontmatterOption {
  /**
   * 扫描的文件路径表达式，为 global 表达式
   */
  pattern?: string | string[];
  /**
   * include 指定的对象如果在 markdown frontmatter 存在，则生成额外 frontmatter
   */
  include?: Record<string, any>;
  /**
   * exclude 指定的对象如果在 markdown frontmatter 存在，则不生成额外 frontmatter，相同文件优先级高于 include
   */
  exclude?: Record<string, any>;
  /**
   * 转换处理好的 frontmatter
   */
  transform?: (frontmatter: Record<string, any>, fileInfo: FileInfo) => Record<string, any> | void;
  /**
   * tinyglobby 的配置项
   * 插件默认已经忽略 node_modules 和 dist 目录的所有文件
   */
  globOptions?: GlobOptions;
}

export interface FileInfo {
  filePath: string;
  relativePath: string;
}
