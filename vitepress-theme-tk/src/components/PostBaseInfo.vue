<script setup lang="ts" name="PostBaseInfo">
import { ElIcon } from "element-plus";
import { User, Calendar, FolderOpened, CollectionTag } from "@element-plus/icons-vue";
import { usePosts, useUnrefData } from "../configProvider";
import { computed, unref } from "vue";
import { formatDate, isFunction } from "../helper";
import { TkContentData } from "../post/types";
import { useDesign } from "../hooks";
import { useData, useRoute } from "vitepress";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("postBaseInfo");

export interface PostBaseInfoProps {
  post?: TkContentData;
}

// 首页会传入 post，文章页不传
const { post } = defineProps<PostBaseInfoProps>();

const { frontmatter, theme } = useUnrefData();
const {
  showIcon = true,
  dateFormat = "yyyy-MM-dd",
  showBaseInfo = true,
  showAuthor = true,
  showDate = true,
  showCategory = false,
  showTag = false,
} = { ...theme.post, ...frontmatter.post, ...frontmatter.tk?.post };

const { author = {} } = { ...theme, ...frontmatter, ...post?.frontmatter };

const posts = usePosts();
const { localeIndex } = useData();
const route = useRoute();

// 文章创建时间，先读取 post.date || frontmatter.date，如果不存在，则遍历所有 md 文档获取文档的创建时间（因此建议在 frontmatter 配置 date，减少文章扫描性能）
const date = computed(() => {
  // 如果 date 是函数，则调用获取返回值作为 date
  const date = post?.date || frontmatter.date;
  if (date) {
    if (isFunction(dateFormat)) return dateFormat(date);
    return formatDate(date, dateFormat);
  }

  // 如果 frontmatter 没有配置 date，则从 posts 中获取文档的创建时间
  const originPosts = unref(posts).originPosts;
  const targetPost = originPosts.filter(item => [item.url, `${item.url}.md`].includes(`/${route.data.relativePath}`));

  return formatDate(targetPost?.[0]?.date || new Date(), dateFormat);
});

// 是否展示作者、日期、分类、标签等信息
const isShowBaseInfo = computed(() => {
  const arr = [showBaseInfo].flat();
  if (arr.includes(true) || arr.includes("home")) return true;
  return false;
});

const baseInfo = [
  {
    title: "作者",
    icon: User,
    data: author.name,
    href: author.link,
    target: author.link ? "_blank" : "_self",
    show: showAuthor,
  },
  {
    title: "创建时间",
    icon: Calendar,
    data: unref(date),
    show: showDate,
  },
  {
    title: "分类",
    icon: FolderOpened,
    dataList: post?.frontmatter?.categories || frontmatter.categories || [],
    href: "/categories?category={data}",
    class: "or",
    show: showCategory,
  },
  {
    title: "标签",
    icon: CollectionTag,
    dataList: post?.frontmatter?.tags || frontmatter.tags || [],
    href: "/tags?tag={data}",
    class: "or",
    show: showTag,
  },
];
</script>

<template>
  <div
    v-if="isShowBaseInfo"
    :class="[`${prefixClass}`, 'flx-align-center', `${post ? 'home-post-base' : 'page-base'}`]"
  >
    <template v-for="item in baseInfo" :key="item.title">
      <template v-if="post || item.show">
        <div
          v-if="item.data || item.dataList?.length"
          :class="['flx-center', `${post ? 'split home-post-base-tem' : 'page-base-item'}`]"
        >
          <el-icon v-if="showIcon"><component :is="item.icon" /></el-icon>
          <a v-if="item.data" :title="item.title" :href="item.href" :target="item.target" :class="item.class">
            {{ item.data }}
          </a>
          <a
            v-else
            v-for="(data, index) in item.dataList"
            :key="index"
            :title="item.title"
            :href="item.href?.replace('{data}', encodeURIComponent(data))"
            :class="item.class"
          >
            {{ data }}
          </a>
        </div>
      </template>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/components/postBaseInfo.scss";
</style>
