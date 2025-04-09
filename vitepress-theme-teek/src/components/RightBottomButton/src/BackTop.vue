<script setup lang="ts" name="BackTop">
import { computed, unref, onMounted, ref, inject } from "vue";
import { useTeekConfig } from "../../../configProvider";
import { useNamespace, useDebounce, useEventListener } from "../../../hooks";
import Icon from "../../Icon";
import { rocketIcon } from "../../../assets/icons";
import type { ThemeSetting } from "../../../config/types";
import { rightBottomButtonNsSymbol } from "./rightBottomButton";

defineOptions({ name: "BackTop" });

const ns = inject(rightBottomButtonNsSymbol, useNamespace("right-bottom-button"));

const { getTeekConfigRef } = useTeekConfig();
const themeSettingConfig = getTeekConfigRef<Required<ThemeSetting>>("themeSetting", {
  backTopDone: undefined,
  titleTip: {},
});

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
});

useEventListener(window, "scroll", watchScroll);
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
