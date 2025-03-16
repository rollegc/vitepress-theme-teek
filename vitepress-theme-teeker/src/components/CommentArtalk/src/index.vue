<script setup lang="ts" name="CommentArtalk">
import { onMounted, onUnmounted, ref, unref, watch } from "vue";
import { useData, useRouter } from "vitepress";
import { useUnrefData } from "../../../configProvider";
import { CommentProvider } from "../../../config/types";

defineOptions({ name: "CommentArtalk" });

const { isDark, page } = useData();
const { theme } = useUnrefData();

const { server, site }: CommentProvider["artalk"] = { ...theme.comment?.options };

const router = useRouter();
const artalkRef = ref<HTMLElement | null>(null);
const artalkJs = ref<HTMLScriptElement | null>(null);
const artalk = ref();

const initArtalk = () => {
  const Artalk = (window as any).Artalk;

  if (!Artalk || !unref(artalkRef)) return;

  artalk.value = Artalk.init({
    el: unref(artalkRef),
    darkMode: unref(isDark),
    pageKey: router.route.path,
    pageTitle: unref(page).title,
    server: server,
    site: site,
  });

  switchDark();
};

const initJs = () => {
  const t = unref(artalkJs);
  if (t) t.onload = initArtalk;
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

const reloadArtalk = () => {
  const a = unref(artalk);
  a?.update({
    pageKey: router.route.path,
    pageTitle: unref(page).title,
  });

  a?.reload();
};

onMounted(() => {
  if (!server) return;

  initJs();
  initRoute();
});

onUnmounted(() => {
  const a = unref(artalk);
  if (a) a.destroy();
});

const switchDark = () => {
  setTimeout(() => {
    const a = unref(artalk);
    if (a) a.setDarkMode(unref(isDark));
  }, 100);
};

watch(isDark, () => switchDark());
</script>

<template>
  <div class="artalk-container">
    <link v-if="server" rel="stylesheet" :href="`${server}/dist/Artalk.css`" crossorigin="anonymous" />
    <div id="artalk" ref="artalkRef" />
    <component v-if="server" :is="'script'" :src="`${server}/dist/Artalk.js`" crossorigin="anonymous" ref="artalkJs" />
  </div>
</template>
