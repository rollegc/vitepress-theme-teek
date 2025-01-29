import { readdirSync, readFileSync, statSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import matter from "gray-matter";
import type { PermalinkOption } from "./types";

// 默认忽略的文件夹列表
export const DEFAULT_IGNORE_DIR = [
  "scripts",
  "components",
  "assets",
  ".vitepress",
  "node_modules",
  "package.json",
];

// key 为文件路径，value 为永久链接
let permalinks: Record<string, string> = {};

export default (option: PermalinkOption = {}, cleanUrls = false): Record<string, string> => {
  const { base = ".", ignoreList = [] } = option;
  const sourceDir = join(process.cwd(), base);

  // 获取指定根目录下的所有目录绝对路径
  const dirPaths = readDirPaths(sourceDir, ignoreList);

  // 只扫描根目录的 md 文件
  scannerMdFile(sourceDir, option, "", cleanUrls, true);

  // 遍历根目录下的每个子目录
  dirPaths.forEach(dirPath => scannerMdFile(dirPath, option, basename(dirPath), cleanUrls));

  return permalinks;
};

/**
 * 指定根目录下的所有目录绝对路径，win 如 ['D:\docs\01.guide', 'D:\docs\02.design']，linux 如 ['/usr/local/docs/01.guide', '/usr/local/docs/02.design']
 * @param sourceDir 指定文件/文件夹的根目录
 */
const readDirPaths = (sourceDir: string, ignoreList: PermalinkOption["ignoreList"] = []) => {
  const dirPaths: string[] = [];
  // 读取目录，返回数组，成员是 root 下所有的目录名（包含文件夹和文件，不递归）
  const secondDirNames = readdirSync(sourceDir);

  secondDirNames.forEach(secondDirName => {
    // 将路径或路径片段的序列解析为绝对路径，等于使用 cd 命令
    const secondDirPath = resolve(sourceDir, secondDirName);
    // 是否为文件夹目录，并排除指定文件夹
    if (![...DEFAULT_IGNORE_DIR, ...ignoreList].includes(secondDirName) && statSync(secondDirPath).isDirectory()) {
      dirPaths.push(secondDirPath);
    }
  });

  return dirPaths;
};

const scannerMdFile = (
  root: string,
  option: PermalinkOption,
  prefix = "",
  cleanUrls = false,
  onlyScannerRootMd = false
) => {
  const { ignoreList = [] } = option;
  // 读取目录名（文件和文件夹）
  let secondDirOrFilenames = readdirSync(root);

  secondDirOrFilenames.forEach(dirOrFilename => {
    const filePath = resolve(root, dirOrFilename);

    if (!onlyScannerRootMd && statSync(filePath).isDirectory()) {
      // 是文件夹目录
      if ([...DEFAULT_IGNORE_DIR, ...ignoreList].includes(dirOrFilename)) return;

      scannerMdFile(filePath, option, `${prefix}/${dirOrFilename}`, cleanUrls);
    } else {
      // 是文件
      if (
        !isMdFile(dirOrFilename) ||
        [...DEFAULT_IGNORE_DIR, ...ignoreList].some(
          item => dirOrFilename.includes(item as string) || (item instanceof RegExp && item.test(dirOrFilename))
        )
      ) {
        return;
      }

      const content = readFileSync(filePath, "utf-8");

      // 解析出 front matter 数据
      const { data: { permalink = "" } = {} } = matter(content, {});

      // 判断 permalink 开头是否为 /，是的话截取掉 /，否则为 permalink
      if (permalink) {
        let finalPermalink = permalink;
        if (!finalPermalink.startsWith("/")) finalPermalink = "/" + finalPermalink;
        if (finalPermalink.endsWith("/")) finalPermalink = finalPermalink.substring(0, finalPermalink.length - 1);

        const filename = cleanUrls ? basename(dirOrFilename, extname(dirOrFilename)) : basename(dirOrFilename);

        permalinks[`${prefix}/${filename}`] = finalPermalink;
      }
    }
  });
};

/**
 * 判断是否为 md 文件
 *
 * @param filePath 文件绝对路径
 */
const isMdFile = (filePath: string) => {
  const fileExtension = filePath.substring(filePath.lastIndexOf(".") + 1);
  return ["md", "MD"].includes(fileExtension);
};
