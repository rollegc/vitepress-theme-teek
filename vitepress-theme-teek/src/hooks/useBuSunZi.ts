import { onBeforeUnmount, Ref, ref, unref } from "vue";

export interface BusuanziData {
  site_pv: number;
  page_pv: number;
  site_uv: number;
}

const callBsz = (url = "//busuanzi.ibruce.info/busuanzi?jsonpCallback=BusuanziCallback"): Promise<BusuanziData> => {
  const jsonpCallback = "BusuanziCallback_" + Math.floor(1099511627776 * Math.random());
  url = url.replace("=BusuanziCallback", "=" + jsonpCallback);

  const scriptDom = document.createElement("script") as HTMLScriptElement;
  scriptDom.type = "text/javascript";
  scriptDom.defer = true;
  scriptDom.src = url;
  document.body.appendChild(scriptDom);

  let response: BusuanziData;

  (window as any)[jsonpCallback] = (data: BusuanziData) => (response = data);

  return new Promise((resolve, reject) => {
    scriptDom.onload = () => {
      resolve(response);
      setTimeout(() => {
        document.body.removeChild(scriptDom);
      }, 10);
    };
    scriptDom.onerror = () => reject("Error Loading " + url);
  });
};

export interface UseBuSunZi {
  sitePv?: Ref<number>;
  siteUv?: Ref<number>;
  pagePv?: Ref<number>;
  isGet?: Ref<boolean | null>;
}

/**
 * 使用不蒜子统计网站访问量
 *
 * @param initRequest 是否初始化请求，即自动执行一次 request，类型 boolean
 * @param iteration 如果请求不蒜子接口失败，是否重试，重试 5 次后依然失败，则不再重试，类型 boolean
 * @param iterationTime 每次重试的时间，单位毫秒，类型 number
 */
export const useBuSunZi = (initRequest = false, iteration = false, iterationTime = 2000) => {
  const sitePv = ref(9999);
  const siteUv = ref(9999);
  const pagePv = ref(9999);
  const isGet = ref<boolean | null>(null);

  const request = () => {
    // 防止重复调用
    if (unref(isGet) === false) return;
    isGet.value = false;

    // 调用不蒜子接口
    callBsz().then(data => {
      sitePv.value = data.site_pv || unref(sitePv);
      siteUv.value = data.site_uv || unref(siteUv);
      pagePv.value = data.page_pv || unref(pagePv);
      isGet.value = true;
    });
  };

  // 第一次调用
  if (initRequest) request();

  if (iteration) {
    let intervalId: NodeJS.Timeout;
    let i = 0;

    // 如果第一次调用获取失败，每 3s 后重新调用，直至尝试 5 次或调用成功
    intervalId = setInterval(() => {
      if (!unref(isGet)) {
        i += iterationTime;
        if (i > iterationTime * 5) clearInterval(intervalId);
        request();
      } else clearInterval(intervalId);
    }, iterationTime);

    onBeforeUnmount(() => {
      if (intervalId) clearInterval(intervalId);
    });
  }

  return { sitePv, siteUv, pagePv, isGet, request };
};
