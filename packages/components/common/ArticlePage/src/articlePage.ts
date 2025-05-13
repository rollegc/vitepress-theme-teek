export interface ArticlePageProps {
  /**
   * 是否是文档页（使用 VitePress 文档样式）
   *
   * @default false
   */
  doc?: boolean;
  /**
   * 是否使用大纲栏
   *
   * @default false
   */
  aside?: boolean;
  /**
   * 是否使用侧边栏
   *
   * @default false
   */
  sidebar?: boolean;
}
