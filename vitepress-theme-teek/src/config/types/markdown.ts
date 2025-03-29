import type MarkdownIt from "markdown-it";
import type { ContainerLabel, ContainerOption } from "../../markdown/plugins/container";

export interface Markdown {
  /**
   * 注册 markdown 插件回调，请不要在使用 vitepress.markdown.config 配置 md 插件，因为 config 是一个函数，vitepress 并没有做多个 config 合并，因此使用 vitepress.markdown.config 配置会覆盖主题内置 md 插件
   */
  config?: (md: MarkdownIt) => void;
  /**
   * 内置 markdown 容器的 Label 配置
   */
  container?: {
    /**
     * 自定义容器标题
     */
    label?: ContainerLabel;
    /**
     * 自定义 markdown 容器配置
     */
    config?: () => ContainerOption[];
  };
  /**
   * demo 插件配置
   */
  demo?: Demo;
}

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
   * @default '隐藏源代码'
   */
  expandSourceButtonTip?: string;
}
