<script setup lang="ts" name="Helper">
import { questionFilledIcon } from "@teek/static";
import { TkIcon } from "@teek/components/common/Icon";
import { TkPopover } from "@teek/components/common/Popover";
import { ns } from "../namespace";

defineOptions({ name: "Helper" });

defineProps<{ triggerEl?: HTMLDivElement; offset?: number }>();

const visible = defineModel({ type: Boolean, default: false });
</script>

<template>
  <TkPopover :class="ns.e('helper')" v-model="visible" :trigger-el placement="left-start">
    <template #reference>
      <TkIcon :icon="questionFilledIcon" :size="16" />
    </template>
    <div :class="ns.e('helper__popup')">
      <slot />
    </div>
  </TkPopover>
</template>
