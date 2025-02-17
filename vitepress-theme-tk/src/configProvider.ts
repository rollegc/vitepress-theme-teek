import { computed, defineComponent, h, InjectionKey, provide, unref, type Component } from "vue";
import { useAnchorScroll, useViewTransition } from "./hooks";
import type { Post } from "./post/types";
import { useData } from "vitepress";
import usePermalinks from "vitepress-plugin-permalink/src/usePermalinks";
import { emptyPost } from "./post/helper";

export const postsSymbol: InjectionKey<Post> = Symbol("posts");

function createConfigProvider(Layout: Component) {
  return defineComponent({
    name: "ConfigProvider",
    setup(_, { slots }) {
      const { theme } = useUnrefData();
      // 往主题注入数据
      provide(postsSymbol, theme.posts);

      // 开启监听器
      usePermalinks().startWatch();
      useAnchorScroll().startWatch();
      useViewTransition();

      return () => h(Layout, null, slots);
    },
  });
}

export const configProvider = (Layout: Component) => {
  return createConfigProvider(Layout);
};

export const useUnrefData = () => {
  const { theme, frontmatter, site, page } = useData();
  return { theme: unref(theme), frontmatter: unref(frontmatter), site: unref(site), page: unref(page) };
};

export const useAllPosts = (): Post => {
  const { theme } = useData();
  const posts = unref(theme).posts;

  if (!posts) return emptyPost;

  return posts;
};

export const usePosts = (): Post => {
  const { theme, localeIndex } = useData();
  const posts = unref(theme).posts;

  if (!posts) return emptyPost;

  // 兼容多语言功能，先从多语言下获取 posts 数据，获取不到说明没有使用多语言功能，则获取所有 posts 数据。因为多语言可以随时切换，因此使用 computed
  return computed(() => posts.locales?.[unref(localeIndex)] || posts);
};

export const isHomePage = () => {
  const { frontmatter } = useData();
  return !isCategoriesPage() && !isTagsPage() && unref(frontmatter).layout === "home";
};

export const isCategoriesPage = () => {
  const { frontmatter } = useData();
  return unref(frontmatter).categoriesPage;
};

export const isTagsPage = () => {
  const { frontmatter } = useData();
  return unref(frontmatter).tagsPage;
};

export const isArchivesPage = () => {
  const { frontmatter } = useData();
  return unref(frontmatter).archivesPage;
};

export const isCataloguePage = () => {
  const { frontmatter } = useData();
  return unref(frontmatter).catalogue;
};

export const getBgColor = () => {
  const { theme } = useData();
  return (
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
