import crypto from "crypto";

/**
 * 替换字符串中的 $UUID{n} 和 $PATH{n} 占位符
 * $UUID 支持 $UUID2, $UUID5, $UUID10 等格式
 * - n 默认5位
 * - n 取值[1 - 15]之间
 * - 不区分大小写
 *
 * $PATH 支持 $PATH, $PATH10 等格式， 代表一级目录并将其转为为 hash 值
 * - n 默认 6 位
 * - n 取值[6 - 10]之间，低于 6 按 6 处理（防止碰撞）
 * - 不区分大小写
 *
 * @param placeholderStr 原始字符串
 * @param path 文件相对路径
 * @example
 * replacePlaceholder('/test/$UUID10') → '/test/a3k9m2x8p1'
 * replacePlaceholder('/user/$UUID5/$UUID2') → '/user/abc12/de'
 * replacePlaceholder('/$path/abc') → '/0.1指南/abc' → '/264ca4/abc'
 * replacePlaceholder('/$path3/abc') → '/0.1指南/abc' → '/264ca4/abc' (自动调整为6位)
 * replacePlaceholder('/$path-$uuid2/teek/$uuid1/$uuid') → '/264ca4-ls/teek/c/4ccyr' (混搭)
 */
export const replacePlaceholder = (placeholderStr: string, path: string): string => {
  // 处理 $UUID 占位符
  let result = placeholderStr.replace(/\$UUID(\d*)/gi, (match, numStr) => {
    // 如果指定了长度，则使用指定长度，否则默认为5位
    const length = numStr ? parseInt(numStr, 10) : 5;
    return generateRandomString(length);
  });

  // 处理 $PATH 占位符（支持 $PATH{n} 格式）
  result = result.replace(/\$PATH(\d*)/gi, (match, numStr) => {
    // 处理长度：默认 6 位，低于 6 位按 6 位处理，超过 10 位按 10 位处理
    let length = 6; // 默认 5 位
    if (numStr) {
      const parsed = parseInt(numStr, 10);
      length = Math.max(6, Math.min(parsed, 10)); // 确保在 6-10 之间
    }
    // 获取路径的一级目录
    const firstSegment = getFirstPathSegment(path);
    // 将一级目录转换为哈希值
    return getHashByFirstPath(firstSegment, length);
  });

  return result;
};

/**
 * 清理路径中的无效层级（纯空格、空字符串）
 * @param path 原始路径（如 / /testawe/a/$uuid1）
 * @returns 清理后的路径（如 /testawe/a/$uuid1）
 */
export const cleanPathSpaces = (path: string): string => {
  // 按 / 分割路径
  const segments = path.split("/");
  // 过滤无效层级：排除空字符串和纯空格（trim后为空）
  const validSegments = segments.filter(segment => segment.trim() !== "");
  // 重新拼接路径（确保以 / 开头，结尾无多余 /）
  return validSegments.length > 0 ? `/${validSegments.join("/")}` : "";
};

/**
 * 获取路径按 / 分割后的第一个有效分组（忽略空字符串）
 * @param path
 */
export const getFirstPathSegment = (path: string): string => {
  const segments = path.split("/").filter(segment => segment.trim() !== "");
  return segments.length > 0 ? segments[0] : "";
};

/**
 * 生成指定长度的随机字符串（数字 + 小写字母）
 *
 * @param length 字符串长度（最大为 10）
 */
const generateRandomString = (length: number): string => {
  if (length <= 0) return "";
  const maxLen = 10;
  const actualLength = Math.min(length, maxLen); // 最大 10 位

  const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  const charsLength = chars.length;
  let result = "";

  for (let i = 0; i < actualLength; i++) {
    result += chars[Math.floor(Math.random() * charsLength)];
  }

  return result;
};

const getHashByFirstPath = (path: string, length: number): string => {
  // 生成 SHA-256 哈希（十六进制）
  const hash = crypto.createHash("sha256").update(path, "utf8").digest("hex");

  // 截取前 N 位（确保不超过哈希长度）
  return hash.slice(0, Math.min(length, hash.length));
};
