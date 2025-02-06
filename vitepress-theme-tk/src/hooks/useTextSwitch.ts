import { ref, unref } from "vue";
export const useTextSwitch = (textArray: string[], timeout = 0, init = false) => {
  const text = ref("");
  const index = ref(-1);
  let timer: NodeJS.Timeout;

  const startTimer = () => {
    if (timer) clearTimeout(timer);
    if (timeout > 0) {
      timer = setTimeout(() => {
        switchText();
      }, timeout);
    }
  };

  const switchText = () => {
    // 启动定时器
    startTimer();

    if (textArray.length < 1) return;

    index.value = (unref(index) + 1) % textArray.length;
    const newValue = textArray[unref(index)];

    if (newValue === unref(text)) return;
    // 重新渲染数据，同时触发动画
    text.value = "";
    setTimeout(() => {
      text.value = newValue;
    }, 100);
  };

  // 初始化第一个 text
  if (init) switchText();

  return { text, index, switchText };
};
