import type { PostData } from "@teek/config/post/types";
import type { TeekConfig } from "@teek/config";
import type { Component, Ref, InjectionKey } from "vue";
import { computed, defineComponent, h, inject, provide, unref } from "vue";
import { useData } from "vitepress";
import { useAnchorScroll, useViewTransition } from "@teek/hooks";
import { emptyPost } from "@teek/config/post/helper";
import { isFunction, isObject } from "@teek/helper";

export const postsContext: InjectionKey<PostData> = Symbol("posts");
export const teekConfigContext: InjectionKey<TeekConfig | Ref<TeekConfig>> = Symbol("teekConfig");

/**
 * 创建 Layout 组件
 */
export const TeekConfigProvider = (layout: Component) => {
  return defineComponent({
    name: "TeekConfigProvider",
    setup(_, { slots }) {
      // 往主题注入数据
      provide(postsContext, useAllPosts());

      // 开启监听器
      useAnchorScroll().startWatch();
      useViewTransition();

      return () => h(layout, null, slots);
    },
  });
};

/**
 * 返回自定义页面标识
 */
export const usePage = () => {
  const { frontmatter } = useData();

  // 当前页面是否为首页
  const isHomePage = computed(
    () => !isCategoriesPage.value && !isTagsPage.value && frontmatter.value.layout === "home"
  );
  // 当前页面是否为分类页
  const isCategoriesPage = computed(() => frontmatter.value.categoriesPage);
  // 当前页面是否为标签页
  const isTagsPage = computed(() => frontmatter.value.tagsPage);
  // 当前页面是否为归档页
  const isArchivesPage = computed(() => frontmatter.value.archivesPage);
  // 当前页面是否为目录页
  const isCataloguePage = computed(() => frontmatter.value.catalogue);

  return { isHomePage, isCategoriesPage, isTagsPage, isArchivesPage, isCataloguePage };
};

/**
 * 返回全部 Posts 数据
 */
export const useAllPosts = (): PostData => {
  const { theme } = useData();
  const posts = theme.value.posts;

  return posts || emptyPost;
};

/**
 * 返回 Posts 数据，当处于国际化环境时，返回对应语言的 Posts 数据，否则返回全部 Posts 数据
 */
export const usePosts = (): Ref<PostData> => {
  const { localeIndex } = useData();
  const posts = useAllPosts();

  // 兼容国际化功能，先从多语言下获取 posts 数据，获取不到说明没有使用多语言功能，则获取所有 posts 数据。因为多语言可以随时切换，因此使用 computed
  return computed(() => posts.locales?.[localeIndex.value] || posts);
};

/**
 * 获取默认背景色
 */
export const useTagColor = () => {
  const { getTeekConfigRef } = useTeekConfig();

  return getTeekConfigRef<NonNullable<TeekConfig["tagColor"]>>("tagColor", [
    { border: "#bfdbfe", bg: "#eff6ff", text: "#2563eb" },
    { border: "#e9d5ff", bg: "#faf5ff", text: "#9333ea" },
    { border: "#fbcfe8", bg: "#fdf2f8", text: "#db2777" },
    { border: "#a7f3d0", bg: "#ecfdf5", text: "#059669" },
    { border: "#fde68a", bg: "#fffbeb", text: "#d97706" },
    { border: "#a5f3fc", bg: "#ecfeff", text: "#0891b2" },
    { border: "#c7d2fe", bg: "#eef2ff", text: "#4f46e5" },
  ]);
};

/**
 * 获取 Teek 的主题配置数据
 * 支持（优先级） provide > frontmatter.tk.[key] > frontmatter.[key] > theme.[key] 4 种方式进行主题配置
 */
export const useTeekConfig = () => {
  const { theme, frontmatter } = useData();
  const teekConfigProvide = inject(teekConfigContext, {});

  /**
   * 获取 Teek 的主题配置数据
   *
   * @param key 配置项 key
   * @param defaultValue 如果读取 key 不存在时，则返回默认值
   */
  const getTeekConfig = <T = any>(key?: keyof TeekConfig | null, defaultValue?: any): T => {
    let dv = defaultValue;
    if (isFunction(defaultValue)) dv = defaultValue();

    // 返回所有 TeekConfig 数据
    if (!key) {
      return { ...dv, ...theme.value, ...frontmatter.value, ...frontmatter.value.tk, ...unref(teekConfigProvide) };
    }

    // 返回指定 key 的 TeekConfig 数据
    const valueFromTheme = theme.value[key];
    const valueFromFrontmatter = frontmatter.value.tk?.[key] ?? frontmatter.value[key];
    const valueFromInject = unref(teekConfigProvide)[key];

    // 对象格式，根据优先级合并里面的内容
    if (isObject(valueFromTheme) || isObject(valueFromFrontmatter) || isObject(valueFromInject)) {
      return { ...dv, ...valueFromTheme, ...valueFromFrontmatter, ...(valueFromInject as object) };
    }

    // 非对象格式，则根据优先级返回
    return valueFromInject || valueFromFrontmatter || valueFromTheme || dv;
  };

  /**
   * 获取 Teek 的主题配置数据（响应式）
   */
  const getTeekConfigRef = <T = any>(key?: keyof TeekConfig | null, defaultValue?: any) => {
    return computed(() => getTeekConfig<T>(key, defaultValue));
  };

  return { getTeekConfig, getTeekConfigRef };
};
