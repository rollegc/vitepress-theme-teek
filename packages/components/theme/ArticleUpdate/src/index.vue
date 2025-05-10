<script setup lang="ts" name="ArticleUpdate">
import type { TkContentData } from "@teek/config";
import { computed } from "vue";
import { withBase, useRoute, useData } from "vitepress";
import { useNamespace, useLocale } from "@teek/hooks";
import { editPenIcon } from "@teek/static";
import { usePosts } from "@teek/components/theme/ConfigProvider";
import { TkIcon } from "@teek/components/common/Icon";
import { TkTitleTag } from "@teek/components/common/TitleTag";

defineOptions({ name: "ArticleUpdate" });

const ns = useNamespace("article-update");
const { t } = useLocale();
const posts = usePosts();
const route = useRoute();
const { frontmatter } = useData();

const archivesUrl = computed(() => {
  const archivesPost = posts.value.allPosts.find(
    item => item.frontmatter.layout === "TkCataloguePage" || item.frontmatter.archivesPage === true
  );

  return archivesPost?.url;
});

const updatePosts = computed(() => {
  const path = "/" + route.data.relativePath.replace(".md", "");
  return [
    ...posts.value.sortPostsByDate.filter(item => ![route.path, path, `${path}.html`].includes(item.url)).slice(0, 3),
    { title: "更多文章 >", url: archivesUrl.value, frontmatter: {}, date: "" } as TkContentData,
  ];
});
</script>

<template>
  <div :class="ns.b()" v-show="frontmatter.article !== false">
    <div :class="[ns.e('title'), 'flx-align-center']">
      <TkIcon :icon="editPenIcon" class="edit-icon" aria-hidden="true" />
      <a v-if="archivesUrl" :href="withBase(archivesUrl)" class="hover-color" :aria-label="t('tk.articleUpdate.label')">
        {{ t("tk.articleUpdate.label") }}
      </a>
      <span v-else>{{ t("tk.articleUpdate.label") }}</span>
    </div>

    <ul>
      <li v-for="(item, index) in updatePosts" :key="item.url" class="flx-center">
        <span :class="ns.m('num')" aria-hidden="true">
          {{ index !== updatePosts.length - 1 ? (index + 1).toString().padStart(2, "0") : "" }}
        </span>

        <div :class="ns.e('content')">
          <a v-if="item.url" :href="withBase(item.url)" class="flx-1 hover-color" :aria-label="item.title">
            <span class="sle">{{ item.title }}</span>
            <TkTitleTag :text="item.frontmatter.titleTag" position="right" size="small" />
          </a>
          <span v-if="item.date" :class="ns.em('content', 'date')">{{ item.date }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>
