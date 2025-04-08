import type { ComputedRef, InjectionKey, WritableComputedRef } from "vue";

export interface PaginationContext {
  currentPage?: WritableComputedRef<number>;
  pageCount?: ComputedRef<number>;
  disabled?: ComputedRef<boolean>;
  changeEvent?: (val: number) => void;
  handleSizeChange?: (val: number) => void;
}

export const paginationKey: InjectionKey<PaginationContext> = Symbol("paginationKey");

export type LayoutKey = "prev" | "pager" | "next" | "jumper" | "->" | "total" | "slot";

export interface PaginationProps {
  /**
   * 当前页数
   *
   * @default 1
   */
  pageSize?: number;
  /**
   * 总页数
   */
  total?: number;
  pageCount?: number;
  pagerCount?: number;
  currentPage?: number;
  layout?: string;
  pageSizes?: number[];
  popperClass?: string;
  prevText?: string;
  prevIcon?: string;
  nextText?: string;
  nextIcon?: string;
  teleported?: boolean;
  size?: "" | "default" | "small" | "large";
  background?: boolean;
  disabled?: boolean;
  hideOnSinglePage?: boolean;
  appendSizeTo?: string;
}

export interface PaginationEmits {
  "update:current-page": [value: number];
  "update:page-size": [value: number];
  "size-change": [value: number];
  change: [currentPage: number, pageSize: number];
  "current-change": [value: number];
  "prev-click": [value: number];
  "next-click": [value: number];
}
