export const useDesign = () => {
  const namespace = getComputedStyle(document.documentElement).getPropertyValue("--tk-namespace").trim();
  /**
   * @param scope 类名
   * @returns 返回空间名-类名
   */
  const getPrefixClass = (scope: string) => {
    return `${namespace}-${scope}`;
  };

  return {
    namespace,
    getPrefixClass,
  };
};
