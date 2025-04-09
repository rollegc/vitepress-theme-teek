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
   * 设置最大页码按钮数。 页码按钮的数量，当总页数超过该值时会折叠
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
