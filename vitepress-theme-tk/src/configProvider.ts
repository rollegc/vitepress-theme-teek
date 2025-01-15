import { defineComponent, h, InjectionKey, provide, Ref, watch, type Component } from "vue";
import { useAnchorScroll } from "./hooks";
import { usePermalinks } from "./hooks";
import { Post } from "./types/post";
// @ts-ignore
import { data as posts } from "./data/posts.data";

const postSymbol: InjectionKey<Ref<Post>> = Symbol("post");

function createConfigProvider(Layout: Component) {
  return defineComponent({
    name: "ConfigProvider",
    setup(_, { slots }) {
      // 往主题注入数据
      provide(postSymbol, posts);

      // 开启监听器
      usePermalinks().startWatch();
      useAnchorScroll().startWatch();

      return () => h(Layout, null, slots);
    },
  });
}

export const configProvider = (Layout: Component) => {
  return createConfigProvider(Layout);
};
