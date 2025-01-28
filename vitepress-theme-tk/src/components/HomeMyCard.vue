<script setup lang="ts" name="HomeMyCard">
import { useDesign } from "../hooks";
import { useData } from "vitepress";
import { computed, unref } from "vue";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("my");

const { theme } = useData();

const blogger = computed(() => unref(theme).blogger || {});
</script>

<template>
  <div :class="`${prefixClass} card`">
    <div :class="`${prefixClass}-avatar`">
      <img :src="blogger.avatar" alt="头像" title="我好看吗" />
    </div>
    <!-- <div :class="`${prefixClass}-icons`" v-if="social && social.icons && social.icons.length">
      <a
        v-for="(item, index) in social.icons"
        :key="index"
        :href="item.link"
        :title="item.title"
        :class="['iconfont', item.iconClass]"
        :style="{ width: 100 / social.icons.length + '%' }"
        target="_blank"
      />
    </div> -->
    <div :class="`${prefixClass}-blogger`">
      <span class="name">{{ blogger.name }}</span>
      <span class="slogan">{{ blogger.slogan }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/components/homeMyCard.scss";
</style>
