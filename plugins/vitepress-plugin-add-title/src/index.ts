import { readFileSync } from "node:fs";
import type { PluginOption } from "vite";
import matter from "gray-matter";
import { basename } from "node:path";

export default function VitePluginVitePressAddTitle(): PluginOption {
  return {
    name: "vite-plugin-vitepress-add-title",
    transform: (code, id) => {
      if (!id.endsWith(".md")) return code;

      const content = readFileSync(id, "utf-8");

      const { data = {}, content: mdContent } = matter(content, {});
      const title = data.title || getMdFileTitle(basename(id)) || "";

      return mdContent.trimStart().split(/\r?\n/)[0].startsWith("# ")
        ? code
        : code.replace(
            `_createStaticVNode("`,
            `_createStaticVNode("<h 1 id=\\"${title}\\" tabindex=\\"-1\\">${title} <a class=\\"header-anchor\\" href= "#${title}\\" aria-label=\\"Permalink to &quot;${title}&quot;\\"></a ></h 1>`
          );
    },
  };
}

const getMdFileTitle = (filename: string) => {
  // 文章标题，如果为目录，则默认为文件夹名。如果为 md 文件，则尝试获取 front matter 中的 title，否则为文件名为标题
  let title = "";
  /**
   * 如果 filename 为 1.Ke.md，则解析为 ['1', 'Ke', 'md']，其中 index 为 1，title 为 Ke，type 为 md * 如果 filename 为 1.Ke.d.md，则解析为 ['1', 'Ke.d', 'md']，其中 index 为 1，title 为 Ke.d，type 为 md
   */
  const fileNameArr = filename.split(".");

  if (fileNameArr.length === 2) {
    title = fileNameArr[0];
  } else {
    const firstDotIndex = filename.indexOf(".");
    const lastDotIndex = filename.lastIndexOf(".");
    title = filename.substring(firstDotIndex + 1, lastDotIndex);
  }

  return title;
};
