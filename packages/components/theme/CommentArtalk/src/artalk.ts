import type { InjectionKey } from "vue";
import type { CommentProvider } from "@teek/config";

export const artalkContext: InjectionKey<(options: CommentProvider["artalk"], el: string | HTMLElement) => any> =
  Symbol("artalk");
