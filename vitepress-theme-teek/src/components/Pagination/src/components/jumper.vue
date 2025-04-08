<script lang="ts" setup>
import { computed, ref } from "vue";
import { useNamespace } from "../../../../hooks";
import { ElInput } from "element-plus";
import { usePagination } from "../usePagination";
import { PaginationJumperProps } from "./jumper";

defineOptions({ name: "PaginationJumper" });

defineProps<PaginationJumperProps>();

const ns = useNamespace("pagination");
const { pageCount, disabled, currentPage, changeEvent } = usePagination();
const userInput = ref<number | string>();
const innerValue = computed(() => userInput.value ?? currentPage?.value);

const handleInput = (val: number | string) => {
  userInput.value = val ? +val : "";
};

const handleChange = (val: number | string) => {
  val = Math.trunc(+val);
  changeEvent?.(val);
  userInput.value = undefined;
};
</script>

<template>
  <span :class="ns.e('jump')" :disabled="disabled">
    <span :class="[ns.e('goto')]">前往</span>
    <el-input
      :size="size"
      :class="[ns.e('editor'), ns.is('in-pagination')]"
      :min="1"
      :max="pageCount"
      :disabled="disabled"
      :model-value="innerValue"
      :validate-event="false"
      aria-label="页"
      type="number"
      @update:model-value="handleInput"
      @change="handleChange"
    />
    <span :class="[ns.e('classifier')]">页</span>
  </span>
</template>
