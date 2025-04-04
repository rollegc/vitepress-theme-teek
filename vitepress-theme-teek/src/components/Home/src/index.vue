<script setup lang="ts" name="Home">
import { ref, unref, provide } from "vue";
import { postDataUpdateSymbol } from "./home";
import { useNamespace } from "../../../hooks";
import { useTeekConfig, usePage } from "../../../configProvider";
import HomeFullscreenWallpaper from "../../HomeFullscreenWallpaper";
import HomeBanner from "../../HomeBanner";
import HomeRightInfo from "../../HomeRightInfo";
import HomePostList, { type TkHomePostListInstance } from "../../HomePostList";

defineOptions({ name: "Home" });

const ns = useNamespace("home");

const { isHomePage } = usePage();
const { getTeekConfigRef } = useTeekConfig();

const teekConfig = getTeekConfigRef(null, { teekHome: true, banner: {}, wallpaper: {}, bodyBgImg: {} });

const homePostListInstance = ref<TkHomePostListInstance | null>(null);

provide(postDataUpdateSymbol, () => unref(homePostListInstance)?.updateData());
</script>

<template>
  <div :class="ns.b()">
    <HomeBanner v-if="isHomePage && (teekConfig.banner.enabled ?? true)">
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
      v-if="teekConfig.wallpaper.enabled && (teekConfig.banner.bgStyle === 'fullImg' || teekConfig.bodyBgImg.imgSrc)"
    />
  </div>
</template>
