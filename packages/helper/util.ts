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

/**
 * 添加单位，如 value 为 16，则返回 16px
 */
export const addUnit = (value?: string | number, defaultUnit = "px") => {
  if (!value) return "";
  if (isNumber(value) || isStringNumber(value)) return `${value}${defaultUnit}`;
  else if (isString(value)) return value;
  return "";
};

/**
 * 移除单位，如 value 为 16px，则返回 16
 */
export const removeUnit = (value?: string | number, defaultUnit = "px") => {
  if (!value) return;
  if (isNumber(value)) return value;
  if (isString(value)) return Number(value.replace(defaultUnit, ""));
  else return;
};

/**
 * 获取对象值
 */
export const get = (object: Record<string, any>, path: string, defaultValue?: any) => {
  let obj = { ...object };
  if (!path.includes(".")) return obj[path] || defaultValue;
  else {
    path.split(".").forEach(item => (obj = obj[item] ?? ""));
    return obj || defaultValue;
  }
};

/**
 * 解析元素的名字和属性，如果是 HTMl 原生元素，则只返回 name，如果是 Vue 组件，则返回 name 和 attrs
 */
export const parseElementNameAndAttrs = (elementStr: string) => {
  // 提取标签名（兼容原生 HTML 标签和 Vue 组件）
  const tagNameMatch = elementStr.match(/^<(\w+)/);
  if (!tagNameMatch) return { name: elementStr, isComponent: false };

  const tagName = tagNameMatch[1];
  const isComponent = /^[A-Z]/.test(tagName); // 判断是否为组件

  // 提取属性
  const attrsRegex = /([\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([\w-.]+)))?/gi;
  const attrs: Record<string, any> = {};
  let match: RegExpExecArray | null;

  while ((match = attrsRegex.exec(elementStr)) !== null) {
    const [, key, value1, value2, value3] = match;
    const value = value1 ?? value2 ?? value3 ?? true;

    // 处理类型
    if ((value as any) === true) attrs[key] = true;
    else if (!isNaN(value as any)) attrs[key] = Number(value);
    else if (value === "true") attrs[key] = true;
    else if (value === "false") attrs[key] = false;
    else attrs[key] = value;
  }

  return { name: tagName, attrs, isComponent };
};
