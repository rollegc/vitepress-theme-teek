import { isNumber, isString, isStringNumber } from "./is";

/**
 * 为路径 path 添加站点根路径 base 前缀，等价于 vitepress 的 withBase。Markdown 插件需要用到
 */
export const withBase = (base: string, path: string | undefined) => {
  if (!path) return;
  return /^(?:[a-z]+:|\/\/)/i.test(path) || !path.startsWith("/") ? path : `${base}${path}`.replace(/\/+/g, "/");
};

/**
 * 将字符串的第一个字符大写
 */
export const upperFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const addUnit = (value?: string | number, defaultUnit = "px") => {
  if (!value) return "";
  if (isNumber(value) || isStringNumber(value)) return `${value}${defaultUnit}`;
  else if (isString(value)) return value;
  return "";
};
