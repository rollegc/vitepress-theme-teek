/* eslint-disable no-undef */
import { onMounted, onUnmounted } from "vue";

type ElType = EventTarget | Element | null | (() => EventTarget | Element | null);

/**
 * onMounted 监听事件，onUnmounted 取消监听事件
 * @param el 监听元素
 * @param event 监听事件
 * @param handler 事件处理函数
 * @param options 监听选项
 * @param condition 监听条件
 * @returns 移除事件的函数
 */
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
