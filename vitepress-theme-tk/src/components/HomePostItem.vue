<script setup lang="ts" name="HomePostItem">
import { computed, unref } from "vue";
import { useDesign } from "../hooks";
import { withBase } from "vitepress";
import { KtContentData } from "../data/types";
import { createImageViewer } from "./ImageViewer";
import { formatDate, isFunction } from "../helper";
import { ElIcon } from "element-plus";
import { User, Calendar, FolderOpened, CollectionTag } from "@element-plus/icons-vue";
import { useUnrefData } from "../configProvider";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("post-item");

const props = defineProps<{ post: KtContentData }>();

const { frontmatter, theme } = useUnrefData();

const {
  excerptPosition = "bottom",
  showMore = true,
  moreLabel = "阅读全文 >",
  coverImgMode = "default",
  showIcon = true,
  dateFormat = "yyyy-MM-dd",
  showBaseInfo = true,
  showCapture = false,
  imageViewer = {},
} = { ...theme.post, ...frontmatter.tk?.post };

const postFrontmatter = computed(() => props.post.frontmatter);
const excerpt = unref(postFrontmatter).description || props.post.excerpt || (showCapture && props.post.capture);

// 是否展示作者、日期、分类、标签等信息
const isShowBaseInfo = computed(() => {
  const arr = [showBaseInfo].flat();
  if (arr.includes(true) || arr.includes("home")) return true;
  return false;
});

const getDate = () => {
  // 如果 post.date 时函数，则调用获取返回值作为 date，否则 使用 formatDate 格式化
  const { date } = props.post;
  if (isFunction(dateFormat)) return dateFormat(date);
  return formatDate(date, dateFormat);
};

const baseInfo = [
  {
    title: "作者",
    icon: User,
    data: props.post.author?.name,
    href: props.post.author?.link,
    target: props.post.author?.link ? "_blank" : "_self",
  },
  { title: "创建时间", icon: Calendar, data: getDate() },
  {
    title: "分类",
    icon: FolderOpened,
    dataList: unref(postFrontmatter).categories,
    href: "/categories?category={data}",
    class: "or",
  },
  { title: "标签", icon: CollectionTag, dataList: unref(postFrontmatter).tags, href: "/tags?tag={data}", class: "or" },
];

/**
 * 点击图片进行预览
 */
const handleViewImg = (imgUrl: string | string[]) => {
  const urlList = [imgUrl || []].flat() as string[];
  const imageViewerOptions = { ...imageViewer, urlList };
  createImageViewer(imageViewerOptions);
};

const coverImgMap = computed(() => {
  const imgSrcList = [unref(postFrontmatter).coverImg || []].flat();
  return {
    default: {
      is: "div",
      props: {
        class: "default",
        style: `background-image: url(${imgSrcList[0]});`,
        onClick: () => handleViewImg(imgSrcList),
      },
    },
    large: {
      is: "img",
      props: {
        class: "large",
        src: imgSrcList[0],
        onClick: () => handleViewImg(imgSrcList),
      },
    },
  };
});
</script>

<template>
  <div :class="prefixClass">
    <i v-if="!!postFrontmatter.sticky" class="pin" :title="`置顶：${postFrontmatter.sticky}`" />

    <div :class="[`${prefixClass}-info`, { 'large-cover': coverImgMode === 'large' }]">
      <div :class="`${prefixClass}-info__left`">
        <!-- 标题 -->
        <a class="title" :href="post.url">
          {{ post.title }}
        </a>

        <!-- 摘要 top -->
        <div v-if="excerpt && excerptPosition === 'top'" :class="`${prefixClass}-info__left-excerpt top`">
          <div class="excerpt" v-html="excerpt" />
          <a v-if="showMore" class="more" :href="post.url">{{ moreLabel }}</a>
        </div>

        <!-- 文章信息 -->
        <div v-if="isShowBaseInfo" :class="`${prefixClass}-info__left-footer flx-align-center`">
          <template v-for="item in baseInfo" :key="item.title">
            <span v-if="item.data || item.dataList?.length" class="split flx-center">
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
            </span>
          </template>
        </div>

        <!-- 摘要 bottom -->
        <div v-if="excerpt && excerptPosition === 'bottom'" :class="`${prefixClass}-info__left-excerpt bottom`">
          <div class="excerpt" v-html="excerpt" />
          <a v-if="showMore" class="more" :href="post.url">{{ moreLabel }}</a>
        </div>
      </div>

      <!-- 右侧封面图 -->
      <div :class="`${prefixClass}-info__right flx-align-center`">
        <div v-if="postFrontmatter.coverImg || postFrontmatter.coverImg?.length" class="cover-img">
          <component :is="coverImgMap[coverImgMode].is" v-bind="coverImgMap[coverImgMode].props" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/components/homePostItem.scss";
</style>

<style lang="scss">
@use "../styles/namespace.scss" as *;

$prefix-class: #{$theme-namespace}-post-item;

.#{$prefix-class} {
  .excerpt {
    h1,
    h2,
    h3 {
      display: none;
    }

    img {
      max-height: 280px;
      max-width: 100%;
      margin: 0 auto;
    }
  }
}
</style>
