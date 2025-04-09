/* eslint-disable no-undef */
import { onMounted, onUnmounted } from "vue";

export const useEventListener = (
  el: EventTarget | (() => EventTarget),
  event: string,
  handler: EventListenerOrEventListenerObject,
  options?: AddEventListenerOptions,
  condition?: () => boolean
) => {
  const add = () => {
    if (condition && !condition()) return;

    el = typeof el === "function" ? el() : el;
    el.addEventListener(event, handler, options);
  };

  const remove = () => {
    if (condition && !condition()) return;

    el = typeof el === "function" ? el() : el;
    el.removeEventListener(event, handler, options);
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
