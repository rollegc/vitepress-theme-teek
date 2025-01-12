// 基础
const excludes = ['node_modules', 'dist'];

export const excludeFiles = (files: string[]) => {
  return files.filter(path => !excludes.some(exclude => path.includes(exclude)));
};
