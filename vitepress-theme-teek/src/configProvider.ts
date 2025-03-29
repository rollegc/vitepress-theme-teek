import { computed, defineComponent, h, InjectionKey, provide, Ref, unref, type Component } from "vue";
import { useData } from "vitepress";
import usePermalink from "vitepress-plugin-permalink/usePermalink";
import { useAnchorScroll, useViewTransition } from "./hooks";
import { emptyPost } from "./post/helper";
import type { Post } from "./post/types";

export const postsSymbol: InjectionKey<Post> = Symbol("posts");

/**
 * 创建 Layout 组件
 */
const createConfigProvider = (Layout: Component) => {
  return defineComponent({
    name: "ConfigProvider",
    setup(_, { slots }) {
      const { theme } = useData();
      // 往主题注入数据
      provide(postsSymbol, unref(theme).posts || emptyPost);

      // 开启监听器
      usePermalink().startWatch();
      useAnchorScroll().startWatch();
      useViewTransition();

      return () => h(Layout, null, slots);
    },
  });
};

export const configProvider = (Layout: Component) => {
  return createConfigProvider(Layout);
};

/**
 * 返回自定义页面标识
 */
export const usePage = () => {
  const { frontmatter } = useData();

  // 当前页面是否为首页
  const isHomePage = computed(
    () => !unref(isCategoriesPage) && !unref(isTagsPage) && unref(frontmatter).layout === "home"
  );
  // 当前页面是否为分类页
  const isCategoriesPage = computed(() => unref(frontmatter).categoriesPage);
  // 当前页面是否为标签页
  const isTagsPage = computed(() => unref(frontmatter).tagsPage);
  // 当前页面是否为归档页
  const isArchivesPage = computed(() => unref(frontmatter).archivesPage);
  // 当前页面是否为目录页
  const isCataloguePage = computed(() => unref(frontmatter).catalogue);

  return { isHomePage, isCategoriesPage, isTagsPage, isArchivesPage, isCataloguePage };
};

/**
 * 返回全部 Posts 数据
 */
export const useAllPosts = (): Post => {
  const { theme } = useData();
  const posts = unref(theme).posts;

  return posts || emptyPost;
};

/**
 * 返回 Posts 数据，当处于国际化环境时，返回对应语言的 Posts 数据，否则返回全部 Posts 数据
 */
export const usePosts = (): Ref<Post> => {
  const { localeIndex } = useData();
  const posts = useAllPosts();

  // 兼容国际化功能，先从多语言下获取 posts 数据，获取不到说明没有使用多语言功能，则获取所有 posts 数据。因为多语言可以随时切换，因此使用 computed
  return computed(() => posts.locales?.[unref(localeIndex)] || posts);
};

/**
 * 获取默认背景色
 */
export const useBgColor = () => {
  const { theme, frontmatter } = useData();
  return (
    unref(frontmatter).frontmatter ||
    unref(theme).bgColor || [
      "#e74c3c",
      "#409EFF",
      "#DAA96E",
      "#0C819F",
      "#27ae60",
      "#ff5c93",
      "#fd726d",
      "#f39c12",
      "#9b59b6",
    ]
  );
};
