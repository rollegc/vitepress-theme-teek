import { resolve } from 'path';

/** 项目根目录 `/`  */
export const projRoot = resolve(__dirname, '../../');
/** vitepress-theme-tk 目录 即 `/vitepress-theme-tk` */
export const tkRoot = resolve(projRoot, 'vitepress-theme-tk');

/** 组件目录 `/vitepress-theme-tk/components` */
export const compRoot = resolve(tkRoot, 'components');

/** Docs */
export const docsDirName = 'docs';
export const docRoot = resolve(projRoot, docsDirName);
export const vpRoot = resolve(docRoot, '.vitepress');

/** `/dist` */
export const buildOutput = resolve(projRoot, 'dist');
/** `/dist/vitepress-theme-tk` */
export const tkOutput = resolve(buildOutput, 'vitepress-theme-tk');
/** /dist/types */
export const tsOutput = resolve(buildOutput, 'types');

export const tkPackage = resolve(tkRoot, 'package.json');
export const projPackage = resolve(projRoot, 'package.json');
export const docPackage = resolve(docRoot, 'package.json');

/** /tsconfig.web.json */
export const webTsConfig = resolve(projRoot, 'tsconfig.web.json');

