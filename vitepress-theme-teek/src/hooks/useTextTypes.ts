import { ref, unref } from "vue";

export interface TypesOption {
  typesInTime?: number; // 打字间隔时间，单位：毫秒
  typesOutTime?: number; // 删字间隔时间，单位：毫秒
  typesNextTime?: number; // 换行间隔时间，单位：毫秒
  shuffle?: boolean; // 是否随机切换文本
}

export const useTextTypes = (typesArray: string[], option?: TypesOption) => {
  const { typesInTime = 200, typesOutTime = 100, typesNextTime = 800, shuffle = false } = option || {};

  const text = ref("");
  const shouldAnimate = ref(false);

  let originText = "";
  let typesInIntervalIdId: NodeJS.Timeout;
  let typesOutIntervalId: NodeJS.Timeout;
  // 为 originText 的长度服务
  let index = 0;
  // 为 typesArray 组下标服务
  let length = 0;

  /**
   * 打字
   */
  const typesIn = () => {
    // 打字时，关闭动画效果
    shouldAnimate.value = false;
    originText = unref(typesArray)[length];

    // 防止 originText 为空的情况
    if (!originText) return;

    text.value = originText.substring(0, index++);

    if (index > originText.length) {
      if (typesInIntervalIdId) clearInterval(typesInIntervalIdId);
      // 打字结束，开启动画效果
      shouldAnimate.value = true;
      setTimeout(() => {
        typesOutIntervalId = setInterval(() => {
          typesOut();
        }, typesOutTime);
      }, typesNextTime);
    }
  };
  /**
   * 删字
   */
  const typesOut = () => {
    if (index >= 0) {
      // 删字时，关闭动画效果
      shouldAnimate.value = false;
      text.value = originText.substring(0, index--);
    } else {
      if (typesOutIntervalId) clearInterval(typesOutIntervalId);
      // 删字结束，开启动画效果
      shouldAnimate.value = true;

      setTimeout(() => {
        if (shuffle) {
          // 随机选择下一个文本
          let newIndex: number;
          do {
            newIndex = Math.floor(Math.random() * unref(typesArray).length);
          } while (newIndex === length);

          length = newIndex;
        } else {
          // 按顺序选择下一个文本
          length = (length + 1) % unref(typesArray).length;
        }

        typesInIntervalIdId = setInterval(() => {
          typesIn();
        }, typesInTime);
      }, typesNextTime);
    }
  };

  /**
   * 开始打字
   */
  const startTypes = () => {
    shouldAnimate.value = false;
    typesInIntervalIdId = setInterval(() => {
      typesIn();
    }, typesInTime);
  };

  /**
   * 停止打字
   */
  const stopTypes = () => {
    if (typesInIntervalIdId) clearInterval(typesInIntervalIdId);
    if (typesOutIntervalId) clearInterval(typesOutIntervalId);
    shouldAnimate.value = false;
  };

  return { text, shouldAnimate, startTypes, stopTypes };
};
