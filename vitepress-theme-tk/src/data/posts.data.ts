import { createContentLoader } from "vitepress";
import { Post } from "../types/post";
import {
  filterPosts,
  getSortPostsByDateAndSticky,
  getSortPostsByDate,
  getGroupPosts,
  getGroupCards,
} from "../helper/post";

export default createContentLoader("**/*.md", {
  excerpt: true, // 包含摘录
  transform(raw): Post {
    const posts = filterPosts(raw);
    const sortPostsByDateAndSticky = getSortPostsByDateAndSticky(posts);
    const sortPostsByDate = getSortPostsByDate(sortPostsByDateAndSticky);
    const groupPosts = getGroupPosts(sortPostsByDate);
    const groupCards = getGroupCards(groupPosts);

    return {
      posts,
      sortPostsByDateAndSticky,
      sortPostsByDate,
      groupPosts,
      groupCards,
    };
  },
});
