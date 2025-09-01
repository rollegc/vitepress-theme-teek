import { AutoFrontmatterOption } from "vitepress-plugin-auto-frontmatter";

/**
 * 扩展后的自定义 AutoFrontmatter 配置接口
 * 继承原始 AutoFrontmatterOption，并添加自定义字段
 */
export interface TeekAutoFrontmatterOption extends AutoFrontmatterOption {
  /**
   * 是否开启自动生成 categories
   * 开启时根据文档目录自动生成分类
   * @default false（默认关闭）
   */
  categories?: boolean;

  /**
   * 是否自动为无封面图的MD文档添加随机封面，根据coverImgList内容选择（coverImgList为空时无效）
   * 开启时：无封面图的MD文档，会自动添加封面图
   * @default false（默认关闭）
   */
  enableCoverImg?: boolean;

  /**
   * 是否开启强制覆盖封面图（coverImgList为空时无效）
   * 开启时：已有封面图的MD文档，会判断是否存在于coverImgList中，如果存在则跳过，如果不存在则覆盖掉原来的封面图。
   * 需要搭配 recoverTransform 一起使用，否则无法覆盖
   * @default false（默认关闭）
   */
  enableForceCoverImg?: boolean;

  /**
   * 封面图列表，填写封面图路径，支持本地路径和网络路径
   */
  coverImgList?: string[];

  /**
   * 是否开启生成永久链接 Permalink
   * 默认跳过 `frontmatter.catalogue` 设置为`true` 的Markdown 文档 （目录页）
   * 如果开启该功能，但未提供 permalinkRules 规则，则使用默认规则 { folderName: "*", prefix: "/$path/$uuid5" }
   * @default true（默认开启）
   */
  enablePermalink?: boolean;

  /**
   * 处理 permalink 的规则配置
   * enablePermalink 设置为 false 时无效
   * @example
   * { folderName: "00.Teek", prefix: "/teek" } // 添加前缀
   * { folderName: "00.Teek/01.XXX", prefix: "/tool", removeLevel: 1 } // 先移除一层前缀，再添加前缀
   * { folderName: "00.Teek/01.XXX", prefix: "/test/$uuid5", removeLevel: 99} // 清空指定层级前缀并添加前缀，前缀使用随机数
   * { folderName: "00.Teek/01.XXX", prefix: "/test-$uuid4-$uuid2/aaa/", removeLevel: 99} // 混合固定字符串和随机数
   * { folderName: "00.Teek/01.XXX", prefix: "/note", clear: true } // 清空 permalink，此时prefix无效，clear优先级高
   * { folderName: "00.Teek/01.XXX", prefix: "/$path-$uuid2/teek/$uuid", removeLevel: 99 }, // 使用一级目录的哈希混合随机数
   * { folderName: "00.Teek/01.XXX", clear: true} // 清空前缀并且添加前缀使用随机数
   * { folderName: "*", clear: true}, // * 代表所有文件都匹配，清空所有文件的永久链接
   */
  permalinkRules?: TransformRule[];
}

/**
 * 定义规则类型
 * 如果第一个分组相同（即第一个斜杠的内容，只匹配一级，自动忽略纯空格），说明已包含目标前缀，不处理直接跳过
 * @param folderName 文件夹路径或文件名称
 *  - 文件夹路径：前缀匹配
 *  - 文件夹名称：精确匹配
 * @param prefix 可选：要添加的前缀，可以是多级的，例如/test-$uuid4-$uuid2/aaa/$uuid10/
 * @example
 * $UUID{n} 支持 $UUID, $UUID5, $UUID10 等格式，产生n位的随机字符串（数字加小写字母）
 * - n 默认5位
 * - n 取值[1 - 15]之间
 * - 不区分大小写
 * $PATH{n} 支持 $PATH, $PATH5，$PATH10 等格式， 代表一级目录并将其转为为hash值
 * - n 默认6位
 * - n 取值[6 - 10]之间，低于 6 按 6 处理（防止碰撞）
 * - 不区分大小写
 *
 * @param removeLevel 可选：要移除的前缀层级（以 / 分割），适合移除前缀并添加的场景（可以填写一个很大的数，那么就会全部清空再添加前缀）
 * @param clear 可选，是否清空 permalink，适合只想要清空的场景。true=清空，默认false（此时填写prefix无效，clear优先级高）
 */
export interface TransformRule {
  folderName: string;
  prefix?: string;
  removeLevel?: number;
  clear?: boolean;
}
