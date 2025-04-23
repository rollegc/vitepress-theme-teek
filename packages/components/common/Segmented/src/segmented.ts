export type ModelType = string | number | object | boolean;

export interface SegmentedProps {
  options: SegmentedOption[];
  disabled?: boolean;
}

export interface SegmentedOption extends SegmentedBase {
  ariaLabel?: string;
}

export interface SegmentedItemProps extends SegmentedBase {
  disabled?: boolean;
}

export interface SegmentedBase {
  title: string;
  name?: string;
  icon?: string;
  text?: string;
  value?: ModelType;
}
