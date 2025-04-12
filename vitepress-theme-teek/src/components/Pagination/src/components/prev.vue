<script lang="ts" setup>
import { computed } from "vue";
import Icon from "../../../Icon";
import type { PaginationPrevEmits, PaginationPrevProps } from "./prev";
import { useLocale } from "../../../../hooks";

defineOptions({ name: "PaginationPrev" });

const props = defineProps<PaginationPrevProps>();
defineEmits<PaginationPrevEmits>();

const { t } = useLocale();

const internalDisabled = computed(() => props.disabled || props.currentPage <= 1);
</script>

<template>
  <button
    type="button"
    class="btn-prev"
    :disabled="internalDisabled"
    :aria-label="prevText || t('tk.pagination.prev')"
    :aria-disabled="internalDisabled"
    @click="$emit('click', $event)"
  >
    <span v-if="prevText">{{ prevText }}</span>
    <Icon v-else :icon="prevIcon" />
  </button>
</template>
