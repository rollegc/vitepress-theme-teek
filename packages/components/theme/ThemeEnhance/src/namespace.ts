import { useNamespace } from "@teek/hooks";

export const ns = useNamespace("theme-enhance");

export const transitionName = ns.joinNamespace("theme-enhance-slide");
export const pageMaxWidthVar = ns.cssVarName("page-max-width");
export const docMaxWidthVar = ns.cssVarName("doc-max-width");

export const layoutModeStorageKey = ns.joinNamespace("layoutMode");
export const pageMaxWidthSlideStorageKey = ns.joinNamespace("pageMaxWidthSlide");
export const docMaxWidthSlideStorageKey = ns.joinNamespace("docMaxWidthSlide");
export const themeColorStorageKey = ns.joinNamespace("themeColor");
export const spotlightStorageKey = ns.joinNamespace("spotlight");
export const spotlightStyleStorageKey = ns.joinNamespace("spotlightStyle");
