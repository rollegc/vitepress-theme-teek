import type { SiteConfig } from "vitepress";
import type { FileInfo } from "vitepress-plugin-auto-frontmatter";
import type { TransformRule } from "../interface/plugins";
import { cleanPathSpaces, getFirstPathSegment, replacePlaceholder } from "./permalink";

/**
 * 创建 permalink 永久链接
 *
 * @param permalinkPrefix permalink 前缀
 */
export const createSimplePermalink = (permalinkPrefix = "") => {
  let finalPermalinkPrefix = permalinkPrefix;
  if (!finalPermalinkPrefix.startsWith("/")) finalPermalinkPrefix = "/" + finalPermalinkPrefix;
  if (!finalPermalinkPrefix.endsWith("/")) finalPermalinkPrefix = finalPermalinkPrefix + "/";

  return {
    permalink: `${finalPermalinkPrefix}${(Math.random() + Math.random()).toString(16).slice(2, 8)}`,
  };
};

/**
 * 根据规则转换 permalink
 *
 * @param permalink 原始 permalink
 * @param fileInfo 文件信息
 * @param rules 规则数组
 */
export const createComplexPermalink = (permalink: string, fileInfo: FileInfo, rules: TransformRule[]) => {
  // 转换函数：支持移除指定层级前缀后再添加新前缀，新增 clear 清空逻辑 + UUID 占位符替换
  for (const rule of rules) {
    const { folderName, prefix = "", removeLevel, clear = false } = rule; // 解构时给 clear 默认值 false

    // 检查文件路径是否匹配文件夹规则（精确匹配单个文件时，需完全一致）
    if (!fileInfo.relativePath.startsWith(folderName) && folderName !== "*") {
      continue;
    }

    // 如果 clear 为 true，直接清空 permalink 并返回（优先级最高）
    if (clear || permalink === undefined) {
      return { permalink: "" };
    }

    // 兼容 null 和 undefined，避免空字符串替换报错
    let originalPermalink = permalink;
    if (originalPermalink === null || originalPermalink === undefined) {
      originalPermalink = "";
    }

    let normalizedPrefix = "";
    const finalPrefix = cleanPathSpaces(prefix);
    // 前缀不为空的情况才需要处理
    if (finalPrefix !== "") {
      // 替换 prefix 中的 $UUID/$UUID10 占位符，/test/$UUID10 → /test/a3k9m2x8p1
      normalizedPrefix = replacePlaceholder(finalPrefix, fileInfo.relativePath);
      // 原有：标准化前缀（确保以 / 开头）
      normalizedPrefix = normalizedPrefix.startsWith("/") ? normalizedPrefix : `/${normalizedPrefix}`;

      // 核心调整：按 / 分组，比较第一个前缀是否一致
      // 获取目标前缀的第一个分组（如 /test/12345 → test）
      const targetFirstSegment = getFirstPathSegment(normalizedPrefix);
      // 获取当前 permalink 的第一个分组（如 /old/path → old）
      const currentFirstSegment = getFirstPathSegment(originalPermalink);

      // 若第一个分组相同，说明已包含目标前缀，无需处理
      if (currentFirstSegment === targetFirstSegment) {
        continue;
      }
    }

    // 处理 permalink：先移除指定层级，再添加新前缀
    if (removeLevel !== undefined && removeLevel > 0) {
      // 分割 permalink（处理空字符串和开头的 /）
      const parts = originalPermalink.split("/").filter(part => part);
      // 确保移除的层级不超过实际存在的层级（removeLevel=99 时，会移除所有层级，只剩根路径）
      const actualRemoveLevel = Math.min(removeLevel, parts.length);
      // 移除前 N 个层级，再重新拼接
      const remainingParts = parts.slice(actualRemoveLevel);
      originalPermalink = remainingParts.length > 0 ? `/${remainingParts.join("/")}` : ""; // 移除所有层级后，originalPermalink 为 ""
    }

    // 拼接新 permalink 并返回结果（此时 prefix 已替换占位符）
    const newPermalink = `${normalizedPrefix}${originalPermalink}`;

    return { permalink: newPermalink };
  }
  return {};
};

/**
 * 创建 categories 分类列表
 *
 * @param fileInfo 文件信息
 * @param ignore 需要忽略的文件名或目录名
 */
export const createCategory = (fileInfo: FileInfo, ignore: string[] = []) => {
  const siteConfig: SiteConfig = (globalThis as any).VITEPRESS_CONFIG;
  const { locales = {} } = siteConfig.userConfig;

  const relativePathArr = fileInfo.relativePath.split("/");

  const categories: string[] = [];
  relativePathArr.forEach((item, index) => {
    // 去除「序号.」的前缀，并获取文件名
    const filename = item.replace(/^\d+\./, "").split(".")?.[0] || "";

    // 兼容国际化功能，如果配置多语言，则不添加多语言根目录名
    if (index !== relativePathArr.length - 1 && !locales[filename] && !ignore.includes(filename))
      categories.push(filename);
  });

  // [""] 表示添加一个为空的 categories
  return { categories: categories.length ? categories : [""] };
};

/**
 * 处理封面图
 *
 * @param coverImg 原始封面图
 * @param coverList 封面图列表
 * @param enableForceCoverImg 是否强制替换封面图
 */
export const createCoverImg = (coverList: string[]) => {
  return { coverImg: coverList[Math.floor(Math.random() * coverList.length)] };
};
