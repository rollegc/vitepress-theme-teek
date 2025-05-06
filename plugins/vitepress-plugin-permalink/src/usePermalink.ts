import { useRouter, useData } from "vitepress";
import { nextTick, onBeforeMount } from "vue";

export default function usePermalink() {
  const fakeHost = "http://a.com";
  const router = useRouter();
  const { site, theme, localeIndex } = useData();
  const { base, cleanUrls } = site.value;
  const { permalinks = {} } = theme.value;
  const permalinkKeys = Object.keys(permalinks);

  /**
   * 判断路由是否为文档路由，如果为文档路由，则替换为 permalink
   *
   * @param href 访问的文档地址或 permalink
   */
  const replaceUrlWhenPermalinkExist = (href: string) => {
    if (!permalinkKeys.length) return;

    const { pathname, search, hash } = new URL(href, fakeHost);
    // 解码，支持中文
    const decodePath = decodeURIComponent(pathname.slice(base.length));
    const permalink = permalinks.map[decodePath.replace(/\.html/, "")];

    if (!permalink) return router.onAfterUrlLoad?.(href);

    // 如果当前 pathname 和 permalink 相同，则不需要处理
    if (permalink === "/" + decodePath) return;

    // 存在 permalink 则在 URL 替换
    nextTick(() => {
      const to = base.replace(/\/$/, "") + permalink + search + hash;
      history.replaceState(history.state || null, "", to);

      router.onAfterUrlLoad?.(to);
    });
  };

  onBeforeMount(() => {
    if (!router.state.permalinkPlugin) router.state = { ...router.state, permalinkPlugin: true };
    replaceUrlWhenPermalinkExist(window.location.href);
  });

  /**
   * 尝试通过路由地址获取文件地址（当路由地址为 permalink 时才有值返回，否则返回空）
   *
   * @param pathname 访问的文档地址或 permalink
   */
  const teyGetFilePathByPermalink = (pathname: string) => {
    const decodePath =
      "/" +
      decodeURIComponent(pathname.slice(base.length))
        .replace(/\/$/, "")
        .replace(/\.html/, "");

    const li = localeIndex.value;
    // 假设为 permalink
    const maybeIsPermalink = cleanUrls ? decodePath : decodePath + ".html";
    // 实际的文件路径
    let filePath = "";

    // 使用场景；当文档内通过 []() 来引入一个 permalink 且 permalink 为 /xx 时，该方法自动拼接多语言 如 /en/xx 来获取文件地址
    if (li !== "root" && !maybeIsPermalink.startsWith(`/${li}/`)) {
      filePath = permalinks.inv[`/${li}${maybeIsPermalink}`];
    } else filePath = permalinks.inv[maybeIsPermalink];

    // 如果获取的文件路径和访问的路由地址一致，则返回空，不需要重复跳转
    if (filePath === decodePath) return "";
    return filePath;
  };

  /**
   * 监听路由变化（刷新页面不会触发），处理路由地址
   */
  const startWatch = () => {
    if (!permalinkKeys.length) return;

    const state = router.state || {};
    // 防止重复在 router 添加函数
    if (state.permalinkPlugin) return;

    const selfOnBeforeRouteChange = router.onBeforeRouteChange;
    router.onBeforeRouteChange = (href: string) => {
      // 调用已有的 onBeforeRouteChange
      const selfResult = selfOnBeforeRouteChange?.(href);
      if (selfResult === false) return false;
      if (href === base) return;

      const { pathname, search, hash } = new URL(href, fakeHost);

      // 尝试获取文件路径（当 pathname 为 permalink 时才获取成功）
      const filePath = teyGetFilePathByPermalink(pathname);

      if (filePath) {
        const targetUrl = base + filePath + search + hash;
        router.go(targetUrl);

        // 阻止本次路由跳转
        return false;
      }
    };

    const selfOnAfterRouteChange = router.onAfterRouteChange;
    router.onAfterRouteChange = (href: string) => {
      // 如果 permalink 存在，则替换掉 URL
      replaceUrlWhenPermalinkExist(href);
      // 调用已有的 onAfterRouteChange
      selfOnAfterRouteChange?.(href);
    };

    router.state = { ...router.state, permalinkPlugin: true };
  };

  return { startWatch };
}
