<script setup lang="ts" name="RightBottomButton">
import { provide } from "vue";
import { useData } from "vitepress";
import { useTeekConfig } from "../../../configProvider";
import { useNamespace } from "../../../hooks";
import BackTop from "./BackTop.vue";
import ToComment from "./ToComment.vue";
// import ThemeSize from "./ThemeSize.vue";
import ThemeStyle from "./ThemeStyle.vue";
import { rightBottomButtonNsSymbol } from "./rightBottomButton";
import type { ThemeSetting } from "../../../config/types";

defineOptions({ name: "RightBottomButton" });

const ns = useNamespace("right-bottom-button");
provide(rightBottomButtonNsSymbol, ns);

const { getTeekConfigRef } = useTeekConfig();
const { theme } = useData();
const themeSettingConfig = getTeekConfigRef<Required<ThemeSetting>>("themeSetting", {
  useThemeStyle: true,
  useThemeSize: true,
});
</script>

<template>
  <div :class="[ns.b(), ns.joinNamespace('wallpaper-outside'), 'flx-column']">
    <slot name="teek-right-bottom-before" />

    <BackTop />
    <ToComment v-if="theme.comment?.provider" />
    <!-- <ThemeSize v-if="themeSettingConfig.useThemeSize" /> -->
    <ThemeStyle v-if="themeSettingConfig.useThemeStyle" />

    <slot name="teek-right-bottom-after" />
  </div>
</template>
