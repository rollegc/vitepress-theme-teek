import type Jumper from "./jumper.vue";

export interface PaginationJumperProps {
  size?: "" | "default" | "small" | "large";
}

export type PaginationJumperInstance = InstanceType<typeof Jumper>;
