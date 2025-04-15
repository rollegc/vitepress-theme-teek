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

export const ns = useNamespace("reading-enhance");

export const transitionName = ns.joinNamespace("reading-enhance-slide");
export const pageMaxWidthVar = ns.cssVarName("page-max-width");
export const docMaxWidthVar = ns.cssVarName("doc-max-width");

export const layoutModeStorageKey = ns.joinNamespace("layoutMode");
export const pageMaxWidthSlideStorageKey = ns.joinNamespace("pageMaxWidthSlide");
export const docMaxWidthSlideStorageKey = ns.joinNamespace("docMaxWidthSlide");
export const spotlightStorageKey = ns.joinNamespace("spotlight");
export const spotlightStyleStorageKey = ns.joinNamespace("spotlightStyle");
