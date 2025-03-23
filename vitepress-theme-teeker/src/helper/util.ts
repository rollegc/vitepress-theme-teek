/**
 * From Vitepress。Markdown 插件需要用到，因为 Vitepress 的 withBase 方法无法在 Markdown 插件使用
 */
export const withBase = (base: string, path?: string) => {
  if (!path) return;
  return /^(?:[a-z]+:|\/\/)/i.test(path) || !path.startsWith("/") ? path : `${base}${path}`.replace(/\/+/g, "/");
};

export const upperFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
