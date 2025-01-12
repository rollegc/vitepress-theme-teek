import { resolve } from 'path';
import { rollup } from 'rollup';
import chalk from 'chalk';
import glob from 'fast-glob';
import dts from 'vite-plugin-dts';
import { tkOutput, writeBundles, tkRoot, plugins, external, excludeFiles, webTsConfig, tsOutput } from '../helper';

const buildModules = async () => {
  const input = excludeFiles(
    await glob('**/*.{js,ts,vue}', {
      cwd: tkRoot,
      absolute: true,
      onlyFiles: true,
    })
  );

  plugins.push(
    dts({
      entryRoot: tkRoot,
      tsconfigPath: webTsConfig,
      outDir: tsOutput,
    })
  );

  console.log(chalk.cyan('Starting build modules'));

  const bundle = await rollup({
    input,
    plugins,
    external,
    treeshake: true,
  });

  await writeBundles(bundle, [
    {
      format: 'esm',
      dir: resolve(tkOutput, 'es'),
      exports: 'named',
      preserveModules: true,
      sourcemap: false,
      entryFileNames: `[name].mjs`,
    },
    {
      format: 'cjs',
      dir: resolve(tkOutput, 'lib'),
      exports: 'named',
      preserveModules: true,
      sourcemap: false,
      entryFileNames: `[name].js`,
    },
  ]);

  console.log(chalk.green('Successfully build modules'));
};

export default [buildModules()];
