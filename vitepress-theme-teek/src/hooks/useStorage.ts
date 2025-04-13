import { onMounted, ref, watchEffect } from "vue";

type StorageType = "localStorage" | "sessionStorage";

export const useStorage = <T = any>(key: string, initialValue: T, storageType: StorageType = "localStorage") => {
  const storage = storageType === "localStorage" ? localStorage : sessionStorage;

  const storedValue = storage.getItem(key);
  let parsedValue: T;

  if (storedValue === null || storedValue === undefined || storedValue === "") parsedValue = initialValue;
  else {
    try {
      parsedValue = JSON.parse(storedValue);
    } catch (error) {
      console.error(`[Teek Error] Failed to parse stored value for key "${key}":`, error);
      parsedValue = initialValue;
    }
  }

  const value = ref<T>(parsedValue);

  watchEffect(() => {
    storage.setItem(key, JSON.stringify(value.value));
  });

  onMounted(() => {
    window.addEventListener(
      "storage",
      event => {
        console.log(1);
        if (event?.storageArea !== storage) return;
        if (event?.key == null) return;
        if (event?.key !== key) return;

        const newValue = event.newValue;
        if (newValue === null || newValue === undefined || newValue === "") value.value = initialValue;
        else {
          try {
            value.value = JSON.parse(newValue);
          } catch (error) {
            console.error(`[Teek Error] Failed to parse new stored value for key "${key}":`, error);
            value.value = initialValue;
          }
        }
      },
      { passive: true }
    );
  });

  return value;
};
