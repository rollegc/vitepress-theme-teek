import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["src/index", "src/version", "src/config/index"],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
  },
});
