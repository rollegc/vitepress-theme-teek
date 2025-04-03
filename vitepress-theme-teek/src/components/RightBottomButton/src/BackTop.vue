<script setup lang="ts" name="BackTop">
import { computed, unref, onMounted, onUnmounted, ref, inject } from "vue";
import { useData } from "vitepress";
import { useNamespace, useDebounce } from "../../../hooks";
import Icon from "../../Icon";
import { rocketIcon } from "../../../assets/icons";
import type { ThemeSetting } from "../../../config/types";
import { namespaceSymbol } from "./rightBottomButton";

defineOptions({ name: "BackTop" });

const ns = inject(namespaceSymbol, useNamespace("rightBottomButton"));

const { theme } = useData();
const themeSettingConfig = computed<Required<ThemeSetting>>(() => ({
  backTopDone: undefined,
  titleTip: {},
  ...unref(theme).themeSetting,
}));

// 返回顶部 & 前往评论区
const scrollTop = ref(0);
const showToTop = computed(() => unref(scrollTop) > 100);
const progress = ref(0);

const scrollToTop = useDebounce(() => {
  document.querySelector("html")?.scrollIntoView({ behavior: "smooth" });
  setTimeout(() => {
    unref(themeSettingConfig).backTopDone?.();
  }, 600);
}, 500);

const watchScroll = () => {
  scrollTop.value = document.documentElement.scrollTop || document.body.scrollTop || 0;
  updateScrollProgress();
};
/**
 * 更新返回顶部的进度条
 */
const updateScrollProgress = () => {
  const p = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  progress.value = Math.round(p * 100);
};

onMounted(() => {
  updateScrollProgress();
  window.addEventListener("scroll", watchScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", watchScroll);
});
</script>

<template>
  <transition :name="ns.joinNamespace('fade')">
    <div
      v-show="showToTop"
      :title="themeSettingConfig.titleTip.backTop ?? '返回顶部'"
      :class="[ns.e('button'), 'back-top']"
      @click="scrollToTop"
      :style="{ [ns.cssVarName('progress')]: progress }"
    >
      <Icon :icon="rocketIcon"></Icon>
    </div>
  </transition>
</template>
