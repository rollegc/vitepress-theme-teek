export interface FeatureData {
  /** 标题 */
  title: string;
  /** 描述 */
  subTitle?: string;
  /** 图片 */
  image: string;
  /** 数据 */
  items: {
    title: string;
    description: string;
  }[];
}
