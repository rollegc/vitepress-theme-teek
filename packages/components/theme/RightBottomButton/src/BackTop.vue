<script setup lang="ts" name="BackTop">
import type { TeekConfig } from "@teek/config";
import { computed, unref, onMounted, ref } from "vue";
import { useLocale, useDebounce, useEventListener } from "@teek/hooks";
import { rocketIcon } from "@teek/static";
import { useTeekConfig } from "@teek/components/theme/ConfigProvider";
import { TkMessage } from "@teek/components/common/Message";
import { TkIcon } from "@teek/components/common/Icon";
import { ns } from "./namespace";

defineOptions({ name: "BackTop" });

const { t } = useLocale();

const { getTeekConfigRef } = useTeekConfig();
const backTopDone = getTeekConfigRef<TeekConfig["backTopDone"]>("backTopDone");

// 返回顶部 & 前往评论区
const scrollTop = ref(0);
const showToTop = computed(() => unref(scrollTop) > 100);
const progress = ref(0);

const scrollToTop = useDebounce(() => {
  document.querySelector("html")?.scrollIntoView({ behavior: "smooth" });
  setTimeout(
    () => {
      backTopDone.value?.(TkMessage);
    },
    600,
    true
  );
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
      :title="t('tk.rightBottomButton.backTopTitle')"
      :class="[ns.e('button'), 'back-top']"
      @click="scrollToTop"
      :style="{ [ns.cssVarName('progress')]: progress }"
      role="button"
      :aria-label="t('tk.rightBottomButton.backTopTitle')"
      :aria-valuenow="progress"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <TkIcon :icon="rocketIcon" aria-hidden="true" />
    </div>
  </transition>
</template>
