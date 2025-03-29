<script setup lang="ts" name="ArticleInfo">
import { useRoute, withBase, useData } from "vitepress";
import { computed, unref } from "vue";
import { usePosts } from "../../../configProvider";
import { formatDate, isFunction } from "../../../helper";
import { TkContentData } from "../../../post/types";
import { useNamespace } from "../../../hooks";
import { userIcon, calendarIcon, editPenIcon, folderOpenedIcon, collectionTagIcon } from "../../../assets/icons";
import { Article, ArticleInfoPosition } from "../../../config/types";
import { PostBaseInfoProps } from "./articleInfo";
import Icon from "../../Icon";

defineOptions({ name: "ArticleInfo" });

const ns = useNamespace("articleInfo");

const { post, scope, split = false } = defineProps<PostBaseInfoProps>();

const { theme, frontmatter, page } = useData();
// 文章信息配置项
const articleConfig = computed<Article>(() => {
  const {
    showIcon = true,
    dateFormat = "yyyy-MM-dd",
    showAuthor = true,
    showCreateDate = true,
    showUpdateDate = false,
    showCategory = false,
    showTag = false,
  }: Article = {
    ...unref(theme).article,
    ...unref(frontmatter).article,
    ...unref(frontmatter).tk?.article,
  };

  return { showIcon, dateFormat, showAuthor, showCreateDate, showUpdateDate, showCategory, showTag };
});

const posts = usePosts();
const route = useRoute();

// 文章创建时间，先读取 post.date，如果不存在，则遍历所有 md 文档获取文档的创建时间（因此建议在文档的 frontmatter 配置 date，让文章扫描耗费性能降低）
const createDate = computed(() => {
  const originPosts: TkContentData[] = unref(posts).originPosts;
  const date =
    post.date ||
    originPosts.filter(item => [item.url, `${item.url}.md`].includes(`/${route.data.relativePath}`))[0]?.date;
  const dateFormatConst = unref(articleConfig).dateFormat;

  if (isFunction(dateFormatConst)) return dateFormatConst(date || "");
  return formatDate(date || new Date(), dateFormatConst);
});

// 文章更新时间，取 git 的最后一次提交时间
const updateDate = computed(() => {
  const date = unref(page).lastUpdated;
  if (!date) return "";

  const dateFormatConst = unref(articleConfig).dateFormat;

  if (isFunction(dateFormatConst)) return dateFormatConst(date);
  return formatDate(date, dateFormatConst);
});

const baseInfo = computed(() => {
  const { showAuthor, showCreateDate, showUpdateDate, showCategory, showTag } = unref(articleConfig);
  return [
    {
      title: "作者",
      icon: userIcon,
      data: post.author?.name,
      href: post.author?.link,
      target: post.author?.link ? "_blank" : "_self",
      show: isShow(showAuthor),
    },
    {
      title: "创建时间",
      icon: calendarIcon,
      data: createDate,
      show: isShow(showCreateDate),
    },
    {
      title: "更新时间",
      icon: editPenIcon,
      data: updateDate,
      show: unref(updateDate) && scope === "article" && showUpdateDate,
    },
    {
      title: "分类",
      icon: folderOpenedIcon,
      dataList: post.frontmatter?.categories || [],
      href: "/categories?category={data}",
      class: "or",
      show: scope === "post" || isShow(showCategory),
    },
    {
      title: "标签",
      icon: collectionTagIcon,
      dataList: post.frontmatter?.tags || [],
      href: "/tags?tag={data}",
      class: "or",
      show: scope === "post" || isShow(showTag),
    },
  ];
});

const isShow = (showInfo?: boolean | ArticleInfoPosition[]) => {
  const arr = [showInfo || []].flat();
  if (arr.includes(true) || arr.includes(scope)) return true;
  return false;
};
</script>

<template>
  <div :class="[ns.b(), scope]">
    <template v-for="item in baseInfo" :key="item.title">
      <span v-if="item.show && (item.data || item.dataList?.length)" :class="[ns.e('item'), { split }]">
        <Icon v-if="articleConfig.showIcon" :icon="item.icon" />
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
