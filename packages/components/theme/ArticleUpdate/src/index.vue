<script setup lang="ts" name="ArticleUpdate">
import { computed } from "vue";
import { withBase, useRoute, useData } from "vitepress";
import { useNamespace } from "@teek/hooks";
import { editPenIcon } from "@teek/static";
import { usePosts } from "@teek/components/theme/ConfigProvider";
import { TkIcon } from "@teek/components/common/Icon";
import { TkTitleTag } from "@teek/components/common/TitleTag";

defineOptions({ name: "ArticleUpdate" });

const ns = useNamespace("article-update");
const posts = usePosts();
const route = useRoute();
const { frontmatter } = useData();

const updatePosts = computed(() => {
  const path = "/" + route.data.relativePath.replace(".md", "");
  return [
    ...posts.value.sortPostsByDate.filter(item => ![route.path, path, `${path}.html`].includes(item.url)).slice(0, 3),
    { title: "更多文章 >" },
  ];
});
</script>

<template>
  <div :class="ns.b()" v-show="frontmatter.article !== false">
    <div :class="[ns.e('title'), 'flx-align-center']">
      <TkIcon :icon="editPenIcon" class="edit-icon" />
      最近更新
    </div>

    <ul>
      <li v-for="(item, index) in updatePosts" :key="item.url" class="flx-center">
        <span :class="ns.m('num')">
          {{ index !== updatePosts.length - 1 ? (index + 1).toString().padStart(2, "0") : "" }}
        </span>

        <div :class="ns.e('content')">
          <a :href="item.url && withBase(item.url)" class="flx-1 hover-color">
            <span class="sle">{{ item.title }}</span>
            <TkTitleTag :text="item.frontmatter?.titleTag" position="right" size="small" />
          </a>
          <span v-if="item.date" :class="ns.em('content', 'date')">{{ item.date }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>
