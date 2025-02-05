import type { Plugin } from "vite";
import { SiteInfoOption } from "./types";
import { join } from "node:path";
import readFileList from "./helper";
import { getLastCommitTime, getEachFileWords, getTotalFileWords, getLastUpdateTime } from "./util";

export * from "./types";

export default function VitePluginVitePressDocAnalysis(option: SiteInfoOption = {}): Plugin {
  return {
    name: "vitepress-plugin-doc-analysis",
    async config(config: any) {
      const {
        site: { themeConfig },
        srcDir,
      } = config.vitepress;

      option.base = option.base ? join(process.cwd(), option.base) : srcDir;

      const fileList = readFileList(option);
      const filePathList = fileList.map(item => item.filePath);

      const totalFileWords = getTotalFileWords(filePathList);
      const eachFileWords = getEachFileWords(fileList, option.cn, option.en);

      themeConfig.docAnalysisInfo = {
        fileList,
        totalFileWords,
        eachFileWords,
        lastCommitTime: (await getLastCommitTime()) || getLastUpdateTime(filePathList),
      };
    },
  };
}
