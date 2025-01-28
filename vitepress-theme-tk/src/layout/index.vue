<script setup lang="ts">
import { useData } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { computed, unref } from "vue";
import { useDesign } from "../hooks";
import HomeBanner from "../components/HomeBanner.vue";
import HomePostList from "../components/HomePostList.vue";
import HomeInfo from "../components/HomeInfo.vue";

defineOptions({
  name: "TkLayout",
});

const { theme } = useData();
const { Layout } = DefaultTheme;

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("layout");

const useKtTheme = computed(() => unref(theme).ktTheme ?? true);
</script>

<template>
  <Layout :class="prefixClass">
    <template #layout-top>
      <slot name="layout-top" />
    </template>
    <template #doc-before>
      <slot name="doc-before" />
    </template>
    <template #nav-bar-content-before>
      <slot name="nav-bar-content-before" />
    </template>

    <template #home-hero-before>
      <slot name="home-hero-before" />
      <!-- 自定义首页 -->
      <div v-if="useKtTheme" :class="`${prefixClass}-home`">
        <div :class="`${prefixClass}-home__banner`"><HomeBanner /></div>
        <div :class="`${prefixClass}-home-content`">
          <div :class="`${prefixClass}-home-content__list`"><HomePostList /></div>
          <div :class="`${prefixClass}-home-content__info`"><HomeInfo /></div>
        </div>
      </div>
    </template>

    <template #sidebar-nav-after>
      <slot name="sidebar-nav-after" />
    </template>
    <template #doc-after>
      <slot name="doc-after" />
    </template>
    <template #layout-bottom>
      <slot name="layout-bottom" />
    </template>

    <!-- navbar -->
    <template #nav-bar-title-before>
      <slot name="nav-bar-title-before" />
    </template>
    <template #nav-bar-title-after>
      <slot name="nav-bar-title-after" />
    </template>
    <template #nav-bar-content-after>
      <slot name="nav-bar-content-after" />
    </template>
    <template #nav-screen-content-before>
      <slot name="nav-screen-content-before" />
    </template>
    <template #nav-screen-content-after>
      <slot name="nav-screen-content-after" />
    </template>

    <!-- sidebar -->
    <template #sidebar-nav-before>
      <slot name="sidebar-nav-before" />
    </template>

    <!-- content -->
    <template #page-top>
      <slot name="page-top" />
    </template>
    <template #page-bottom>
      <slot name="page-bottom" />
    </template>

    <template #not-found>
      <slot name="not-found" />
    </template>
    <template #home-hero-info>
      <slot name="home-hero-info" />
    </template>
    <template #home-hero-image>
      <slot name="home-hero-image" />
    </template>
    <template #home-hero-after>
      <slot name="home-hero-after" />
    </template>
    <template #home-features-before>
      <slot name="home-features-before" />
    </template>
    <template #home-features-after>
      <slot name="home-features-after" />
    </template>

    <template #doc-footer-before>
      <slot name="doc-footer-before" />
    </template>

    <template #doc-top>
      <slot name="doc-top" />
    </template>
    <template #doc-bottom>
      <slot name="doc-bottom" />
    </template>

    <template #aside-top>
      <slot name="aside-top" />
    </template>
    <template #aside-bottom>
      <slot name="aside-bottom" />
    </template>
    <template #aside-outline-before>
      <slot name="aside-outline-before" />
    </template>
    <template #aside-outline-after>
      <slot name="aside-outline-after" />
    </template>
    <template #aside-ads-before>
      <slot name="aside-ads-before" />
    </template>
    <template #aside-ads-after>
      <slot name="aside-ads-after" />
    </template>
  </Layout>
</template>

<style lang="scss" scoped>
@use "../styles/namespace.scss" as *;

$prefix-class: #{$theme-namespace}-layout;

.#{$prefix-class} {
  &-home {
    margin: 0 auto;
    padding: 20px;
    max-width: 1120px;

    &__banner {
      margin-top: 0;
      padding: 30px 0;
    }

    &-content {
      display: flex;
      align-items: flex-start;
      justify-content: center;

      &__list {
        width: 100%;
      }

      &__info {
        margin-left: 16px;
        position: sticky;
        top: 100px;
      }
    }
  }
}
</style>
