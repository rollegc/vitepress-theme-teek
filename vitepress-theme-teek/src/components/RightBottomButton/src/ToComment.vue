<script setup lang="ts" name="ToComment">
import { computed, unref, ref, inject } from "vue";
import { useTeekConfig } from "../../../configProvider";
import { useNamespace, useLocale, useDebounce } from "../../../hooks";
import Icon from "../../Icon";
import Message from "../../Message";
import { commentIcon } from "../../../assets/icons";
import type { ThemeSetting } from "../../../config/types";
import { rightBottomButtonNsSymbol } from "./rightBottomButton";

defineOptions({ name: "ToComment" });

const ns = inject(rightBottomButtonNsSymbol, useNamespace("right-bottom-button"));
const { t } = useLocale();

const { getTeekConfigRef } = useTeekConfig();

const themeSettingConfig = getTeekConfigRef<Required<ThemeSetting>>("themeSetting", {
  toCommentDone: undefined,
  titleTip: {},
});

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
    unref(themeSettingConfig).toCommentDone?.(Message);
  }, 600);
}, 500);
</script>

<template>
  <transition :name="ns.joinNamespace('fade')">
    <div
      v-show="showToComment"
      :title="themeSettingConfig.titleTip.toComment ?? t('tk.rightBottomButton.toComment')"
      :class="ns.e('button')"
      @click="scrollToComment"
      role="button"
      :aria-label="themeSettingConfig.titleTip.toComment ?? t('tk.rightBottomButton.toComment')"
    >
      <Icon :icon="commentIcon" aria-hidden="true" />
    </div>
  </transition>
</template>
