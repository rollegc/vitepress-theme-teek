// 获取传入的值的类型
const getValueType = (value: any) => {
  const type = Object.prototype.toString.call(value);
  return type.slice(8, -1);
};

/**
 * 创建一个用于管理存储的函数，根据传入的存储类型（sessionStorage 或 localStorage）返回相应的操作函数
 *
 * @param type 存储类型，默认为 sessionStorage
 */
export const useStorage = (type: "sessionStorage" | "localStorage" = "sessionStorage") => {
  const getStorage = (key: string) => {
    const value = window[type].getItem(key);
    if (value) {
      const { value: val } = JSON.parse(value);
      return val;
    } else return value;
  };

  const setStorage = (key: string, value: any) => {
    const valueType = getValueType(value);
    window[type].setItem(key, JSON.stringify({ _type: valueType, value }));
  };

  const removeStorage = (key: string) => {
    window[type].removeItem(key);
  };

  const removeStorages = (key: string[]) => {
    key.forEach(key => window[type].removeItem(key));
  };

  const clear = (excludes?: string[]) => {
    // 获取排除项
    const keys = Object.keys(window[type]);
    const defaultExcludes = [""];
    const excludesArr = excludes ? [...excludes, ...defaultExcludes] : defaultExcludes;
    const excludesKeys = excludesArr ? keys.filter(key => !excludesArr.includes(key)) : keys;
    // 排除项不清除
    excludesKeys.forEach(key => {
      window[type].removeItem(key);
    });
  };

  return {
    setStorage,
    getStorage,
    removeStorage,
    removeStorages,
    clear,
  };
};
