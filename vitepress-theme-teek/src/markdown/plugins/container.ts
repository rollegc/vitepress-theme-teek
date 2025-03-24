import type MarkdownIt from "markdown-it";
import container from "markdown-it-container";
import type { Token } from "markdown-it";

export type ContainerArgs = [typeof container, string, { render: (tokens: Token[], idx: number) => string }];

export interface ContainerOption {
  type: string; // 容器名称
  useTitle?: boolean; // 是否使用标题
  defaultTitle?: string; // 默认标题
  className?: string; // 容器类名
}

export interface ContainerLabel {
  noteLabel?: string;
}

/**
 * 创建 Teek 内置的 markdown-it-container 插件
 * @param md markdown-it 实例
 */
export const containerPlugins = (md: MarkdownIt, containerLabel?: ContainerLabel) => {
  const markdownContainer = [
    { type: "center", useTitle: false, className: `tk-center-container` },
    { type: "right", useTitle: false, className: `tk-right-container` },
    { type: "note", useTitle: true, defaultTitle: containerLabel?.noteLabel || "NOTE", className: `custom-block` },
  ];

  createContainersThenUse(md, markdownContainer);
};

/**
 * 创建一个自定义的容器，并使用
 *
 * @param md markdown-it 实例
 * @param option 容器配置项
 */
export const createContainerThenUse = (md: MarkdownIt, option: ContainerOption) => {
  md.use(...createContainerThenGet(md, option));
};

/**
 * 创建一个自定义的容器，并返回
 *
 * @param md markdown-it 实例
 * @param option 容器配置项
 */
export const createContainerThenGet = (md: MarkdownIt, option: ContainerOption): ContainerArgs => {
  const { type, useTitle, defaultTitle, className } = option;
  return [
    container,
    type,
    {
      render(tokens: Token[], idx: number) {
        const token = tokens[idx];
        const info = token.info.trim().slice(type.length).trim();

        if (token.nesting === 1) {
          const title = useTitle ? md.renderInline(info || defaultTitle || "") : "";
          return `<div class="${type} ${className}">${useTitle ? `<p class="title ${type}-title ${className ? `${className}-title` : ""}">${title}</p>` : ""}\n`;
        } else return `</div>\n`;
      },
    },
  ];
};

/**
 * 创建多个自定义的容器，并使用
 *
 * @param md markdown-it 实例
 * @param options 容器配置项
 */
export const createContainersThenUse = (md: MarkdownIt, options: ContainerOption[]) => {
  options.forEach(option => {
    md.use(...createContainerThenGet(md, option));
  });
};

/**
 * 创建多个自定义的容器，并返回
 *
 * @param md markdown-it 实例
 * @param options 容器配置项
 */
export const createContainersThenGet = (md: MarkdownIt, options: ContainerOption[]) => {
  const containers: ContainerArgs[] = [];

  options.forEach(option => {
    containers.push(createContainerThenGet(md, option));
  });

  return containers;
};
