import tasks from "./tasks";
import { copyFile, readFile, writeFile } from "fs/promises";
import { copy } from "fs-extra";
import { resolve } from "path";
import { tkPackage, tkOutput, projRoot, buildOutput } from "./helper";
import picocolors from "picocolors";

/**
 * 复制 .d.ts 文件到指定目录
 */
const copyTypesDefinitions = async () => {
  const typesDirSrc = resolve(buildOutput, "types");

  // 复制 .d.ts 到 es
  await copy(typesDirSrc, resolve(tkOutput, "es"));

  // 复制 .d.ts 到 lib
  await copy(typesDirSrc, resolve(tkOutput, "lib"));
};

/**
 * 复制指定的项目文件到打包目录下
 */
const copyFiles = () =>
  Promise.all([
    copyFile(tkPackage, resolve(tkOutput, "package.json")),
    copyFile(resolve(projRoot, "README.md"), resolve(tkOutput, "README.md")),
  ]);

/**
 * 更新版本号
 */
const updateVersion = async () => {
  const tkOutputPkg = resolve(tkOutput, "package.json");
  const tkOutputPkgContent = await readFile(tkOutputPkg, "utf-8");
  const tkPackageContent = await readFile(resolve(projRoot, "package.json"), "utf-8");
  const tkOutputPkgInfo = JSON.parse(tkOutputPkgContent);
  const tkPackageInfo = JSON.parse(tkPackageContent);
  tkOutputPkgInfo.version = tkPackageInfo.version;

  await writeFile(tkOutputPkg, JSON.stringify(tkOutputPkgInfo, null, 2) + "\n");

  // const versionFile = resolve(tkOutput, "es/version.mjs");
  // const versionContent = await readFile(versionFile, "utf-8");
  // const newVersion = versionContent.replace("1.0.0", tkPackageInfo.version);

  // await writeFile(versionFile, JSON.stringify(newVersion, null, 2) + "\n");
};

Promise.all(tasks).then(async () => {
  await copyTypesDefinitions();
  console.log(picocolors.green("Successfully copied definition file"));

  await copyFiles();
  console.log(picocolors.green("Successfully copied package.json and README.md"));

  await updateVersion();
  console.log(picocolors.green("Successfully updated version"));
});
