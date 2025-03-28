export interface Demo {
  /**
   * Playground 链接
   */
  playgroundUrl?: string;
  /**
   * Playground 主文件名
   */
  playgroundMainFileName?: string;
  /**
   * Github 链接
   */
  githubUrl?: string;
  /**
   * 鼠标悬浮 Playground 按钮提示
   *
   * @default '在 Playground 中编辑'
   */
  playgroundButtonTip?: string;
  /**
   * 鼠标悬浮 Github 按钮提示
   *
   * @default '在 Github 中编辑'
   */
  githubButtonTip?: string;
  /**
   * 鼠标悬浮复制代码按钮提示
   *
   * @default '复制代码'
   */
  copyButtonTip?: string;
  /**
   * 鼠标悬浮复查看源代码按钮提示（代码块处于折叠状态）
   *
   * @default '查看源代码'
   */
  collapseSourceButtonTip?: string;
  /**
   * 鼠标悬浮复查看源代码按钮提示（代码块处于展开状态）
   *
   * @default '收起源代码'
   */
  expandSourceButtonTip?: string;
}
