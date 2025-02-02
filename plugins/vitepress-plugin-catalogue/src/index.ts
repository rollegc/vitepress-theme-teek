import type { PluginOption } from "vite";
import { CatalogueOption } from "./types";
import createCatalogues from "./helper";

export type { CatalogueOption };

export default function VitePluginVitePressCatalogue(option: CatalogueOption = {}): PluginOption {
  return {
    name: "vite-plugin-vitepress-catalogue",
    config(config: any) {
      const { themeConfig, srcDir } = config.vitepress.site;

      option.base = option.base || srcDir || ".";

      const catalogues = createCatalogues(option);

      // Key 为文件路径，Value 为目录页扫描的路径
      const filePathToCataloguePath: Record<string, string> = {};
      // Key 为目录页扫描的路径，Value 为文件路径
      const cataloguesPathToFilePath: Record<string, string> = {};

      for (const [key, value] of Object.entries(catalogues)) {
        filePathToCataloguePath[key] = value;
        cataloguesPathToFilePath[value] = key;
      }

      themeConfig.catalogues = {
        map: filePathToCataloguePath,
        inv: cataloguesPathToFilePath,
      };
    },
  };
}
