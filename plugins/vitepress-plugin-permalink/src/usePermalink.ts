import { useRouter, useData, inBrowser } from "vitepress";
import { nextTick, onMounted } from "vue";

export default function usePermalink() {
  const fakeHost = "http://a.com";
  const router = useRouter();
  const { site, theme, localeIndex } = useData();
  const { base, cleanUrls } = site.value;
  const { permalinks = {} } = theme.value;
  const permalinkKeys = Object.keys(permalinks);

  /**
   * 为 vitepress 的 router 添加 push 方法，支持手动跳转 permalink
   * 根据传入的 href 动态判断是否为文档地址或 permalink，如果为文档地址，则走 vitepress 默认的 go 方法，如果为 permalink，则根据 permalink 跳转对应的文档地址
   *
   * @param href 访问的文档地址或 permalink
   */
  router.push = (href = inBrowser ? location.href : "/") => {
    if (!href) throw new Error("href is undefined");
    if (href === base) return router.go(href);

    const { pathname, search, hash } = new URL(href, fakeHost);

    // 这里假设 decodePath 是 permalink
    const decodePath =
      "/" +
      decodeURIComponent(pathname.slice(base.length))
        .replace(/\.html/, "")
        .replace(/\/$/, "");
    const decodeHash = decodeURIComponent(hash);

    const li = localeIndex.value;
    const finalPath = cleanUrls ? decodePath : decodePath + ".html";
    // 根据 permalink 获取 filePath
    const filePath = (li === "root" ? "" : permalinks.inv[`/${li}${finalPath}`]) || permalinks.inv[finalPath];

    if (filePath && filePath !== decodePath) router.go(`${filePath}${search}${decodeHash}`);

    // 走到这里已经 href 确定为 filePath，直接走 vitepress 默认的 go 方法
    router.go(href);
  };

  /**
   * 判断路由是否为文档路由
   * 1. 如果为文档路由，则替换为 permalink
   * 2. 如果为 permalink，则跳转到文档路由，然后重新触发该方法的第 1 点，即将文档路由替换为 permalink（先加载 404 页面再瞬间跳转文档路由）
   *
   * @param href 浏览器地址栏
   * @remark 第 2 点的逻辑已由 vitepress-plugin-permalink 插件实现了（不会出现 404 页面过渡），因此现在是在插件执行后，重新触发该方法，替换 URL 为 permalink
   */
  const replaceUrlWhenPermalinkExist = (href: string) => {
    if (!permalinkKeys.length) return;

    const b = base.replace(/\/$/, "");
    const { pathname, search, hash } = new URL(href, fakeHost);

    // 解码，支持中文
    const decodePath = decodeURIComponent(pathname.startsWith(base) ? pathname.slice(b.length) : pathname);
    const decodeHash = decodeURIComponent(hash);

    const permalink = permalinks.map[decodePath.replace(/^\//, "").replace(/\.html/, "")];

    // 如果当前 pathname 和 permalink 相同，则不需要处理
    if (permalink === decodePath) return;

    if (permalink) {
      // 存在 permalink 则在 URL 替换
      nextTick(() => {
        history.replaceState(history.state || null, "", `${b}${permalink}${search}${decodeHash}`);
      });
    } else {
      // 第二点，不存在 permalink 则获取文档地址来跳转
      const path = permalinks.inv[decodePath];
      if (path) return router.push(`${base}${path}${search}${decodeHash}`);
    }
  };

  onMounted(() => replaceUrlWhenPermalinkExist(window.location.href));

  /**
   * 尝试获取国际化环境下的路由地址
   * 使用场景；当文档内通过 []() 来引入一个 permalink 且 permalink 为 /xx 时，该方法自动拼接多语言 如 /en/xx 来获取文件地址
   *
   * @param href 路由地址
   */
  const getLocaleFilePath = (href: string) => {
    const { pathname } = new URL(href, fakeHost);
    if (href === base) return;

    const decodePath = decodeURIComponent(pathname.slice(base.length)).replace(/\/$/, "");
    // 如果 permalink 已经带有多语言前缀，则不执行该方法
    if (decodePath.startsWith(`${localeIndex.value}/`)) return;

    const finalPath = cleanUrls ? decodePath : decodePath + ".html";
    return permalinks.inv[`/${localeIndex.value}/${finalPath}`];
  };

  /**
   * 监听路由变化（刷新页面不会触发），处理路由地址
   */
  const startWatch = () => {
    if (!permalinkKeys.length) return;

    const selfOnBeforeRouteChange = router.onBeforeRouteChange;
    router.onBeforeRouteChange = (href: string) => {
      // 调用已有的 onBeforeRouteChange
      const selfResult = selfOnBeforeRouteChange?.(href);
      if (selfResult === false) return false;

      // 如果不是国际化环境，则不处理
      if (localeIndex.value === "root") return;
      const filePath = getLocaleFilePath(href);

      if (filePath) {
        // 如果存在多语言文件地址，则跳转
        router.go(base + filePath);
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
  };

  return { startWatch };
}
