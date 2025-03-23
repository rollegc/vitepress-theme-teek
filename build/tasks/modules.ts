import { resolve } from "path";
import { OutputOptions, rollup } from "rollup";
import picocolors from "picocolors";
import glob from "fast-glob";
import dts from "vite-plugin-dts";
import {
  tkOutput,
  writeBundlesFn,
  tkRoot,
  plugins as commonPlugins,
  externalModule,
  excludes,
  webTsConfig,
  tsOutput,
  VitepressThemeTeekElementPlusAlias,
} from "../helper";
import { cssResolver } from "../helper/util";

const buildModules = async () => {
  const input = await glob("**/*.{js,ts,vue}", {
    cwd: tkRoot,
    absolute: true,
    onlyFiles: true,
    ignore: excludes,
  });

  /**
   * 根据 format 生成对应的 bundle
   */
  const getBundles = async (format: "esm" | "cjs") => {
    const plugins = [VitepressThemeTeekElementPlusAlias(format), ...commonPlugins];

    if (format === "esm") {
      // 添加构建 Typescript 类型插件
      plugins.push(
        dts({
          entryRoot: tkRoot,
          tsconfigPath: webTsConfig,
          outDir: tsOutput,
          staticImport: true,
          exclude: [resolve(tkRoot, "src/assets")],
          resolvers: [cssResolver],
          beforeWriteFile: (filePath: string, content: string) => {
            let tempPath = filePath;
            // 打包默认生成的路径带有 src，因此去掉
            if (filePath.includes("dist/types/src")) tempPath = filePath.replace("dist/types/src", "dist/types");

            // 在 cssResolver 里对 content 使用了 JSON.stringify，因此这里需要转换为 JSON
            if (filePath.includes("style/index") || filePath.includes("style/css")) content = JSON.parse(content);

            return { filePath: tempPath, content };
          },
        })
      );
    }

    return await rollup({
      input,
      plugins,
      external: externalModule,
      treeshake: true,
      onwarn: (warning, defaultHandler) => {
        // 过滤掉 "Generated an empty chunk" 的警告
        if (warning.code === "EMPTY_BUNDLE") return;

        // 打印其他警告
        defaultHandler(warning);
      },
    });
  };

  console.log(picocolors.cyan("Starting build modules"));

  const commonOptions: OutputOptions = {
    exports: "named",
    preserveModules: true, // 打包的文件按照源目录结构生成
    preserveModulesRoot: tkRoot + "/src", // 打包后的源目录去掉 ${tkRoot}/src 前缀
    sourcemap: false,
  };

  await writeBundlesFn(getBundles, [
    {
      format: "esm",
      dir: resolve(tkOutput, "es"),
      entryFileNames: `[name].mjs`,
      ...commonOptions,
    },
    {
      format: "cjs",
      dir: resolve(tkOutput, "lib"),
      entryFileNames: `[name].js`,
      ...commonOptions,
    },
  ]);

  console.log(picocolors.green("Successfully build modules"));
};

export default [buildModules()];
