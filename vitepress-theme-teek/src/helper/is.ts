/**
 * 是否为合法的 URL 前缀
 */
export const isExternal = (path: string) => /^(http?:|https?:|mailto:|tel:)/.test(path);

/**
 * 是否是有效的 URL
 */
export const isValidURL = (url: string) => {
  const reg =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return reg.test(url);
};

/**
 * 判断数据类型
 * @param {Any} val 需要判断类型的数据
 * @return string
 */
export const isType = (val: any) => {
  if (val === null) return "null";
  if (typeof val !== "object") return typeof val;
  else return Object.prototype.toString.call(val).slice(8, -1).toLocaleLowerCase();
};

/**
 * 判断值是否未某个类型
 */
export const is = (val: unknown, type: string) => {
  return Object.prototype.toString.call(val) === `[object ${type}]`;
};

/**
 * 是否为函数
 */
export const isFunction = <T = Function>(val: unknown): val is T => {
  return is(val, "Function");
};

/**
 * 是否已定义
 */
export const isDef = <T = unknown>(val?: T): val is T => {
  return typeof val !== "undefined";
};

/**
 * 是否为未定义
 */
export const isUnDef = <T = unknown>(val?: T): val is T => {
  return !isDef(val);
};

/**
 * 是否为对象
 */
export const isObject = (val: any): val is Record<any, any> => {
  return val !== null && is(val, "Object");
};

/**
 * 是否为时间
 */
export const isDate = (val: unknown): val is Date => {
  return is(val, "Date");
};

/**
 * 是否是有效的数字（包含正负整数，0 以及正负浮点数）
 */
export const isNumber = (val: unknown): val is number => {
  const regPos = /^\d+(\.\d+)?$/; // 非负浮点数
  const regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; // 负浮点数
  if (regPos.test(val as string) || regNeg.test(val as string)) {
    return true;
  } else {
    return false;
  }
};

/**
 *  是否为 AsyncFunction
 */
export const isAsyncFunction = <T = any>(val: unknown): val is Promise<T> => {
  return is(val, "AsyncFunction");
};

/**
 *  是否为 promise
 */
export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
  return is(val, "Promise") && isObject(val) && isFunction(val.then) && isFunction(val.catch);
};

/**
 *  是否为字符串
 */
export const isString = (val: unknown): val is string => {
  return is(val, "String");
};

/**
 *  是否为boolean类型
 */
export const isBoolean = (val: unknown): val is boolean => {
  return is(val, "Boolean");
};

/**
 * 是否为数组
 */
export const isArray = (arg: any) => {
  if (typeof Array.isArray === "undefined") {
    return Object.prototype.toString.call(arg) === "[object Array]";
  }
  return Array.isArray(arg);
};

/**
 * 是否客户端
 */
export const isClient = () => {
  return typeof window !== "undefined";
};

/**
 * 是否为浏览器
 */
export const isWindow = (val: any): val is Window => {
  return typeof window !== "undefined" && is(val, "Window");
};

/**
 * 是否为元素节点
 */
export const isElement = (val: unknown): val is Element => {
  return isObject(val) && !!val.tagName;
};

/**
 * 是否为服务器
 */
export const isServer = typeof window === "undefined";
/**
 * 是否在浏览器中
 */
export const inBrowser = typeof document !== "undefined";

// 是否为图片节点
export const isImageDom = (o: Element) => {
  return o && ["IMAGE", "IMG"].includes(o.tagName);
};

/**
 * 是否为 null
 */
export const isNull = (val: unknown): val is null => {
  return val === null;
};

/**
 * 是否为 null 且未定义
 */
export const isNullAndUnDef = (val: unknown): val is null | undefined => {
  return isUnDef(val) && isNull(val);
};

/**
 * 是否为 null 或未定义
 */
export const isNullOrUnDef = (val: unknown): val is null | undefined => {
  return isUnDef(val) || isNull(val);
};

/**
 * 是否为手机号
 */
export const isPhone = (val: string) => {
  return /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(val);
};

/**
 * 是否是图片链接
 */
export const isImgPath = (path: string): boolean => {
  return /(https?:\/\/|data:image\/).*?\.(png|jpg|jpeg|gif|svg|webp|ico)/gi.test(path);
};

/**
 * 是否为空值项（包含数组、对象判断）
 * @param checkFull 是否检查数组、对象是否为空。默认 true
 */
export const isEmpty = (val: any, checkFull = true): boolean => {
  // NaN 的检查
  if (isNumber(val) && isNaN(val)) return true;

  // 检查空字符串、null 和 undefined
  if (val === "" || val === null || val === undefined) return true;

  if (!checkFull) return false;

  // 检查是不是数组并且长度为 0
  if (isArray(val) && val.length === 0) return true;

  // 检查是不是对象并且没有自身可枚举属性
  if (isObject(val) && Object.keys(val).length === 0) return true;

  // 如果以上都不是，则不为空
  return false;
};
