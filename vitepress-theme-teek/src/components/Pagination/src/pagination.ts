export interface Paging {
  /**
   * 当前页
   *
   * @default 1
   */
  pageNum?: number;
  /**
   * 页数数组
   *
   * @default [10, 20, 50, 100, 200]
   */
  pageSizes?: number[];
  /**
   * 一页显示多少条数据
   *
   * @default 20
   */
  pageSize?: number;
  /**
   * 总数
   *
   * @default 0
   */
  total?: number;
}

export interface PaginationProps {
  /**
   * 是否开启背景色
   *
   * @default true
   */
  background?: boolean;
  /**
   * 切换页数，是否自动滚动到最上面
   *
   * @default true
   */
  autoScroll?: boolean;
  /**
   * 是否不显示分页
   *
   * @default false
   */
  hidden?: boolean;
  /**
   * 切换 pageSize，pageNum 重置为 1
   *
   * @default true
   */
  reset?: boolean;
}

export type PaginationEmits = {
  /**
   * 分页时候触发的事件
   */
  pagination: [value: Paging];
};
