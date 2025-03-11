import { onBeforeUnmount, ref, unref } from "vue";

export interface BusuanziData {
  site_pv: number;
  page_pv: number;
  site_uv: number;
}

let isLoaded = false;
let fnArray: Array<() => void> = [];

const ready = (callback: () => void) => {
  return isLoaded || ["interactive", "complete"].includes(document.readyState)
    ? callback.call(document)
    : fnArray.push(() => callback.call(document));
};

const fnCallback = () => {
  for (const fn of fnArray) {
    fn();
  }
  fnArray = [];
};

const domContentLoadedFn = () => {
  if (!isLoaded) {
    isLoaded = true;
    fnCallback.call(window);
    if (document.removeEventListener) document.removeEventListener("DOMContentLoaded", domContentLoadedFn, false);
  }
};

if (document.addEventListener) document.addEventListener("DOMContentLoaded", domContentLoadedFn, false);

const callBsz = (
  requestCallback: (data: BusuanziData) => void,
  url = "//busuanzi.ibruce.info/busuanzi?jsonpCallback=BusuanziCallback"
) => {
  const jsonpCallback = "BusuanziCallback_" + Math.floor(1099511627776 * Math.random());
  url = url.replace("=BusuanziCallback", "=" + jsonpCallback);
  const scriptTag = document.createElement("script") as HTMLScriptElement;
  scriptTag.type = "text/javascript";
  scriptTag.defer = true;
  scriptTag.src = url;

  // 确保 <head> 存在
  document.getElementsByTagName("HEAD")[0]?.appendChild(scriptTag);
  (window as any)[jsonpCallback] = (data: BusuanziData) => {
    ready(() => {
      try {
        requestCallback(data);
        if (scriptTag.parentElement) scriptTag.parentElement.removeChild(scriptTag);
      } catch (error) {
        console.error(error);
      }
    });
  };
};

export const useBuSunZi = (initRequest = false, iterationTime = 2000) => {
  const sitePv = ref(9999);
  const siteUv = ref(9999);
  const pagePv = ref(9999);
  const isGet = ref<boolean | null>(null);

  const request = () => {
    // 防止重复调用
    if (unref(isGet) === false) return;

    isGet.value = false;
    // 调用不蒜子接口
    callBsz(data => {
      sitePv.value = data.site_pv || unref(sitePv);
      siteUv.value = data.site_uv || unref(siteUv);
      pagePv.value = data.page_pv || unref(pagePv);
      isGet.value = true;
    });
  };

  // 第一次调用
  if (initRequest) request();

  let interval: NodeJS.Timeout;
  let i = 0;
  // 如果第一次调用获取失败，每 3s 后重新调用，直至尝试 5 次或调用成功
  interval = setInterval(() => {
    if (!unref(isGet)) {
      i += iterationTime;
      if (i > iterationTime * 5) clearInterval(interval);
      request();
    } else clearInterval(interval);
  }, iterationTime);

  onBeforeUnmount(() => {
    if (interval) clearInterval(interval);
  });

  return { sitePv, siteUv, pagePv, isGet, request };
};
