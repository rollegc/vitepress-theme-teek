<script setup lang="ts" name="RightBottomButton">
import { computed, provide, unref } from "vue";
import { useData } from "vitepress";
import { useNamespace } from "../../../hooks";
import BackTop from "./BackTop.vue";
import ToComment from "./ToComment.vue";
import ThemeSize from "./ThemeSize.vue";
import ThemeStyle from "./ThemeStyle.vue";
import { namespaceSymbol } from "./rightBottomButton";
import type { ThemeSetting } from "../../../config/types";

defineOptions({ name: "RightBottomButton" });

const ns = useNamespace("rightBottomButton");
provide(namespaceSymbol, ns);

const { theme } = useData();
const themeSettingConfig = computed<Required<ThemeSetting>>(() => ({
  useThemeStyle: true,
  useThemeSize: true,
  ...unref(theme).themeSetting,
}));
</script>

<template>
  <div :class="[ns.b(), ns.joinNamespace('wallpaper-outside'), 'flx-column']">
    <slot name="teek-right-bottom-before" />

    <BackTop />
    <ToComment v-if="theme.comment?.provider" />
    <ThemeSize v-if="themeSettingConfig.useThemeSize" />
    <ThemeStyle v-if="themeSettingConfig.useThemeStyle" />

    <slot name="teek-right-bottom-after" />
  </div>
</template>
