/**
 * 防抖函数
 * 
 * @param func 回调函数
 * @param delay 延迟时间
 * @param immediate 是否立即执行，如果为 true，则立即执行回调函数，否则在延迟时间后执行
 */
export const useDebounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  immediate = true
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout>;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    const context = this;

    const later = () => {
      timer = null as any;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timer;
    clearTimeout(timer);
    timer = setTimeout(later, delay);

    if (callNow) func.apply(context, args);
  };
};
