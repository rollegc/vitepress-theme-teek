import { InjectionKey } from "vue";
import type { UseNamespaceReturn } from "../../../hooks";

export const namespaceSymbol: InjectionKey<UseNamespaceReturn> = Symbol("namespace");
