<script setup lang="ts" name="CommentArtalk">
import { onMounted, onUnmounted, ref, unref, watch } from "vue";
import { useData } from "vitepress";
import { useUnrefData } from "../../../configProvider";
import { CommentProvider } from "../../../config/types";
import { useNamespace, useVpRouter } from "../../../hooks";

defineOptions({ name: "CommentArtalk" });

const ns = useNamespace("");
const vpRouter = useVpRouter();

const { isDark, page } = useData();
const { theme } = useUnrefData();

const { server, site }: CommentProvider["artalk"] = { ...theme.comment?.options };

const artalkRef = ref<HTMLElement | null>(null);
const artalkJs = ref<HTMLScriptElement | null>(null);
const artalk = ref();

const initArtalk = () => {
  const Artalk = (window as any).Artalk;

  if (!Artalk || !unref(artalkRef)) return;

  artalk.value = Artalk.init({
    el: unref(artalkRef),
    darkMode: unref(isDark),
    pageKey: vpRouter.route.path,
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

const reloadArtalk = () => {
  const a = unref(artalk);
  a?.update({
    pageKey: vpRouter.route.path,
    pageTitle: unref(page).title,
  });

  a?.reload();
};

onMounted(() => {
  if (!server) return;

  initJs();
  // 路由切换后更新评论内容
  vpRouter.bindAfterRouteChange(ns.joinNamespace("artalk"), () => reloadArtalk());
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
