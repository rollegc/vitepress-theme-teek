import { useNamespace } from "../../../hooks";

export const ns = useNamespace("reading-enhance");

export const transitionName = ns.joinNamespace("reading-enhance-slide");
export const pageMaxWidthVar = ns.cssVarName("page-max-width");
export const docMaxWidthVar = ns.cssVarName("doc-max-width");

export const layoutModeStorageKey = ns.joinNamespace("layoutMode");
export const pageMaxWidthSlideStorageKey = ns.joinNamespace("pageMaxWidthSlide");
export const docMaxWidthSlideStorageKey = ns.joinNamespace("docMaxWidthSlide");
export const layoutColorSlideStorageKey = ns.joinNamespace("layoutColor");
export const spotlightStorageKey = ns.joinNamespace("spotlight");
export const spotlightStyleStorageKey = ns.joinNamespace("spotlightStyle");
export const spotlightToggleStorageKey = ns.joinNamespace("spotlightStyle");
