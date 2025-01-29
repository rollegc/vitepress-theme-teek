<script setup lang="ts" name="FriendLinkCard">
import { useDesign } from "../hooks";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("friendLink");
</script>

<template>
  <div :class="prefixClass"></div>
</template>

<style lang="scss" scoped>
@use "../styles/components/friendLinkCard.scss";
</style>
