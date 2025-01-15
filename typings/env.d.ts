declare module "*.data.ts" {
  export const data: any;
}

declare module "*.vue" {
  import type { ComponentOptions } from "vue";

  const comp: ComponentOptions;
  export default comp;
}
