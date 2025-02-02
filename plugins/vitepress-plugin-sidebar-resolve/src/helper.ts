import { readdirSync, statSync, readFileSync } from "node:fs";
import { join, basename, resolve } from "node:path";
import matter from "gray-matter";
import type { DefaultTheme } from "vitepress";
import type { SidebarOption } from "./types";
import { getTitleFromMd, isMdFileExtension, isIllegalIndex } from "./util";
import chalk from "chalk";

export const log = (message: string, type = "yellow") => {
  console.log((chalk as any)[type](message));
};

// 默认忽略的文件夹列表
export const DEFAULT_IGNORE_DIR = ["scripts", "components", "assets", ".vitepress", "node_modules", "package.json"];

/**
 * 生成侧边栏数据
 * @param  sourceDir .md 文件所在源目录，一般是 docs 目录（绝对路径）
 * @param  collapsed  是否可折叠
 */
export default (option: SidebarOption = {}): DefaultTheme.SidebarMulti => {
  const { base = ".", ignoreList = [], scannerRootMd = true, sideBarResolved } = option;

  const sourceDir = join(process.cwd(), base);

  let sidebar: DefaultTheme.SidebarMulti = {};
  // 获取指定根目录下的所有目录绝对路径
  const dirPaths = readDirPaths(sourceDir, ignoreList);

  // 只扫描根目录的 md 文件
  if (scannerRootMd) sidebar[`/`] = createSideBarItems(sourceDir, option, "", scannerRootMd);

  // 遍历根目录下的每个子目录，生成对应的侧边栏数据
  dirPaths.forEach(dirPath => {
    // dirPath 是每个目录的绝对路径
    const fileName = basename(dirPath);

    // 创建 SideBarItems
    const sidebarItems = createSideBarItems(dirPath, option, fileName);

    if (!sidebarItems.length) {
      return log(`warning：该目录「${dirPath}」内部没有任何文件或文件序号出错，将忽略生成对应侧边栏`);
    }

    sidebar[`/${fileName}/`] = sidebarItems;
  });

  return sideBarResolved?.(sidebar) ?? sidebar;
};

/**
 * 指定根目录下的所有目录绝对路径，win 如 ['D:\docs\01.guide', 'D:\docs\02.design']，linux 如 ['/usr/local/docs/01.guide', '/usr/local/docs/02.design']
 * @param sourceDir 指定文件/文件夹的根目录
 */
const readDirPaths = (sourceDir: string, ignoreList: SidebarOption["ignoreList"] = []) => {
  const dirPaths: string[] = [];
  const ignoreListAll = [...DEFAULT_IGNORE_DIR, ...ignoreList];
  // 读取目录，返回数组，成员是 root 下所有的目录名（包含文件夹和文件，不递归）
  const secondDirNames = readdirSync(sourceDir);

  secondDirNames.forEach(secondDirName => {
    // 将路径或路径片段的序列解析为绝对路径，等于使用 cd 命令
    const secondDirPath = resolve(sourceDir, secondDirName);
    // 是否为文件夹目录，并排除指定文件夹
    if (!isSome(ignoreListAll, secondDirName) && statSync(secondDirPath).isDirectory()) {
      dirPaths.push(secondDirPath);
    }
  });

  return dirPaths;
};

/**
 * 将目录映射为对应的侧边栏配置数据，处理成 VitePress 格式
 *
 * @param root 文件/文件夹的根目录绝对路径
 * @param option 配置项
 * @param prefix 记录的文件/文件夹路径（包含刚进入方法时的 root 目录）
 * @param recursive 是否迭代
 */
const createSideBarItems = (
  root: string,
  option: SidebarOption,
  prefix = "",
  onlyScannerRootMd = false
): DefaultTheme.SidebarItem[] => {
  const {
    collapsed = true,
    ignoreList = [],
    ignoreIndexMd,
    fileIndexPrefix = false,
    sideBarItemsResolved,
    beforeCreateSideBarItems,
    mdTitleDeep = false,
  } = option;
  const ignoreListAll = [...DEFAULT_IGNORE_DIR, ...ignoreList];

  if (ignoreIndexMd && (root.includes("index.md") || root.includes("index.MD"))) return [];

  // 读取目录名（文件和文件夹）
  let secondDirNames = readdirSync(root);

  // 结构化文章侧边栏数据，以文件夹的序号为数字下标
  let sidebarItems: DefaultTheme.SidebarItem[] = [];
  // 存储没有序号的文件，最终生成 sidebarItems 的时候，将这些文件放到最后面
  let sidebarItemsNoIndex: DefaultTheme.SidebarItem[] = [];

  secondDirNames = beforeCreateSideBarItems?.(secondDirNames) ?? secondDirNames;

  secondDirNames.forEach(filename => {
    if (isSome(ignoreListAll, filename)) return [];

    const filePath = resolve(root, filename);
    // 解析文件名
    let { index: indexStr, title, type, name } = resolveFileName(filename, filePath);

    // 十进制转换
    const index = parseInt(indexStr as string, 10);

    // 校验文件序号
    if (fileIndexPrefix && isIllegalIndex(index)) {
      log(`warning：该文件「${filePath}」序号出错，请填写正确的序号`);
      return [];
    }

    // 判断序号是否已经存在
    if (sidebarItems[index]) log(`warning：该文件「${filePath}」的序号在同一级别中重复出现，将会被覆盖`);

    if (!onlyScannerRootMd && statSync(filePath).isDirectory()) {
      // 是文件夹目录
      // 按顺序从该目录下的 [index.md, index.MD, 目录名.md] 文件获取标题，一旦获取到第一个则不再继续遍历
      const filenames = [
        join(root, filename, "index.md"),
        join(root, filename, "index.MD"),
        join(root, filename, filename + ".md"),
      ];

      for (const filename of filenames) {
        const t = getTitleFromMd(filename, mdTitleDeep);
        if (t) {
          title = t;
          break;
        }
      }

      const sidebarItem = {
        text: title,
        collapsed,
        items: createSideBarItems(filePath, option, `${prefix}/${filename}`),
      };

      if (isIllegalIndex(index)) sidebarItemsNoIndex.push(sidebarItem);
      else sidebarItems[index] = sidebarItem;
    } else {
      // 是文件
      // 开启扫描根目录 md 文件时，不扫描 index.md
      if (onlyScannerRootMd && filename.includes("index.md")) return [];

      if (!isMdFileExtension(type) || (ignoreIndexMd && filename.includes("index.md"))) {
        // 开启扫描根目录时，则不添加提示功能，因为根目录有大量的文件/文件夹不是 md 文件，这里不应该打印
        !onlyScannerRootMd && log(`warning：该文件「${filePath}」非 .md 格式文件，不支持该文件类型`);
        return [];
      }

      const content = readFileSync(filePath, "utf-8");
      // 解析出 frontmatter 数据
      const { data = {}, content: mdContent } = matter(content, {});

      // title 获取顺序：md 文件 formatter 的 title > md 文件的 # 后面的内容 > md 文件名
      if (data.title) title = data.title;
      else title = getTitleFromMd(mdContent, mdTitleDeep) || title;

      // 当没有文件序号时，index == title
      const sidebarItem = {
        text: title,
        collapsed,
        link: `${prefix ? `/${prefix}` : ""}/${name}`,
      };

      if (isIllegalIndex(index)) sidebarItemsNoIndex.push(sidebarItem);
      else sidebarItems[index] = sidebarItem;
    }
  });

  // 将没有序号的 sidebarItemsNoIndex 放到最后面
  sidebarItems = [...sidebarItems, ...sidebarItemsNoIndex].filter(Boolean);

  return sideBarItemsResolved?.(sidebarItems) ?? sidebarItems;
};

/**
 * 解析文件名，返回文件序号、文件标题、文件类型
 * @param filename 文件名
 * @param filePath 文件绝对路径
 */
const resolveFileName = (
  filename: string,
  filePath: string
): { index: string | number; title: string; type: string; name: string } => {
  const stat = statSync(filePath);
  // 文件序号
  let index: string | number = "";
  // 文章标题，如果为目录，则默认为文件夹名。如果为 md 文件，则尝试获取 front matter 中的 title，否则为文件名为标题
  let title = "";
  // 文件类型
  let type = "";
  // 文件名称，不带后缀
  let name = "";

  /**
   * 如果 filename 为 1.Ke.md，则解析为 ['1', 'Ke', 'md']，其中 index 为 1，title 为 Ke，type 为 md
   * 如果 filename 为 1.Ke.d.md，则解析为 ['1', 'Ke.d', 'md']，其中 index 为 1，title 为 Ke.d，type 为 md
   */
  const fileNameArr = filename.split(".");

  if (fileNameArr.length === 2) {
    // index.md 文件的下标默认为 0，则永远在侧边栏的第一位
    index = fileNameArr[0] === "index" ? "0" : fileNameArr[0];
    title = stat.isDirectory() ? fileNameArr[1] : fileNameArr[0];
    type = fileNameArr[1];
    name = fileNameArr[0];
  } else {
    const firstDotIndex = filename.indexOf(".");
    const lastDotIndex = filename.lastIndexOf(".");
    index = filename.substring(0, firstDotIndex);
    type = filename.substring(lastDotIndex + 1);
    name = filename.substring(0, lastDotIndex);

    if (stat.isDirectory()) title = filename.substring(firstDotIndex + 1);
    else title = filename.substring(firstDotIndex + 1, lastDotIndex);
  }

  return { index, title, type, name };
};

const isSome = (arr: Array<string | RegExp>, name: string) => {
  return arr.some(item => name.includes(item as string) || (item instanceof RegExp && item.test(name)));
};
