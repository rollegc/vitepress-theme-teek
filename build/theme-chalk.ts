import { parse, resolve } from "node:path";
import { buildOutput, tcOutput, tkOutput, tkRoot } from "./helper/path";
import glob from "fast-glob";
import { access, mkdir, writeFile } from "node:fs/promises";
import { compile } from "sass";
import postcss from "postcss";
// import postcssNested from "postcss-nested";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import picocolors from "picocolors";
import { copy } from "fs-extra";

const isDev = process.env.THEME_CHALK_DEV === "true";
const styleRoot = resolve(tkRoot, "./src/styles");

const buildStyle = async () => {
  // 获取所有 scss 文件
  const files = await glob([`**/*.scss`], {
    cwd: styleRoot,
    absolute: true,
    ignore: ["**/var/**", "**/module/**", "**/mixins/**", "**/common/**"],
  });

  // 生成 /dist 文件夹
  try {
    await access(buildOutput);
  } catch (error) {
    await mkdir(buildOutput);
  }

  for (const item of files) {
    const content = compile(item);
    // 文件名，不包含后缀
    const { name } = parse(item);
    const plugins: any[] = [autoprefixer];
    // 生产环境开启压缩
    if (!isDev) plugins.push(cssnano);
    const result = await postcss(plugins).process(content.css, { from: undefined });
    const filename = name === "index" ? "index.css" : `${name}.css`;
    await writeFile(resolve(buildOutput, filename), result.css);
  }

  // 复制源文件到 /dist/src
  await copy(styleRoot, resolve(buildOutput, "src"));

  // 复制打包后的文件 /dist 到 /dist/vitepress-theme-teeker/theme-chalk
  await copy(buildOutput, resolve(tcOutput));

  // 复制打包后的 /dist/index.css 文件到 /dist/vitepress-theme-teeker/index.css
  await copy(resolve(buildOutput, "index.css"), resolve(tkOutput, "index.css"));
};

buildStyle()
  .then(() => {
    picocolors.green(`Successfully build theme-chalk!`);
  })
  .catch(err => {
    picocolors.red(err);
  });
