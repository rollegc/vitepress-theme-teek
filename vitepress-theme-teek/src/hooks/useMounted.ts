import { getCurrentInstance, nextTick, onMounted, shallowRef } from "vue";

export interface UseMountedOptions {
  sync?: boolean;
  nexTick?: boolean;
}
export function useMounted(fn?: () => void, options: UseMountedOptions = {}) {
  const { sync = false, nexTick = true } = options;
  const isMounted = shallowRef(false);
  const instance = getCurrentInstance();

  if (instance) {
    onMounted(() => {
      isMounted.value = true;
      fn?.();
    }, instance);
  } else if (sync) fn?.();
  else if (nexTick) nextTick(fn);

  return isMounted;
}
