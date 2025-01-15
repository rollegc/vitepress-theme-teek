import { useRoute, useRouter, useData } from "vitepress";
import { nextTick, watch } from "vue";
import { inBrowser } from "../helper";

export function usePermalinks() {
  const fakeHost = "http://a.com";
  const route = useRoute();
  const router = useRouter();
  const { site } = useData();
  const { permalinks = {} } = site.value;
  // 先进行 entries 来缓存，防止方法里每次调用都 entries
  const entriesPermalink = Object.entries(permalinks);

  /**
   * 为 vitepress 的 router 添加 push 方法，支持手动跳转 permalink
   * 根据传入的 href 动态判断是否为文档地址或 permalink，如果为文档地址，则走 vitepress 默认的 go 方法，如果为 permalink，则根据 permalink 跳转对应的文档地址
   *
   * @param href 文档地址或 permalink
   */
  router.push = async (href = inBrowser ? location.href : "/") => {
    if (!href) throw new Error("href is undefined");

    const { pathname, search, hash } = new URL(href, fakeHost);
    // 解码，支持中文
    const decodePath = decodeURIComponent(pathname);
    const decodeHash = decodeURIComponent(hash);
    // 根据文档地址找 permalink
    let permalink = getPermalinkByPath(decodePath);

    // 如果当前 pathname 和 permalink 相同，则直接跳转，等价于直接调用 go 方法
    if (permalink === decodePath) return router.go(href);

    if (!permalink) {
      // 如果 permalink 不存在，则根据 permalink 找 pathname
      const path = getPathByPermalink(pathname);

      // 如果 path 存在，则进行更新
      if (path) {
        permalink = pathname;
        href = `${path}${search}${decodeHash}`;
      }
    }

    // 跳转前缓存当前页面的 url，防止浏览器回退和前进出现历史条目减少
    history.replaceState(history.state || null, "", href);

    // 执行 vitepress 的 go 方法进行跳转
    await router.go(href);

    // URL 替换为 permalink
    if (permalink) history.replaceState(history.state || null, "", `${permalink}${search}${decodeHash}`);
  };

  /**
   * 根据永久链接寻找文档路径
   *
   * @param permalink 永久链接
   */
  const getPathByPermalink = (permalink: string) => {
    for (const [key, value] of entriesPermalink) {
      if (value === permalink) return key;
    }
  };

  /**
   * 根据文档路径寻找永久链接
   *
   * @param pathname 文档路径
   */
  const getPermalinkByPath = (pathname: string) => {
    for (const [key, value] of entriesPermalink) {
      if (key === pathname) return value;
    }
  };

  /**
   * 监听路由变化，判断路由是否为文档链接，则将 URL 替换为 permalink；如果为 permalink，则跳转到文档页面并重写 URL 为 permalink；如果为
   */
  const startWatch = () => {
    watch(
      () => route.path,
      async () => {
        const { pathname, search, hash } = new URL(window.location.href, fakeHost);

        // 解码，支持中文
        const decodePath = decodeURIComponent(pathname);
        const decodeHash = decodeURIComponent(hash);
        const permalink = getPermalinkByPath(decodePath);

        // 如果当前 pathname 和 permalink 相同，则不需要处理
        if (permalink === decodePath) return;

        if (permalink) {
          // 存在 permalink 则在 URL 替换
          await nextTick();
          history.replaceState(history.state || null, "", `${permalink}${search}${decodeHash}`);
        } else {
          // 不存在 permalink 则跳转
          const path = getPathByPermalink(decodePath);
          if (path) return router.push(`${path}${search}${decodeHash}`);
        }
      },
      {
        immediate: true,
      }
    );
  };

  return { startWatch };
}
