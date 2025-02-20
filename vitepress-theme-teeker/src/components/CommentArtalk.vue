<script setup lang="ts" name="CommentArtalk">
import { onMounted, onUnmounted, ref, unref, watch } from "vue";
import { useUnrefData } from "../configProvider";
import { useData, useRouter } from "vitepress";
import { CommentProvider } from "../config/types";

const { isDark, page } = useData();
const { theme } = useUnrefData();

const { server, site }: CommentProvider["artalk"] = { ...theme.comment?.options };

const router = useRouter();
const artalkRef = ref();
const artalk = ref();

const initArtalk = () => {
  const Artalk = (window as any).Artalk;

  const observer = new MutationObserver((_, observer) => {
    if (Artalk && unref(artalkRef)) {
      artalk.value = Artalk.init({
        el: unref(artalkRef),
        darkMode: unref(isDark),
        pageKey: router.route.path,
        pageTitle: unref(page).title,
        server: server,
        site: site,
      });
      observer.disconnect();
    }
  });

  observer.observe(document.head, { subtree: true, childList: true, attributes: true, attributeFilter: ["id"] });
};

const reloadArtalk = () => {
  const a = unref(artalk);
  a.update({
    pageKey: router.route.path,
    pageTitle: unref(page).title,
  });

  a.reload();
};

const initRoute = () => {
  const selfOnAfterRouteChange = router.onAfterRouteChange;
  // 路由切换后的回调
  router.onAfterRouteChange = (href: string) => {
    selfOnAfterRouteChange?.(href);
    // 路由切换后更新评论内容
    reloadArtalk();
  };
};

onMounted(() => {
  if (!server) return;

  initArtalk();
  initRoute();
});

onUnmounted(() => {
  const a = unref(artalk);
  if (a) a.destroy();
});

watch(isDark, () => {
  const a = unref(artalk);
  if (a) a.setDarkMode(unref(isDark));
});
</script>

<template>
  <div class="artalk-container">
    <div id="artalk" ref="artalkRef" />
  </div>
</template>

<style lang="scss" scoped>
.artalk-container {
  --at-color-main: var(--vp-c-brand-2);
}
</style>
