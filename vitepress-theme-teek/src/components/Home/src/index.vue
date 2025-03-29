<script setup lang="ts" name="Home">
import { computed, ref, unref, provide } from "vue";
import { useData } from "vitepress";
import { postDataUpdateSymbol } from "./home";
import { useNamespace } from "../../../hooks";
import { usePage } from "../../../configProvider";
import HomeFullscreenWallpaper from "../../HomeFullscreenWallpaper";
import HomeBanner from "../../HomeBanner";
import HomeRightInfo from "../../HomeRightInfo";
import HomePostList, { type TkHomePostListInstance } from "../../HomePostList";

defineOptions({ name: "Home" });

const ns = useNamespace("home");

const { isHomePage } = usePage();
const { theme, frontmatter } = useData();

const themeConfig = computed(() => {
  const { tkHome = true, banner = {}, wallpaper = {}, bodyBgImg = {} } = { ...unref(theme), ...unref(frontmatter).tk };
  return { tkHome, banner, wallpaper, bodyBgImg };
});

const homePostListInstance = ref<TkHomePostListInstance | null>(null);

provide(postDataUpdateSymbol, () => unref(homePostListInstance)?.updateData());
</script>

<template>
  <div :class="ns.b()">
    <HomeBanner v-if="isHomePage && (themeConfig.banner.enabled ?? true)">
      <template v-for="(_, name) in $slots" :key="name" #[name]>
        <slot :name="name" />
      </template>
    </HomeBanner>

    <div :class="[ns.e('content'), ns.joinNamespace('wallpaper-outside'), 'flx-start-justify-center']">
      <div :class="ns.e('content__post')">
        <slot name="teek-home-post-before" />
        <HomePostList ref="homePostListInstance" />
        <slot name="teek-home-post-after" />
      </div>

      <div :class="ns.e('content__info')">
        <HomeRightInfo>
          <template v-for="(_, name) in $slots" :key="name" #[name]>
            <slot :name="name" />
          </template>
        </HomeRightInfo>
      </div>
    </div>

    <HomeFullscreenWallpaper
      v-if="themeConfig.wallpaper.enabled && (themeConfig.banner.bgStyle === 'fullImg' || themeConfig.bodyBgImg.imgSrc)"
    />
  </div>
</template>
