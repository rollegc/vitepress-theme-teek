import { AutoFrontmatterOption } from "vitepress-plugin-auto-frontmatter";

/**
 * 扩展后的自定义 AutoFrontmatter 配置接口
 * 继承原始 AutoFrontmatterOption，并添加自定义字段
 */
export interface TeekAutoFrontmatterOption extends AutoFrontmatterOption {
  /**
   * 为是否自动生成 categories
   * @default false（默认关闭）
   */
  categories?: boolean;

  /**
   * 是否自动为无封面图的文件添加随机封面，根据coverImgList内容选择（coverImgList为空时无效）
   * 开启时：
   *  - 针对无封面图的文件，会自动添加封面图
   *  - 针对已存在封面图的文件，会判断是否存在于coverImgList中，如果存在则不覆盖，不存在则覆盖掉原来的封面图
   * @default false（默认关闭）
   */
  coverImg?: boolean;

  /**
   * 是否开启强制覆盖封面图，默认关闭（coverImgList为空时无效）
   * 开始时：针对已存在封面图的文件，会强制覆盖掉原来的封面图
   * @default false（默认关闭）
   */
  enableForceCoverImg?: boolean;

  /**
   * 封面图列表，填写封面图路径，支持本地路径和网络路径
   */
  coverImgList?: string[];

  /**
   * 处理 permalink 的规则配置
   */
  permalinkRules?: TransformRule[];

  /**
   * 是否处理日期转换
   * 开启时减去8小时抵消时区转换
   * @default true（默认开启防止日期变化）
   */
  enableHandleDate?: boolean;

  /**
   * 是否打印详细的转换日志
   * @default false（默认关闭）
   */
  enableDetailLog?: boolean;
}

/**
 * 定义规则类型
 * 如果第一个分组相同（即第一个斜杠的内容，只匹配一级，自动忽略纯空格），说明已包含目标前缀，不处理直接跳过
 * @param folderName 文件或文件夹名称
 * @param prefix 可选：要添加的前缀，可以是多级的，/test-$uuid4-$uuid2/aaa/$uuid10/，其中 $uuid5 为随机数字加小写字母，最后的数字代表几位，最大十位
 * @param removeLevel 可选：要移除的前缀层级（以 / 分割），适合移除前缀并添加的场景（可以填写一个很大的数，那么就会全部清空再添加前缀）
 * @param clear 可选，是否清空 permalink，适合只想要清空的场景。true=清空，默认false（此时填写prefix无效，clear优先级高）
 */
export interface TransformRule {
  folderName: string;
  prefix?: string;
  removeLevel?: number;
  clear?: boolean;
}
