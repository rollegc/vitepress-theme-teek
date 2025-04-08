import type Pager from "./pager.vue";

export interface PaginationPagerProps {
  /**
   * 当前页
   *
   * @default 1
   */
  currentPage?: number;
  /**
   * 页数数组
   */
  pageCount: number;
  /**
   * 一页显示多少条数据
   *
   * @default 7
   */
  pagerCount?: number;
  /**
   * 是否禁用
   */
  disabled?: boolean;
}

export type PaginationPagerInstance = InstanceType<typeof Pager>;
