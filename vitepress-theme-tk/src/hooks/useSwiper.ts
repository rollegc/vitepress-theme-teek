import { ref } from "vue";

export const useSwiper = (list: any[], limit: number, intervalTime = 3000) => {
  const visibleData = ref(list.slice(0, limit));
  let currentIndex = limit;
  let intervalId: NodeJS.Timeout | null = null;

  const startScroll = () => {
    intervalId = setInterval(() => {
      const nextIndex = (currentIndex + 1) % list.length;

      visibleData.value.push(list[nextIndex]);
      visibleData.value.shift();

      currentIndex = nextIndex;
    }, intervalTime);
  };

  const stopScroll = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  return {
    visibleData,
    startScroll,
    stopScroll,
  };
};
