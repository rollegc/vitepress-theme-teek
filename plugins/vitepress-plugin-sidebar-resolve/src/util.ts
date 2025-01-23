/**
 * 尝试从一个 md 文件中读取标题
 * @param markdownContent md 文件内容
 * @param deep true 是否寻找标题直到没有为止，false 只读取第一行 # 后的内容作为标题
 */
export const getTitleFromMd = (mdContent: string, deep = false): string | undefined => {
  if (deep) return mdContent.match(/^(#+)\s+(.+)/m)?.[2] || "";
  return getFirstTitleInMd(mdContent);
};

/**
 * 从 md 文件中获取第一行 # 后的内容作为标题
 *
 * @param mdContent md 文件内容
 */
export const getFirstTitleInMd = (mdContent: string) => {
  // 切割换行符 \r\n 或 \n
  const lines = mdContent.split(/\r?\n/);

  if (lines[0].startsWith("# ")) return lines[0].substring(2);

  return undefined;
};

/**
 * 判断是否已 md/MD 结尾
 *
 * @param fileExtension 文件后缀名
 */
export const isMdFileExtension = (fileExtension: string) => {
  return ["md", "MD"].includes(fileExtension);
};

/**
 * 判断是否非法的序号
 *
 * @param index 序号
 */
export const isIllegalIndex = (index: number) => {
  return isNaN(index) || index < 0;
};
