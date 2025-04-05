<script setup lang="ts" name="AsideBottomAppreciation">
import { computed, unref } from "vue";
import { useTeekConfig } from "../../../configProvider";
import { useNamespace } from "../../../hooks";
import type { Appreciation } from "../../../config/types";

defineOptions({ name: "AsideBottomAppreciation" });

const ns = useNamespace("article-appreciation");

const { getTeekConfigRef } = useTeekConfig();

const appreciateConfig = getTeekConfigRef<Appreciation>("appreciation", { position: "" });

const appreciateOptions = computed(() => {
  const { position, options = {} } = unref(appreciateConfig);
  if (position === "aside-bottom") return options;
  return {};
});
</script>

<template>
  <div :class="[ns.b(), ns.m('aside-bottom')]">
    <span v-html="appreciateOptions.title"></span>
    <div :class="ns.e('content')" v-html="appreciateOptions.content" />
  </div>
</template>
