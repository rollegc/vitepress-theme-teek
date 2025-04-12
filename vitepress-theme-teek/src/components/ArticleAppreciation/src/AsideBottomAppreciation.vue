<script setup lang="ts" name="AsideBottomAppreciation">
import { computed, unref } from "vue";
import { useTeekConfig } from "../../../configProvider";
import { useNamespace, useLocale } from "../../../hooks";
import type { Appreciation } from "../../../config/types";

defineOptions({ name: "AsideBottomAppreciation" });

const ns = useNamespace("article-appreciation");
const { t } = useLocale();

const { getTeekConfigRef } = useTeekConfig();

const appreciateConfig = getTeekConfigRef<Required<Appreciation<"aside-bottom">>>("appreciation", { position: "" });

const asideBottomOptions = computed(() => unref(appreciateConfig).options || {});
</script>

<template>
  <div :class="[ns.b(), ns.m('aside-bottom')]" :aria-label="t('tk.articleAppreciation.label')">
    <span v-html="asideBottomOptions.title"></span>
    <div :class="ns.e('content')" v-html="asideBottomOptions.content" />
  </div>
</template>
