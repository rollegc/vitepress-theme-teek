import type { DefaultTheme } from "vitepress";
import type { SidebarOption } from "./types";

/**
 * 根据 VitePress 的 rewrites 配置生成 sidebar
 *
 * 规则：
 * rewrites 格式为 a/b.md: c/d/e.md，key 为本地文件路径，value 为重写后的运行文件路径
 *
 * 根据本地文件路径生成 sidebar：xx/xx.md 为 [{text: "a", items: [{text: "b", link: "/c/d/e" }]}]，其中 link 为运行文件路径
 *
 * 如果为对象形式，则对象的 key 为运行文件路径第一个 / 前路径，如 {/c/: [{text: "a", items: [{text: "b", link: "/c/d/e" }]}]}
 */

/**
 * 重写规则映射接口
 */
type Rewrites = Record<string, string>;

/**
 * 对象格式 sidebar 的路径映射项
 */
interface PathMapItem {
  /** 处理后的 key 路径部分（已去除序号和 .md 扩展名） */
  keyPaths: string[];
  /** rewrites 的 value */
  valuePath: string;
  /** 完整的链接路径 */
  link: string;
}

type RewritesOptions = SidebarOption & {
  /**
   * 只处理指定的前缀数据，匹配成功则去除，用于国际化
   * 如：{ zh/01.指南/01.简介/01.简介.md': 'zh/guide/intro.md' }，且 matchPrefixAndRemove 为 zh
   * 则解析成 { '01.指南/01.简介/01.简介.md': 'guide/intro.md' }
   */
  matchPrefixAndRemove?: string;
};

export default (rewrites: Rewrites, options: RewritesOptions) => {
  const { type = "object", matchPrefixAndRemove = "", sidebarResolved } = options;

  // 如果指定了 matchPrefixAndRemove，则过滤出匹配前缀的重写规则
  let filteredRewrites = rewrites;
  if (matchPrefixAndRemove) {
    filteredRewrites = filterRewritesByPrefix(rewrites, matchPrefixAndRemove);
  }

  const finalSidebar =
    type === "object" ? buildObjectSidebar(filteredRewrites, options) : buildArraySidebar(filteredRewrites, options);

  return sidebarResolved?.(finalSidebar) ?? finalSidebar;
};

/**
 * 根据前缀过滤重写规则
 * @param rewrites 重写规则
 * @param prefix 要匹配的前缀，如 "zh"
 * @returns 过滤后的重写规则
 */
const filterRewritesByPrefix = (rewrites: Rewrites, prefix: string) => {
  const filtered: Rewrites = {};

  for (const [key, value] of Object.entries(rewrites)) {
    // 检查 value 是否以指定前缀开头
    const cleanValue = value.replace(/\.md$/, "");
    const valueParts = cleanValue.split("/").filter(part => part.length > 0);

    if (valueParts.length > 0 && valueParts[0] === prefix) filtered[key] = value;
  }

  return filtered;
};

/**
 * 构建对象格式的 sidebar
 * @param rewrites 重写规则
 * @param prefix 要移除的前缀
 * @returns 对象格式的 sidebar
 */
const buildObjectSidebar = (rewrites: Rewrites, options: RewritesOptions) => {
  const { matchPrefixAndRemove: prefix = "", initItems = true, initItemsText = false } = options;

  // 用于存储处理后的路径信息
  const pathMap: Record<string, PathMapItem[]> = {};

  // 遍历所有重写规则，处理 key 和 value
  for (const [key, value] of Object.entries(rewrites)) {
    // 处理 key（本地文件路径） - 移除 .md 扩展名并按 / 分割
    const cleanKeyPath = key.replace(/\.md$/, "");
    const keyParts = cleanKeyPath.split("/").filter(part => part.length > 0);

    // 处理 value（重写后的运行路径）
    const cleanValuePath = removePrefixFromPath(value, prefix);
    const valueParts = cleanValuePath.split("/").filter(part => part.length > 0);

    if (valueParts.length > 0) {
      const firstLevel = valueParts[0];
      const remainingKeyParts = keyParts.map(part => extractTextFromKeyPart(part));

      if (!pathMap[firstLevel]) pathMap[firstLevel] = [];

      pathMap[firstLevel].push({
        keyPaths: remainingKeyParts,
        valuePath: value,
        link: `/${cleanValuePath}`,
      });
    }
  }

  const result: DefaultTheme.SidebarMulti = {};

  for (const [firstLevel, paths] of Object.entries(pathMap)) {
    const sidebarItems = buildObjectSidebarItems(paths, options);

    if (!initItemsText && sidebarItems.length === 1) sidebarItems[0].text = "";

    result[`/${firstLevel}/`] = initItems
      ? sidebarItems
      : sidebarItems.length > 1
        ? sidebarItems
        : (sidebarItems[0].items ?? sidebarItems);
  }

  console.log(result);
  return result;
};

/**
 * 构建对象格式的 sidebar 项目列表
 * @param paths 路径数组
 * @returns sidebar 项目列表
 */
const buildObjectSidebarItems = (paths: PathMapItem[], options: RewritesOptions) => {
  const { collapsed, sidebarItemsResolved, prefixTransform, suffixTransform } = options;

  const sidebarItems: DefaultTheme.SidebarItem[] = [];

  // 处理每个路径
  for (const path of paths) {
    const { keyPaths, valuePath, link } = path;

    if (keyPaths.length === 0) {
      // 如果没有更多层级，则跳过
      continue;
    } else if (keyPaths.length === 1) {
      const prefix = prefixTransform?.(keyPaths[0]) ?? "";
      const suffix = suffixTransform?.(keyPaths[0]) ?? "";
      const text = prefix + keyPaths[0] + suffix;

      sidebarItems.push({
        text,
        link: link,
        collapsed: typeof collapsed === "function" ? collapsed(valuePath, text) : collapsed,
      });
    } else {
      // 还有多个层级，构建嵌套结构
      let currentItems = sidebarItems;

      for (let i = 0; i < keyPaths.length; i++) {
        const keyPart = keyPaths[i];

        // 查找是否已存在相同 text 的项
        let existingItem = currentItems.find(item => item.text === keyPart);

        if (!existingItem) {
          if (i === keyPaths.length - 1) {
            // 最后一级，添加链接
            existingItem = { text: keyPart, link: link };
          } else {
            // 非最后一级，添加 items 数组
            existingItem = { text: keyPart, items: [] };
          }
          currentItems.push(existingItem);
        }

        // 更新 currentItems 指针到下一级
        if (i < keyPaths.length - 1) {
          if (!existingItem.items) existingItem.items = [];
          currentItems = existingItem.items;
        }
      }
    }
  }
  const finalSidebar = sidebarItemsResolved?.(sidebarItems) ?? sidebarItems;

  return finalSidebar;
};

/**
 * 构建数组格式的 sidebar
 * @param rewrites 重写规则
 * @param prefix 要移除的前缀
 * @returns 数组格式的 sidebar
 */
const buildArraySidebar = (rewrites: Rewrites, options: RewritesOptions) => {
  const { matchPrefixAndRemove: prefix = "" } = options;

  // 用于存储处理后的路径信息
  const pathMap: Record<string, PathMapItem[]> = {};

  // 遍历所有重写规则，处理 key 和 value
  for (const [key, value] of Object.entries(rewrites)) {
    // 处理 key（本地文件路径），移除 .md 扩展名并按 / 分割
    const cleanKeyPath = key.replace(/\.md$/, "");
    const keyParts = cleanKeyPath.split("/").filter(part => part.length > 0);

    if (keyParts.length > 0) {
      const firstLevel = extractTextFromKeyPart(keyParts[0]);
      const remainingKeyParts = keyParts.slice(1).map(part => extractTextFromKeyPart(part));

      // 处理 value（重写后的运行路径）
      const cleanValuePath = removePrefixFromPath(value, prefix);

      if (!pathMap[firstLevel]) {
        pathMap[firstLevel] = [];
      }

      pathMap[firstLevel].push({
        keyPaths: remainingKeyParts,
        valuePath: value,
        link: `/${cleanValuePath}`,
      });
    }
  }

  const result: DefaultTheme.SidebarItem[] = [];

  for (const [firstLevel, paths] of Object.entries(pathMap)) {
    result.push({
      text: firstLevel,
      items: buildArraySidebarItems(paths, options),
    });
  }

  return result;
};

/**
 * 构建数组格式的 sidebar 项目列表
 * @param paths 路径数组
 * @returns sidebar 项目列表
 */
const buildArraySidebarItems = (paths: PathMapItem[], options: RewritesOptions) => {
  const { collapsed, sidebarItemsResolved, prefixTransform, suffixTransform } = options;

  const sidebarItems: DefaultTheme.SidebarItem[] = [];

  // 处理每个路径
  for (const path of paths) {
    const { keyPaths, valuePath, link } = path;

    // 如果没有更多层级，则跳过
    if (keyPaths.length === 0) continue;
    // 只剩一个层级，添加为叶子节点
    else if (keyPaths.length === 1) {
      // 处理前缀和后缀
      const prefix = prefixTransform?.(keyPaths[0]) ?? "";
      const suffix = suffixTransform?.(keyPaths[0]) ?? "";
      const text = prefix + keyPaths[0] + suffix;

      sidebarItems.push({
        text,
        link: link,
        collapsed: typeof collapsed === "function" ? collapsed(valuePath, text) : collapsed,
      });
    } else {
      // 还有多个层级，构建嵌套结构
      let currentItems = sidebarItems;

      for (let i = 0; i < keyPaths.length; i++) {
        const keyPart = keyPaths[i];

        // 查找是否已存在相同 text 的项
        let existingItem = currentItems.find(item => item.text === keyPart);

        if (!existingItem) {
          // 最后一级，添加链接
          if (i === keyPaths.length - 1) existingItem = { text: keyPart, link: link };
          // 非最后一级，添加 items 数组
          else existingItem = { text: keyPart, items: [] };

          currentItems.push(existingItem);
        }

        // 更新 currentItems 指针到下一级
        if (i < keyPaths.length - 1) {
          if (!existingItem.items) existingItem.items = [];
          currentItems = existingItem.items;
        }
      }
    }
  }

  return sidebarItemsResolved?.(sidebarItems) ?? sidebarItems;
};

/**
 * 移除路径前缀
 * @param path 路径
 * @param prefix 要移除的前缀
 * @returns 移除前缀后的路径
 */
const removePrefixFromPath = (path: string, prefix: string) => {
  const cleanPath = path.replace(/\.md$/, "");
  const parts = cleanPath.split("/").filter(part => part.length > 0);

  // 如果第一个部分是前缀，则移除它
  if (parts.length > 0 && parts[0] === prefix) {
    return parts.slice(1).join("/");
  }

  return cleanPath;
};

/**
 * 从 rewrites 的 key 的部分中提取文本（去除序号）
 * @param part key 的一部分，如 "01.简介" 或 "简介"
 * @returns 提取后的文本，如 "简介"
 */
const extractTextFromKeyPart = (part: string) => {
  // 移除开头的序号（如 01. 10. 等）
  return part.replace(/^\d+\./, "");
};
