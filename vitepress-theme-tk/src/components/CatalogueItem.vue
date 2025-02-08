<script setup lang="ts" name="CatalogueItem">
import { useDesign } from "../hooks";
import type { DefaultTheme } from "vitepress";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("catalogue");
const prefixClass1 = getPrefixClass("sub-catalogue");
const prefixClass2 = getPrefixClass("catalogue-item");

defineProps<{ item: DefaultTheme.SidebarMulti; index: number | string }>();
</script>

<template>
  <li :class="item.items ? prefixClass1 : prefixClass2">
    <a v-if="!item.items" :href="item.link">{{ index }}. {{ item.text }}</a>

    <template v-else>
      <div :id="anchorText = item.text" :class="`${prefixClass1}__title`">
        <a :href="`#${anchorText}`" class="anchor">#</a>
        <span>{{ `${index}. ${item.text}` }}</span>
      </div>

      <ul v-if="item.items" :class="`${prefixClass}__inline flx-wrap-between`">
        <!-- 递归自己 -->
        <CatalogueItem v-for="(item, i) in item.items" :key="i" :item :index="`${index}-${i + 1}`" />
      </ul>
    </template>
  </li>
</template>

<style lang="scss" scoped>
@use "../styles/components/catalogueItem.scss";
</style>
