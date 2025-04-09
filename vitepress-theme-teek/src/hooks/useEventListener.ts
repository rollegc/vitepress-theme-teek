/* eslint-disable no-undef */
import { onMounted, onUnmounted } from "vue";

type ElType = EventTarget | Element | null | (() => EventTarget | Element | null);

export const useEventListener = (
  el: ElType,
  event: string,
  handler: (event: any) => void,
  options?: AddEventListenerOptions,
  condition?: () => boolean
) => {
  const add = () => {
    if (condition && !condition()) return;

    el = typeof el === "function" ? el() : el;
    el?.addEventListener(event, handler, options);
  };

  const remove = () => {
    if (condition && !condition()) return;

    el = typeof el === "function" ? el() : el;
    el?.removeEventListener(event, handler, options);
  };

  onMounted(() => {
    add();
  });

  onUnmounted(() => {
    remove();
  });

  // 返回移除事件的函数
  return remove;
};
