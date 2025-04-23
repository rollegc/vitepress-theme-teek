<script setup lang="ts" name="RightBottomButton">
import type { ThemeEnhance } from "@teek/config";
import { useData } from "vitepress";
import { useTeekConfig } from "@teek/components/theme/ConfigProvider";
import { mobileMaxWidthMedia, TkThemeEnhance } from "@teek/components/theme/ThemeEnhance";
import { useMediaQuery } from "@teek/hooks";
import { ns } from "./namespace";
import BackTop from "./BackTop.vue";
import ToComment from "./ToComment.vue";
import ThemeColor from "./ThemeColor.vue";

defineOptions({ name: "RightBottomButton" });

const { getTeekConfigRef } = useTeekConfig();
const themeEnhanceConfig = getTeekConfigRef<ThemeEnhance>("themeEnhance", {});
const { theme } = useData();

const isMobile = useMediaQuery(mobileMaxWidthMedia);
</script>

<template>
  <div :class="[ns.b(), ns.joinNamespace('wallpaper-outside'), 'flx-column']">
    <slot name="teek-right-bottom-before" />

    <BackTop />
    <ToComment v-if="theme.comment?.provider" />
    <TkThemeEnhance
      v-if="!isMobile && themeEnhanceConfig.position === 'bottom'"
      :class="ns.e('button')"
      position="bottom"
      :y-offset="7"
    />
    <ThemeColor v-if="isMobile && !themeEnhanceConfig.themeColor?.disabled" />

    <slot name="teek-right-bottom-after" />
  </div>
</template>
