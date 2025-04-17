<script setup lang="ts" name="Title">
import type { TkIconProps } from "@teek/components/Icon";
import { ns } from "../namespace";
import Icon from "@teek/components/Icon";

defineProps<{ title?: string; disabled?: boolean; icon?: TkIconProps["icon"] }>();
</script>

<template>
  <div :class="[ns.e('title'), ns.is('disabled', !!disabled)]">
    <slot name="icon">
      <Icon v-if="icon" :icon="icon" :size="16" />
    </slot>

    <slot name="title">
      <span v-if="title">{{ title }}</span>
    </slot>

    <slot />
  </div>
</template>
