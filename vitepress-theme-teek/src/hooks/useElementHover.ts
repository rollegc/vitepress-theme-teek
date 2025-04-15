import { MaybeRefOrGetter, shallowRef } from "vue";
import type { ShallowRef } from "vue";
import { useEventListener } from "./useEventListener";
import { isClient } from "../helper";

export interface UseElementHoverOptions {
  delayEnter?: number;
  delayLeave?: number;
}

export function useElementHover(
  el: MaybeRefOrGetter<EventTarget | null | undefined>,
  options: UseElementHoverOptions = {}
): ShallowRef<boolean> {
  const { delayEnter = 0, delayLeave = 0 } = options;

  const isHovered = shallowRef(false);
  let timer: ReturnType<typeof setTimeout> | null;

  const toggle = (entering: boolean) => {
    const delay = entering ? delayEnter : delayLeave;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    if (delay) timer = setTimeout(() => (isHovered.value = entering), delay);
    else isHovered.value = entering;
  };

  if (!isClient) return isHovered;

  useEventListener(el, "mouseenter", () => toggle(true), { passive: true });
  useEventListener(el, "mouseleave", () => toggle(false), { passive: true });

  return isHovered;
}
