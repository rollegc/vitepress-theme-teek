import type { InjectionKey } from "vue";
import { CommentProvider } from "../../../config/types";

export interface WalineInstance {
  el: HTMLElement | null;
  update: (newOptions?: any) => void;
  destroy: () => void;
}

export const walineSymbol: InjectionKey<
  (options: CommentProvider["waline"], el: string | HTMLElement | null) => WalineInstance | null
> = Symbol("waline");
