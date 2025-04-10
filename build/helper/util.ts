import { sep } from "node:path";
import { PKG_NAME, tkRoot } from "./path";

/**
 * dts 插件生成 .d.ts 文件时，默认会把组件目录下的 styles/*.ts 内容去掉，这里让插件保留
 */
export const cssResolver: any = {
  name: "vitepress-theme-teek-css-resolver",
  supports: (id: string) => id.includes("/style/css.ts") || id.includes("/style/index.ts"),
  transform: ({ id, code }: { id: string; code: string }) => {
    // 逻辑与 VitePressThemeTeekAlias、VitePressThemeTeekElementPlusAlias 方法一样（位于 ./plugin）
    const sourceThemeChalk = `@${PKG_NAME}/theme-chalk`;
    const bundleThemeChalk = `${PKG_NAME}/theme-chalk`;

    code = code.replaceAll(sourceThemeChalk, bundleThemeChalk);
    code = code.replaceAll(`@element-plus`, `element-plus/es/components`);
    // 移除 `"use strict";` 和换行符
    code = code.replace(/"use strict";\s*/g, "");

    return [
      {
        path: id.replaceAll("/", sep).replace(tkRoot, "./types").replace(".ts", ".d.ts"), // 替换为 ./types\**\xx.d.ts，即基于 outDir 目录生成 .d.ts 文件
        content: JSON.stringify(code), // 确保 code 被写入 .d.ts 文件
      },
    ];
  },
};
