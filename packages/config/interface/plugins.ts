import type { PermalinkOption } from "vitepress-plugin-permalink";
import type { SidebarOption } from "vitepress-plugin-sidebar-resolve";
import type { CatalogueOption } from "vitepress-plugin-catalogue";
import type { MdH1Option } from "vitepress-plugin-md-h1";
import type { DocAnalysisOption } from "vitepress-plugin-doc-analysis";
import { TeekAutoFrontmatterOption } from "./teekAutoFrontmatterOption";

export interface Plugins {
  /**
   * 是否启用 sidebar 插件
   *
   * @default true
   */
  sidebar?: boolean;
  /**
   * sidebar 插件配置项
   */
  sidebarOption?: SidebarOption;
  /**
   * 是否启用 permalink 插件
   *
   * @default true
   */
  permalink?: boolean;
  /**
   * permalinks 插件配置项
   */
  permalinkOption?: PermalinkOption;
  /**
   * 是否启用 mdH1 插件
   *
   * @default true
   */
  mdH1?: boolean;
  /**
   * mdH1 插件配置项
   */
  mdH1Option?: MdH1Option;
  /**
   * catalogues 插件配置项
   */
  catalogueOption?: CatalogueOption;
  /**
   * 是否启用 docAnalysis 插件
   *
   * @default true
   */
  docAnalysis?: boolean;
  /**
   * docAnalysis 插件配置项
   */
  docAnalysisOption?: DocAnalysisOption;
  /**
   * fileContentLoader 插件扫描 markdown 文档时，指定忽略路径，格式为 glob 表达式，如 test/**
   *
   * @default []
   */
  fileContentLoaderIgnore?: string[];
  /**
   * 是否启用 autoFrontmatter 插件
   *
   * @default false
   */
  autoFrontmatter?: boolean;
  /**
   * autoFrontmatter 插件配置项，Teek 中对其进行了增强，拓展了其他配置项
   *
   * recoverTransform: 是否开启同名key覆盖
   * categories 为是否自动生成 categories
   * enableCoverImg 是否开启添加文档封面图
   * enableForceCoverImg 是否开启强制覆盖封面图
   * coverImgList 封面图列表
   * enablePermalink 是否开启生成永久链接
   * permalinkRules 处理永久链接的规则
   * enableHandleDate 是否处理时区转换
   *
   * @default '{
   *  recoverTransform: false,
   * 	categories: true,
   * 	enableCoverImg: false,
   *  enableForceCoverImg: false,
   *  coverImgList: [],
   *  enablePermalink: false,
   *  permalinkRules: []
   *  enableHandleDate: true
   * }'
   */
  autoFrontmatterOption?: TeekAutoFrontmatterOption;
}
