<script setup lang="ts" name="SegmentedItem">
import Icon from "../../../Icon";
import { useNamespace } from "../../../../hooks";

defineProps<{
  name?: any;
  value?: any;
  icon?: string;
  text?: string;
  title: string;
  disabled?: boolean;
}>();

const ns = useNamespace("segmented-item");

const model = defineModel<any>();
</script>

<template>
  <label
    :class="[ns.b(), ns.is('active', model === value && !disabled), ns.is('disabled', disabled)]"
    :title="title"
    :disabled="disabled"
  >
    <input
      v-model="model"
      type="radio"
      :value="value"
      :name="name"
      :checked="model === value"
      :aria-checked="model === value"
      :disabled="disabled"
      role="radio"
      style="display: none"
    />
    <span :class="ns.e('content')">
      <Icon v-if="icon" :icon="icon" aria-hidden="true" />
      <span v-if="text">{{ text }}</span>
    </span>
  </label>
</template>
