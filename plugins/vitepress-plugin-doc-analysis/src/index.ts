import type { Plugin } from "vite";
import { DocAnalysis, DocAnalysisOption, FilePathInfo } from "./types";
import { join } from "node:path";
import readFileList from "./helper";
import { getLastCommitTime, getEachFileWords, getTotalFileWords, getLastUpdateTime } from "./util";
import picocolors from "picocolors";

export * from "./types";

export const log = (message: string, type = "yellow") => {
  console.log((picocolors as any)[type](message));
};

export default function VitePluginVitePressDocAnalysis(option: DocAnalysisOption = {}): Plugin & { name: string } {
  return {
    name: "vitepress-plugin-doc-analysis",
    async config(config: any) {
      const {
        site: { themeConfig = {}, locales = {} },
        srcDir,
      } = config.vitepress;

      const baseDir = option.path ? join(process.cwd(), option.path) : srcDir;
      const newOption = { ...option, baseDir };

      // 多语言 key 数组
      const localesKeys = Object.keys(locales).filter(key => key !== "root");
      // 如果不是多语言，则不需要处理多语言的文档分析
      if (!localesKeys.length) return doDocAnalysisThenSet(themeConfig, readFileList(newOption), newOption);

      // 多语言处理，针对每个语言的目录进行单独的扫描（除了 root）
      localesKeys.forEach(localesKey => {
        const fileList = readFileList({ ...newOption, path: `${baseDir}/${localesKey}` }, localesKey);
        doDocAnalysisThenSet(locales[localesKey].themeConfig, fileList, newOption);
      });

      // 对 root 根目录的文档进行单独的分析，且不扫描其他语言目录
      const rootFileList = readFileList({
        ...newOption,
        ignoreList: [...(newOption.ignoreList || []), ...localesKeys],
      });
      doDocAnalysisThenSet(locales["root"].themeConfig, rootFileList, newOption);
    },
  };
}

const doDocAnalysisThenSet = async (themeConfig: any, fileList: FilePathInfo[], option: DocAnalysisOption) => {
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
  } as DocAnalysis;

  log("injected docAnalysisInfo data successfully. 注入文档分析数据成功!", "green");
};
