import type { InjectionKey } from "vue";
import { useNamespace, type UseNamespaceReturn } from "../../../hooks";

export const readingEnhanceNsSymbol: InjectionKey<UseNamespaceReturn> = Symbol("readingEnhanceNs");

export enum LayoutMode {
  FullWidth = "fullWidth",
  SidebarWidthAdjustableOnly = "sidebarWidthAdjustableOnly",
  BothWidthAdjustable = "bothWidthAdjustable",
  Original = "original",
}

export enum SpotlightStyle {
  Under = "under",
  Aside = "aside",
}

const ns = useNamespace("");

export const layoutModeStorageKey = ns.joinNamespace("layoutMode");
export const pageWidthSlideStorageKey = ns.joinNamespace("pageWidthSlide");
export const contentWidthSlideStorageKey = ns.joinNamespace("contentWidthSlide");
export const spotlightStorageKey = ns.joinNamespace("spotlight");
export const spotlightStyleStorageKey = ns.joinNamespace("spotlightStyle");
