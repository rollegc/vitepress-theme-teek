<script setup lang="ts" name="FooterContainer">
const { isHomePage } = usePageState();

import { useNamespace } from "@teek/composables";
import { TkFooterGroup, TkFooterInfo, usePageState } from "@teek/components";
defineOptions({ name: "FooterContainer" });
const ns = useNamespace("footer-container");
</script>

<template>
  <div :class="ns.b()">
    <TkFooterGroup v-if="isHomePage" />
    <slot name="teek-footer-info-before" />

    <TkFooterInfo v-if="isHomePage" />
    <slot name="teek-footer-info-after" />
    <slot name="layout-bottom" />
  </div>
</template>
