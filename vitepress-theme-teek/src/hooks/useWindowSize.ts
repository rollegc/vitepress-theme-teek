import { ref } from "vue";
import { inBrowser } from "vitepress";
import { useDebounce } from "./useDebounce";
import { useEventListener } from "./useEventListener";

/**
 * 实时获取窗口大小
 *
 * @param sizeChangeCallback 钩子函数，当窗口发生改变时调用
 */
export const useWindowSize = (sizeChangeCallback?: (width: number, height: number) => undefined) => {
  const width = ref(Number.POSITIVE_INFINITY);
  const height = ref(Number.POSITIVE_INFINITY);

  const updateSize = useDebounce(() => {
    if (inBrowser) {
      width.value = window.innerWidth;
      height.value = window.innerHeight;
      sizeChangeCallback?.(width.value, height.value);
    }
  }, 100);

  useEventListener(window, "resize", updateSize, { passive: true }, () => inBrowser);

  updateSize();
  return { width, height, updateSize };
};
