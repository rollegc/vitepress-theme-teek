import type { TkContentData } from "../../../post/types";
import type { ArticleInfoPosition } from "../../../config/types";

export interface PostBaseInfoProps {
  post: TkContentData;
  scope: ArticleInfoPosition;
  split?: boolean;
}
