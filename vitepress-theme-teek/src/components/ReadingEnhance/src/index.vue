<script setup lang="ts" name="ReadingEnhance">
import VPFlyout from "vitepress/dist/client/theme-default/components/VPFlyout.vue";
import LayoutSwitch from "./LayoutSwitch.vue";
import LayoutPageWidthSlide from "./LayoutPageWidthSlide.vue";
import LayoutDocWidthSlide from "./LayoutDocWidthSlide.vue";
import Spotlight from "./Spotlight.vue";
import SpotlightStyle from "./SpotlightStyle.vue";
import { useNamespace } from "../../../hooks";
import { provide } from "vue";
import { readingEnhanceNsSymbol } from "./readingEnhance";
import Icon from "../../Icon";

const ns = useNamespace("reading-enhance");

provide(readingEnhanceNsSymbol, ns);
</script>

<template>
  <div :class="ns.b()">
    <Icon icon="ep:reading" :size="16" />
    <VPFlyout icon="ep:reading">
      <div :class="ns.e('content')">
        <LayoutSwitch />
        <LayoutPageWidthSlide />
        <LayoutDocWidthSlide />
        <Spotlight />
        <SpotlightStyle />
      </div>
    </VPFlyout>
  </div>
</template>
