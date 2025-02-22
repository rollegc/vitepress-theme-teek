import type { DefaultTheme } from "vitepress";

export interface SidebarOption {
  /**
   * 生成侧边栏时，忽略的文件/文件夹列表，支持正则表达式
   *
   * @default []
   */
  ignoreList?: Array<RegExp | string>;
  /**
   * 文章所在的目录，基于 package.json 所在目录，开头不需要有 /
   *
   * @default 'vitepress 的 srcDir 配置项'
   */
  path?: string;
  /**
   * 是否忽略每个目录下的 index.md 文件
   *
   * @default false
   */
  ignoreIndexMd?: boolean;
  /**
   * 是否扫描根目录下的 md 文件作为 sideBar，如果为 true，则扫描根目录下的 md 文件作为 sideBar，且忽略根目录下的 index.md
   *
   * @default true
   */
  scannerRootMd?: boolean;
  /**
   * 是否默认折叠侧边栏
   *
   * @default true
   */
  collapsed?: boolean;
  /**
   * 文件名前缀必须以「数字.」开头
   *
   * @default true
   */
  fileIndexPrefix?: boolean;
  /**
   * 是否从 md 文件获取第一个一级标题作为侧边栏 text
   *
   * @default false
   * @remark 侧边栏 text 获取顺序
   * titleFormMd 为 true：md 文件 formatter.title > [md 文件第一个一级标题] > md 文件名
   * titleFormMd 为 false：md 文件 formatter.title > md 文件名
   */
  titleFormMd?: boolean;
  /**
   * 当 Vitepress 设置 locales 多语言后，如果将 root 语言的所有文件放到一个单独的目录下，如 zh，则需要将 localeRootDir 设为 zh，否则侧边栏无法知道文件都放到了 zh
   * 如果 root 语言的所有文件放在文档根目录下，则不需要设置 localeRootDir
   *
   * @default 文档根目录
   */
  localeRootDir?: string;
  /**
   * 解析完每个 sideBar 后的回调。每个 sideBar 指的是 SidebarOption.path 目录下的每个子目录
   *
   * @param data 当前 sideBar 列表
   * @default undefined
   */
  sideBarResolved?: (data: DefaultTheme.SidebarMulti) => DefaultTheme.SidebarMulti;
  /**
   * 解析完每个 sideBarItem 后的回调。每个 sideBarItem 指的是每个目录下的文件数组
   *
   * @param data 当前 sideBarItem 列表
   * @default undefined
   */
  sideBarItemsResolved?: (data: DefaultTheme.SidebarItem[]) => DefaultTheme.SidebarItem[];
  /**
   * 创建 sideBarItem 之前的回调。每个 sideBarItem 指的是每个目录下的文件数组
   *
   *
   * @param data 将要解析的所有文件名
   * @default undefined
   * @remark 可以过滤掉不需要解析为 sideBarItem 的文件
   */
  beforeCreateSideBarItems?: (data: string[]) => string[];
}
