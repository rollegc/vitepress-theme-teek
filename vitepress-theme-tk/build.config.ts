import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["src/config/index.ts"],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
  },
});
