<script setup lang="ts" name="HomeMyCard">
import { useDesign } from "../hooks";
import { useUnrefData } from "../configProvider";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("my");

const blogger = useUnrefData().theme.blogger || {};
</script>

<template>
  <div :class="`${prefixClass} card`">
    <div :class="`${prefixClass}-avatar`">
      <img :src="blogger.avatar" alt="头像" title="我好看吗" />
    </div>
    <div :class="`${prefixClass}-blogger`">
      <span class="name">{{ blogger.name }}</span>
      <span class="slogan">{{ blogger.slogan }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/components/homeMyCard.scss";
</style>
