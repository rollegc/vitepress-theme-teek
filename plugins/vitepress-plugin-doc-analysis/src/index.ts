import type { Plugin } from "vite";
import { DocAnalysisOption, FileInfo } from "./types";
import { join } from "node:path";
import readFileList from "./helper";
import { getLastCommitTime, getEachFileWords, getTotalFileWords, getLastUpdateTime } from "./util";

export * from "./types";

export default function VitePluginVitePressDocAnalysis(option: DocAnalysisOption = {}): Plugin & { name: string } {
  return {
    name: "vitepress-plugin-doc-analysis",
    async config(config: any) {
      const {
        site: { themeConfig = {}, locales = {} },
        srcDir,
      } = config.vitepress;

      option.srcDir = option.srcDir ? join(process.cwd(), option.srcDir) : srcDir;

      // 多语言 key 数组
      const localesKeys = Object.keys(locales).filter(key => key !== "root");
      // 如果不是多语言，则不需要处理多语言的文档分析
      if (!localesKeys.length) return doDocAnalysisThenSet(themeConfig, readFileList(option), option);

      // 多语言处理，针对每个语言的目录进行单独的扫描（除了 root）
      localesKeys.forEach(localesKey => {
        const fileList = readFileList({ ...option, srcDir: `${option.srcDir}/${localesKey}` }, localesKey);
        doDocAnalysisThenSet(locales[localesKey].themeConfig, fileList, option);
      });

      // 对 root 根目录的文档进行单独的分析，且不扫描其他语言目录
      const rootFileList = readFileList({ ...option, ignoreList: [...(option.ignoreList || []), ...localesKeys] });
      doDocAnalysisThenSet(locales["root"].themeConfig, rootFileList, option);
    },
  };
}

const doDocAnalysisThenSet = async (themeConfig: any, fileList: FileInfo[], option: DocAnalysisOption) => {
  const filePathList = fileList.map(item => item.filePath);

  const totalFileWords = getTotalFileWords(filePathList);
  const eachFileWords = getEachFileWords(fileList, option.cn, option.en);
  const lastCommitTime = (await getLastCommitTime()) || getLastUpdateTime(filePathList);

  // 防止 themeConfig 为 undefined
  themeConfig = themeConfig || {};
  themeConfig.docAnalysisInfo = {
    fileList,
    totalFileWords,
    eachFileWords,
    lastCommitTime,
  };
};
