<script setup lang="ts" name="Segmented">
import { useNamespace } from "../../../../hooks";
import SegmentedHorizontalItem from "./SegmentedItem.vue";
import type { ModelType } from "./SegmentedItem.vue";

defineOptions({ name: "Segmented" });

const ns = useNamespace("segmented");

interface Item {
  name?: string;
  icon?: string;
  text?: string;
  title: string;
  ariaLabel: string;
  value?: ModelType;
}

defineProps<{ disabled?: boolean; options: Item[] }>();

const model = defineModel<ModelType>();
</script>

<template>
  <fieldset :class="ns.b()">
    <SegmentedHorizontalItem
      v-for="option in options"
      :key="option.name"
      v-model="model"
      v-bind="option"
      :disabled="disabled"
    />
  </fieldset>
</template>
