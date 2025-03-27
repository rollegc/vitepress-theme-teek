import type MarkdownIt from "markdown-it";
import type { Renderer, Token } from "markdown-it";
import container from "markdown-it-container";
import { readFileSync } from "fs";
import { join, resolve } from "path";
import type { SiteConfig } from "vitepress";

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
        const sourceFilePath = sourceFileToken.children?.[0].content ?? "";

        if (sourceFileToken.type === "inline") {
          source = readFileSync(resolve(demoPath, `${sourceFilePath}.vue`), "utf-8");
        }
        if (!source) throw new Error(`Incorrect source file path: ${sourceFilePath}`);

        return `<DemoCode source="${encodeURIComponent(source)}" path="${sourceFilePath}" relative-path="${demoPath}" description="${encodeURIComponent(md.render(description))}" >`;
      } else return "</DemoCode>";
    },
  };

  md.use(container, "demo", options);
};

export default demoPlugin;
