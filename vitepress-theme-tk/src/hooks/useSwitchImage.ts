import { ref } from "vue";
import { isArray, isString } from "../helper";

export const useSwitchImage = (src: string | string[], imgInterval = 15000) => {
  const imageSrc = ref<string | string[]>("");

  const startSwitch = () => {
    if (isString(src)) imageSrc.value = src;
    else if (isArray(src)) {
      let count = 0;
      let timer: NodeJS.Timeout | undefined = undefined;
      imageSrc.value = src[count];

      clearInterval(timer);

      timer = setInterval(() => {
        if (++count >= src.length) count = 0;
        imageSrc.value = src[count];

        // 预加载下一张图片
        if (src[count + 1]) {
          const img = new Image();
          img.src = src[count + 1];
        }
      }, imgInterval);
    }
  };

  return { imageSrc, startSwitch };
};
