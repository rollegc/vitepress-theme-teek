<script setup lang="ts" name="ToComment">
import { computed, unref, ref, inject } from "vue";
import { useData } from "vitepress";
import { useNamespace, useDebounce } from "../../../hooks";
import Icon from "../../Icon";
import { commentIcon } from "../../../assets/icons";
import type { ThemeSetting } from "../../../config/types";
import { namespaceSymbol } from "./rightBottomButton";

defineOptions({ name: "ToComment" });

const ns = inject(namespaceSymbol, useNamespace("rightBottomButton"));

const { theme } = useData();
const themeSettingConfig = computed<Required<ThemeSetting>>(() => ({
  toCommentDone: undefined,
  titleTip: {},
  ...unref(theme).themeSetting,
}));

// 前往评论区
const scrollTop = ref(0);

const showToComment = computed(() => {
  const docContentHeight = document.querySelector(".content-container .main")?.getBoundingClientRect().height;
  const docFooterHeight = document.querySelector(".VPDocFooter")?.getBoundingClientRect().height || 200;
  let height = 0;
  if (docContentHeight) height = docContentHeight - docFooterHeight - window.innerHeight / 2;

  return unref(scrollTop) < height;
});

const scrollToComment = useDebounce(() => {
  document.querySelector(`#${ns.joinNamespace("comment")}`)?.scrollIntoView({ behavior: "smooth" });
  setTimeout(() => {
    unref(themeSettingConfig).toCommentDone?.();
  }, 600);
}, 500);
</script>

<template>
  <transition :name="ns.joinNamespace('fade')">
    <div
      v-show="showToComment"
      :title="themeSettingConfig.titleTip.toComment ?? '前往评论'"
      :class="ns.e('button')"
      @click="scrollToComment"
    >
      <Icon :icon="commentIcon" />
    </div>
  </transition>
</template>
