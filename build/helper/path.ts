import { resolve } from "path";

export const PKG_NAME = "vitepress-theme-teek";

/** 项目根目录 `/`  */
export const projectRoot = resolve(__dirname, "../../");
/** vitepress-theme-teek 目录 即 `/vitepress-theme-teek` */
export const tkRoot = resolve(projectRoot, PKG_NAME);

/** 组件目录 `/vitepress-theme-teek/components` */
export const compRoot = resolve(tkRoot, "components");

/** Docs */
export const docsDirName = "docs";
export const docRoot = resolve(projectRoot, docsDirName);
export const vpRoot = resolve(docRoot, ".vitepress");

/** `/dist` */
export const buildOutput = resolve(projectRoot, "dist");
/** `/dist/vitepress-theme-teek` */
export const tkOutput = resolve(buildOutput, PKG_NAME);
/** /dist/types */
export const tsOutput = resolve(buildOutput, "types");

export const tkPackage = resolve(tkRoot, "package.json");
export const projectPackage = resolve(projectRoot, "package.json");
export const docPackage = resolve(docRoot, "package.json");

/** /tsconfig.web.json */
export const webTsConfig = resolve(projectRoot, "tsconfig.web.json");

/** /dist/vitepress-theme-teek/theme-chalk */
export const tcOutput = resolve(tkOutput, "theme-chalk");
