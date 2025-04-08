<script lang="ts" setup>
import { computed } from "vue";
import Icon from "../../../Icon";
import { PaginationNextProps } from "./next";

defineOptions({ name: "PaginationNext" });

const props = defineProps<PaginationNextProps>();

defineEmits(["click"]);

const internalDisabled = computed(
  () => props.disabled || props.currentPage === props.pageCount || props.pageCount === 0
);
</script>

<template>
  <button
    type="button"
    class="btn-next"
    :disabled="internalDisabled"
    :aria-label="nextText || '下一页'"
    :aria-disabled="internalDisabled"
    @click="$emit('click', $event)"
  >
    <span v-if="nextText">{{ nextText }}</span>
    <Icon v-else :icon="nextIcon" />
  </button>
</template>
