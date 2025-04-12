<script lang="ts" setup>
import { computed } from "vue";
import Icon from "../../../Icon";
import type { PaginationNextProps } from "./next";
import { useLocale } from "../../../../hooks";

defineOptions({ name: "PaginationNext" });

const props = defineProps<PaginationNextProps>();

defineEmits(["click"]);

const { t } = useLocale();

const internalDisabled = computed(
  () => props.disabled || props.currentPage === props.pageCount || props.pageCount === 0
);
</script>

<template>
  <button
    type="button"
    class="btn-next"
    :disabled="internalDisabled"
    :aria-label="nextText || t('tk.pagination.next')"
    :aria-disabled="internalDisabled"
    @click="$emit('click', $event)"
  >
    <span v-if="nextText">{{ nextText }}</span>
    <Icon v-else-if="nextIcon" :icon="nextIcon" />
  </button>
</template>
