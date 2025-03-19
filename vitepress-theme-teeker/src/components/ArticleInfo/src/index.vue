<script setup lang="ts" name="ArticleInfo">
import { User, Calendar, FolderOpened, CollectionTag } from "@element-plus/icons-vue";
import { useRoute, withBase, useData } from "vitepress";
import { computed, unref } from "vue";
import { usePosts, useUnrefData } from "../../../configProvider";
import { formatDate, isFunction } from "../../../helper";
import { TkContentData } from "../../../post/types";
import { useNamespace } from "../../../hooks";
import { Article } from "../../../config/types";
import { PostBaseInfoProps } from "./articleInfo";
import Icon from "../../Icon";

defineOptions({ name: "ArticleInfo" });

const ns = useNamespace("articleInfo");

const { post, scope, split = false } = defineProps<PostBaseInfoProps>();

const { theme } = useUnrefData();
const { frontmatter } = useData();
// 文章信息配置项
const articleConfig = computed<Article>(() => {
  const {
    showIcon = true,
    dateFormat = "yyyy-MM-dd",
    showAuthor = true,
    showDate = true,
    showCategory = false,
    showTag = false,
  }: Article = {
    ...theme.article,
    ...unref(frontmatter).article,
    ...unref(frontmatter).tk?.article,
  };

  return { showIcon, dateFormat, showAuthor, showDate, showCategory, showTag };
});

const posts = usePosts();
const route = useRoute();

// 文章创建时间，先读取 post.date，如果不存在，则遍历所有 md 文档获取文档的创建时间（因此建议在文档的 frontmatter 配置 date，让文章扫描耗费性能降低）
const date = computed(() => {
  // 如果 date 是函数，则调用获取返回值作为 date
  const date = post.date;
  const dateFormatConst = unref(articleConfig).dateFormat;

  if (date) {
    if (isFunction(dateFormatConst)) return dateFormatConst(date);
    return formatDate(date, dateFormatConst);
  }

  // 如果 frontmatter 没有配置 date，则从 posts 中获取文档的创建时间
  const originPosts: TkContentData[] = unref(posts).originPosts;
  const targetPost = originPosts.filter(item => [item.url, `${item.url}.md`].includes(`/${route.data.relativePath}`));

  if (isFunction(dateFormatConst)) return dateFormatConst(targetPost[0]?.date || "");
  return formatDate(targetPost[0]?.date || new Date(), dateFormatConst);
});

const baseInfo = computed(() => [
  {
    title: "作者",
    icon: User,
    data: post.author?.name,
    href: post.author?.link,
    target: post.author?.link ? "_blank" : "_self",
    show: unref(articleConfig).showAuthor,
  },
  {
    title: "创建时间",
    icon: Calendar,
    data: date,
    show: unref(articleConfig).showDate,
  },
  {
    title: "分类",
    icon: FolderOpened,
    dataList: post.frontmatter?.categories || [],
    href: "/categories?category={data}",
    class: "or",
    show: scope === "home" || unref(articleConfig).showCategory,
  },
  {
    title: "标签",
    icon: CollectionTag,
    dataList: post.frontmatter?.tags || [],
    href: "/tags?tag={data}",
    class: "or",
    show: scope === "home" || unref(articleConfig).showTag,
  },
]);
</script>

<template>
  <div :class="[ns.b(), scope]">
    <template v-for="item in baseInfo" :key="item.title">
      <span
        v-if="item.show && (item.data || item.dataList?.length)"
        :class="[ns.e('item'), `${scope}-item`, { split }]"
      >
        <Icon v-if="articleConfig.showIcon"><component :is="item.icon" /></Icon>
        <a
          v-if="item.data"
          :title="item.title"
          :href="item.href && withBase(item.href)"
          :target="item.target"
          :class="[item.class, 'hover-color']"
        >
          {{ item.data }}
        </a>
        <a
          v-else
          v-for="(data, index) in item.dataList"
          :key="index"
          :title="item.title"
          :href="item.href && withBase(item.href.replace('{data}', encodeURIComponent(data)))"
          :class="[item.class, 'hover-color']"
        >
          {{ data }}
        </a>
      </span>
    </template>

    <slot />
  </div>
</template>
