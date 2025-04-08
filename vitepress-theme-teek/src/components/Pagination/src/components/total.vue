<script lang="ts" setup>
import { useNamespace } from "../../../../hooks";
import { usePagination } from "../usePagination";
import { PaginationTotalProps } from "./total";

defineOptions({ name: "PaginationTotal" });

defineProps<PaginationTotalProps>();

const ns = useNamespace("pagination");
const { disabled } = usePagination();
</script>

<template>
  <span :class="ns.e('total')" :disabled="disabled">共 {{ total }} 条</span>
</template>
