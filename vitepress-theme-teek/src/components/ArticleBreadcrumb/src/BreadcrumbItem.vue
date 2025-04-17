<script setup lang="ts" name="BreadcrumbItem">
import { inject } from "vue";
import { useNamespace } from "@teek/hooks";
import { breadcrumbKey, breadcrumbNsSymbol } from "./breadcrumb";

defineOptions({ name: "BreadcrumbItem" });

const breadcrumbContext = inject(breadcrumbKey, undefined);
const ns = inject(breadcrumbNsSymbol, useNamespace("breadcrumb"));
</script>

<template>
  <span :class="ns.e('item')">
    <span ref="link" :class="ns.e('inner')" role="link">
      <slot />
    </span>
    <span :class="ns.e('separator')" role="presentation">
      {{ breadcrumbContext?.separator }}
    </span>
  </span>
</template>
