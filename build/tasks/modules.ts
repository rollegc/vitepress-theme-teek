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
  external,
  excludes,
  webTsConfig,
  tsOutput,
} from "../helper";

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
    const plugins = [...commonPlugins];
    if (format === "esm") {
      plugins.push(
        dts({
          entryRoot: tkRoot,
          tsconfigPath: webTsConfig,
          outDir: tsOutput,
          exclude: [resolve(tkRoot, "src/assets")],
          beforeWriteFile: (filePath: string, content: string) => {
            let tempPath = filePath;
            // 打包默认生成的路径带有 src，因此去掉
            if (filePath.includes("dist/types/src")) tempPath = filePath.replace("dist/types/src", "dist/types");

            return { filePath: tempPath, content };
          },
        })
      );
    }

    return await rollup({
      input,
      plugins,
      external,
      treeshake: true,
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
