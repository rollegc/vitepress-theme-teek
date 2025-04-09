import { onBeforeUnmount, onMounted } from "vue";
import { inBrowser } from "vitepress";

let registeredEscapeHandlers: ((e: KeyboardEvent) => void)[] = [];

const cachedHandler = (event: KeyboardEvent) => {
  if (event.code === "Escape") {
    registeredEscapeHandlers.forEach(registeredHandler => registeredHandler(event));
  }
};

export const useEscapeKeydown = (handler: (e: KeyboardEvent) => void) => {
  onMounted(() => {
    if (registeredEscapeHandlers.length === 0) document.addEventListener("keydown", cachedHandler);
    if (inBrowser) registeredEscapeHandlers.push(handler);
  });

  onBeforeUnmount(() => {
    registeredEscapeHandlers = registeredEscapeHandlers.filter(registeredHandler => registeredHandler !== handler);
    if (registeredEscapeHandlers.length === 0) if (inBrowser) document.removeEventListener("keydown", cachedHandler);
  });
};
