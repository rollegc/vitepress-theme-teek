<script setup lang="ts" name="ArticleTitle">
import type { TkContentData } from "@teek/config";
import type { TkTitleTagProps } from "@teek/components/common/TitleTag";
import { computed } from "vue";
import { parseElementNameAndAttrs } from "@teek/helper";
import { useNamespace, useLocale } from "@teek/hooks";
import { TkTitleTag } from "@teek/components/common/TitleTag";

defineOptions({ name: "ArticleTitle" });

const props = defineProps<{ post: TkContentData; titleTagProps?: TkTitleTagProps }>();

const ns = useNamespace("article-title");
const { t } = useLocale();

// 获取文章标题的 HTML 信息
const componentInfo = computed(() => {
  if (!props.post.titleHtml.componentText) return {};
  return parseElementNameAndAttrs(props.post.titleHtml.componentText);
});
</script>

<template>
  <span :class="ns.b()" :aria-label="t('tk.articleTitle.label')">
    <TkTitleTag
      v-if="post.frontmatter.titleTag && titleTagProps.position === 'left'"
      :text="post.frontmatter.titleTag"
      v-bind="titleTagProps"
      :aria-label="post.frontmatter.titleTag"
    />

    <template v-if="post.titleHtml?.position === 'before'">
      <component v-if="componentInfo.isComponent" :is="componentInfo.name" v-bind="componentInfo.attrs" class="left" />
      <span v-else v-html="post.titleHtml" />
    </template>

    <slot><span class="sle" v-html="post.titleHtml?.text || post.title" /></slot>

    <template v-if="post.titleHtml?.position === 'after'">
      <component v-if="componentInfo.isComponent" :is="componentInfo.name" v-bind="componentInfo.attrs" class="right" />
      <span v-else v-html="post.titleHtml" />
    </template>

    <TkTitleTag
      v-if="post.frontmatter.titleTag && titleTagProps.position === 'right'"
      :text="post.frontmatter.titleTag"
      v-bind="titleTagProps"
      :aria-label="post.frontmatter.titleTag"
    />
  </span>
</template>
