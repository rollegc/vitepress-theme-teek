import { readdirSync, readFileSync, statSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";
import matter from "gray-matter";
import type { CatalogueOption } from "./types";

// 默认扫描的文件夹列表
export const DEFAULT_INCLUDE_DIR = ["目录页"];

let catalogues: Record<string, string> = {};

export default (option: CatalogueOption = {}) => {
  const { base = process.cwd(), includeList = [] } = option;
  // 获取指定根目录下的所有目录绝对路径
  const dirPaths = readDirPaths(base, includeList);

  // 遍历根目录下的每个子目录
  dirPaths.forEach(dirPath => scannerMdFile(dirPath, option, basename(dirPath)));

	return catalogues;
};

/**
 * 指定根目录下的所有目录绝对路径，win 如 ['D:\docs\01.guide', 'D:\docs\02.design']，linux 如 ['/usr/local/docs/01.guide', '/usr/local/docs/02.design']
 * @param sourceDir 指定文件/文件夹的根目录
 */
const readDirPaths = (sourceDir: string, includeList: CatalogueOption["includeList"] = []) => {
  const includeListAll = [...DEFAULT_INCLUDE_DIR, ...includeList];
  const dirPaths: string[] = [];
  // 读取目录，返回数组，成员是 root 下所有的目录名（包含文件夹和文件，不递归）
  const secondDirNames = readdirSync(sourceDir);

  secondDirNames.forEach(secondDirName => {
    // 将路径或路径片段的序列解析为绝对路径，等于使用 cd 命令
    const secondDirPath = resolve(sourceDir, secondDirName);
    // 是否为文件夹目录，并排除指定文件夹
    if (isSome(includeListAll, secondDirName) && statSync(secondDirPath).isDirectory()) {
      dirPaths.push(secondDirPath);
    }
  });

  return dirPaths;
};

const scannerMdFile = (root: string, option: CatalogueOption, prefix = "") => {
  const { includeList = [] } = option;
  const includeListAll = [...DEFAULT_INCLUDE_DIR, ...includeList];
  // 读取目录名（文件和文件夹）
  let secondDirOrFilenames = readdirSync(root);

  secondDirOrFilenames.forEach(dirOrFilename => {
    const filePath = resolve(root, dirOrFilename);

    if (statSync(filePath).isDirectory()) {
      // 是文件夹目录
      if (!isSome(includeListAll, dirOrFilename)) return;

      scannerMdFile(filePath, option, `${prefix}/${dirOrFilename}`);
    } else {
      // 是文件
      if (!isMdFile(dirOrFilename)) return;

      const content = readFileSync(filePath, "utf-8");

      // 解析出 front matter 数据
      const { data: { catalogue, path = "" } = {} } = matter(content, {});

      if (catalogue && path) {
        const filename = basename(dirOrFilename, extname(dirOrFilename));
        catalogues[`${prefix}/${filename}`] = path;
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

const isSome = (arr: Array<string | RegExp>, name: string) => {
  return arr.some(item => name.includes(item as string) || (item instanceof RegExp && item.test(name)));
};
