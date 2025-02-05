import { readdirSync, statSync } from "node:fs"; // 文件模块
import { extname, join, relative, resolve } from "node:path"; // 路径模块
import chalk from "chalk"; // 命令行打印美化
import { FileInfo, SiteInfoOption } from "./types";

export const log = (message: string, type = "yellow") => {
  console.log((chalk as any)[type](message));
};

// 默认忽略的文件夹列表
export const DEFAULT_IGNORE_DIR = [".vitepress", "node_modules", "public"];

export default (option: SiteInfoOption = {}) => {
  const { base = process.cwd() } = option;
  return readFileList(base, option);
};

/**
 * 获取所有的 md 文档
 */
export function readFileList(root: string, option: SiteInfoOption, fileList: FileInfo[] = []) {
  const { ignoreList = [] } = option;
  const ignoreListAll = [...DEFAULT_IGNORE_DIR, ...ignoreList];

  const secondDirOrFilenames = readdirSync(root);

  secondDirOrFilenames.forEach(dirOrFilename => {
    if (isSome(ignoreListAll, dirOrFilename)) return;

    const filePath = resolve(root, dirOrFilename);

    if (statSync(filePath).isDirectory()) {
      // 是文件夹目录
      readFileList(filePath, option, fileList);
    } else {
      // 是文件
      if (!isMdFile(dirOrFilename)) return;
      // 确保路径是绝对路径
      const workingDir = resolve(option.base || process.cwd());
      const absoluteFilePath = resolve(filePath);
      // 计算相对路径
      const relativePath = relative(workingDir, absoluteFilePath).replace(/\\/g, "/");
      let type = extname(dirOrFilename);

      if (type === ".md") fileList.push({ filePath, relativePath });
    }
  });
  return fileList;
}

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
