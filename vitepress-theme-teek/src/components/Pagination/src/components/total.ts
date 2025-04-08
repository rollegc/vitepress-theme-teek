import type Total from "./total.vue";

export interface PaginationTotalProps {
  /**
   * 总数
   *
   * @default 1000
   */
  total: number;
}

export type PaginationTotalInstance = InstanceType<typeof Total>;
