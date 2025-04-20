import { resolve } from "path";
import { outputPkgName } from "./constants";

/** 项目根目录 `/`  */
export const projectRoot = resolve(__dirname, "..", "..");
/** `/vitepress-theme-teek` */
export const pkgRoot = resolve(projectRoot, outputPkgName);
/** `/vitepress-theme-teek/src` */
export const tkRoot = resolve(pkgRoot, "src");

/** `docs` */
export const docsDirName = "docs";
export const docRoot = resolve(projectRoot, docsDirName);
export const vpRoot = resolve(docRoot, ".vitepress");

/** `/dist` */
export const buildOutput = resolve(projectRoot, "dist");
/** `/dist/vitepress-theme-teek` */
export const tkOutput = resolve(buildOutput, outputPkgName);
/** `/dist/types` */
export const tsOutput = resolve(buildOutput, "types");

/** `/vitepress-theme-teek/package.json` */
export const tkPackage = resolve(pkgRoot, "package-release.json");
/** `/package.json` */
export const projectPackage = resolve(projectRoot, "package.json");
/** `/docs/package.json` */
export const docPackage = resolve(docRoot, "package.json");

/** `/tsconfig.web.json` */
export const webTsConfig = resolve(projectRoot, "tsconfig.web.json");

/** `/dist/vitepress-theme-teek/theme-chalk` */
export const tcOutput = resolve(tkOutput, "theme-chalk");
