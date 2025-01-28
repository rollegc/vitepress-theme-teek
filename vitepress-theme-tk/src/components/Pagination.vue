<script setup lang="ts">
import { useDesign } from "../hooks";
import { scrollTo } from "../helper";
import { nextTick, unref } from "vue";
import { ElPagination } from "element-plus";

export interface Paging {
  pageNum?: number; // 当前页
  pageSizes?: number[]; // 页数数组
  pageSize?: number; // 一页显示多少条数据
  total?: number; // 总数
}

export interface PaginationProps {
  layout?: string; // 布局
  background?: boolean; // 是否开启背景色
  autoScroll?: boolean; // 切换页数，是否自动滚动到最上面
  hidden?: boolean; // 是否不显示分页
  reset?: boolean; // 切换 pageSize，pageNum 重置为 1
}

defineOptions({ name: "Pagination" });

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("pagination");

const props = withDefaults(defineProps<PaginationProps>(), {
  layout: "prev, pager, next, jumper",
  background: true,
  autoScroll: true,
  hidden: false,
  reset: true,
});

type PaginationEmits = {
  pagination: [value: Paging];
};

const emits = defineEmits<PaginationEmits>();

const pageObj = defineModel<Paging>({ required: true });

const pageSetting = { pageNum: 1, pageSizes: [10, 20, 50, 100, 200], pageSize: 20 };

if (!unref(pageObj).pageNum) unref(pageObj).pageNum = pageSetting.pageNum;
if (!unref(pageObj).pageSizes) unref(pageObj).pageSizes = pageSetting.pageSizes;
if (!unref(pageObj).pageSize) unref(pageObj).pageSize = pageSetting.pageSize;

const handleSizeChange = (value: number) => {
  if (props.reset) return handleCurrentChange(1);
  unref(pageObj).pageSize = value;
  afterChange();
};

const handleCurrentChange = (value: number) => {
  unref(pageObj).pageNum = value;
  afterChange();
};

const afterChange = () => {
  pageObj.value = unref(pageObj);
  emits("pagination", unref(pageObj));
  if (props.autoScroll) {
    nextTick(() => {
      scrollTo("html", 0, 700);
    });
  }
};

defineExpose({ paging: pageSetting });
</script>

<template>
  <div :class="[prefixClass, { hidden: hidden }]">
    <el-pagination
      :background="background"
      v-model:current-page="pageObj.pageNum"
      v-model:page-size="pageObj.pageSize"
      :page-sizes="pageObj.pageSizes"
      :layout="layout"
      :total="pageObj.total || 0"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/components/pagination.scss";
</style>
