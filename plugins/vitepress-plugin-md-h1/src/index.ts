import type { Plugin } from "vite";
import { readFileSync } from "node:fs";
import { basename } from "node:path";
import matter from "gray-matter";

export default function VitePluginVitePressMdH1(): Plugin & { name: string } {
  return {
    name: "vite-plugin-vitepress-md-h1",
    transform: (code: string, id: string) => {
      if (!id.endsWith(".md")) return code;

      const content = readFileSync(id, "utf-8");

      const { data = {}, content: mdContent } = matter(content, {});
      const title = data.title || getMdFileTitle(basename(id)) || "";

      return mdContent.trimStart().split(/\r?\n/)[0].startsWith("# ")
        ? code
        : code.replace(
            `_createStaticVNode("`,
            `_createStaticVNode("<h1 id=\\"${title}\\" tabindex=\\"-1\\">${title} <a class=\\"header-anchor\\" href=\\"#${title}\\" aria-label=\\"Permalink to &quot;${title}&quot;\\">​</a></h1>`
          );
    },
  };
}

/**
 * 解析文件名
 *
 * @param filename 文件名
 */
export const getMdFileTitle = (filename: string) => {
  // 文章标题，如果为目录，则默认为文件夹名。如果为 md 文件，则尝试获取 frontmatter 中的 title，否则为文件名为标题
  let title = "";
  const fileNameArr = filename.split(".");

  if (fileNameArr.length === 2) title = fileNameArr[0];
  else {
    // 处理多个 . 如 01.guile.md 的情况
    const firstDotIndex = filename.indexOf(".");
    const lastDotIndex = filename.lastIndexOf(".");
    title = filename.substring(firstDotIndex + 1, lastDotIndex);
  }

  return title;
};
