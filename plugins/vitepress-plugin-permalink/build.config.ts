import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: [
    "src/index",
    "src/usePermalink",
    {
      builder: "mkdist",
      input: "src/components",
      outDir: "dist/components",
      pattern: ["**/*.vue"],
      loaders: ["vue"],
    },
  ],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
    output: {
      exports: "named",
    },
  },
  externals: ["vitepress", "vue", "vite"],
  failOnWarn: false,
});
