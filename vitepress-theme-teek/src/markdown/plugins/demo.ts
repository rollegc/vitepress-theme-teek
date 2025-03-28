import type MarkdownIt from "markdown-it";
import type { Renderer, Token } from "markdown-it";
import container from "markdown-it-container";
import { normalizePath } from "vite";
import type { SiteConfig } from "vitepress";
import { readFileSync } from "fs";
import { join, resolve } from "path";

interface ContainerOpts {
  marker?: string | undefined;
  validate?(params: string): boolean;
  render?(tokens: Token[], index: number, options: any, env: any, self: Renderer): string;
}

const demoPlugin = (md: MarkdownIt) => {
  const siteConfig: SiteConfig = (globalThis as any).VITEPRESS_CONFIG;
  const srcDir = siteConfig.srcDir;
  const { path = "examples" } = siteConfig.userConfig.themeConfig.demo || {};
  const demoPath = join(srcDir, path || "");

  const options: ContainerOpts = {
    validate(params) {
      return !!params.trim().match(/^demo\s*(.*)$/);
    },

    render(tokens, idx) {
      const desc = tokens[idx].info.trim().match(/^demo\s*(.*)$/);

      if (tokens[idx].nesting === 1 /* 标签打开 */) {
        const description = desc && desc.length > 1 ? desc[1] : "";
        const sourceFileToken = tokens[idx + 2];
        let source = "";
        const containerContent = sourceFileToken.children?.[0].content ?? "";
        // 确保文件路径带 .vue
        const sourceFile = containerContent ? `${containerContent.replace(/.vue$/, "")}.vue` : "";
        const sourceRelativeFile = normalizePath(join(path, sourceFile));

        if (sourceFile && sourceFileToken.type === "inline") {
          source = readFileSync(resolve(demoPath, sourceFile), "utf-8");
        }
        if (!source) throw new Error(`Incorrect source file path: ${sourceFile}`);

        return `<DemoCode source="${encodeURIComponent(
          md.render(`\`\`\` vue\n${source}\`\`\``)
        )}" path="${sourceRelativeFile}" raw-source="${encodeURIComponent(
          source
        )}" description="${encodeURIComponent(md.render(description))}">`;
      } else return "</DemoCode>";
    },
  };

  md.use(container, "demo", options);
};

export default demoPlugin;
