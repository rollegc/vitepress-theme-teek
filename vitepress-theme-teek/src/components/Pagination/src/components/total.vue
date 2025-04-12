<script lang="ts" setup>
import { useNamespace, useLocale } from "../../../../hooks";
import { usePagination } from "../usePagination";
import type { PaginationTotalProps } from "./total";

defineOptions({ name: "PaginationTotal" });

defineProps<PaginationTotalProps>();

const ns = useNamespace("pagination");
const { t } = useLocale();
const { disabled } = usePagination();
</script>

<template>
  <span :class="ns.e('total')" :disabled="disabled">
    {{
      t("tk.pagination.total", {
        total,
      })
    }}
  </span>
</template>
