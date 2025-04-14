<script setup lang="ts" name="HighlightBorder">
import { inject } from "vue";

import { useNamespace } from "../../../../hooks";
import { readingEnhanceNsSymbol } from "../readingEnhance";

defineProps<{ active: boolean }>();

const ns = inject(readingEnhanceNsSymbol, useNamespace("reading-enhance"));
</script>

<template>
  <div :class="[ns.e('highlight'), ns.is('active', Boolean(active))]">
    <slot />
  </div>
</template>
