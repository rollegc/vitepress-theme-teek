import { defineComponent, h, inject, InjectionKey, provide, unref, type Component } from "vue";
import { useAnchorScroll, useViewTransition } from "./hooks";
import type { Post } from "./data/types";
// @ts-ignore
import { data as posts } from "./data/posts.data";
import { useData } from "vitepress";
import usePermalinks from "vitepress-plugin-permalink/src/usePermalinks";

export const postsSymbol: InjectionKey<Post> = Symbol("posts");

function createConfigProvider(Layout: Component) {
  return defineComponent({
    name: "ConfigProvider",
    setup(_, { slots }) {
      // 往主题注入数据
      provide(postsSymbol, posts);

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

export const usePosts = () => {
  const posts = inject(postsSymbol);
  if (!posts) throw new Error("posts not properly injected in app");
  return posts;
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
