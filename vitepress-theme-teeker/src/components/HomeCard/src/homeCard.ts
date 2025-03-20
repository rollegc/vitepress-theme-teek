export interface HomeCardProps {
  title?: string;
  titleLink?: string;
  titleClick?: () => void;
  page?: boolean;
  pageSize?: number;
  total?: number;
  autoPage?: boolean;
  pageSpeed?: number;
}
