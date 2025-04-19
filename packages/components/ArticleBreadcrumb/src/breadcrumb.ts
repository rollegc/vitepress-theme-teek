import type { InjectionKey } from "vue";
import type { UseNamespaceReturn } from "@teek/hooks";

export interface BreadcrumbProps {
  /**
   * 分隔符
   *
   * @default '/'
   */
  separator?: string;
}

export const breadcrumbKey: InjectionKey<BreadcrumbProps> = Symbol("breadcrumbKey");
export const breadcrumbNsSymbol: InjectionKey<UseNamespaceReturn> = Symbol("breadcrumbNs");
