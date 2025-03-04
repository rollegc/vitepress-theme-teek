import type Breadcrumb from "./Breadcrumb.vue";
import type BreadcrumbItem from "./BreadcrumbItem.vue";
import type index from "./index.vue";

export type BreadcrumbItemInstance = InstanceType<typeof BreadcrumbItem>;
export type BreadcrumbInstance = InstanceType<typeof Breadcrumb>;
export type ArticleBreadcrumbInstance = InstanceType<typeof index>;
