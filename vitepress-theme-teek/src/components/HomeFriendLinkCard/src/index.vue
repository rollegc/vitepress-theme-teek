<script setup lang="ts" name="HomeFriendLinkCard">
import { computed, ref, unref, onMounted } from "vue";
import { useData, withBase } from "vitepress";
import { useNamespace, useScrollData } from "../../../hooks";
import HomeCard from "../../HomeCard";
import { createImageViewer } from "../../ImageViewer";
import { friendLinkIcon } from "../../../assets/icons";
import { isFunction } from "../../../helper";
import type { FriendLink } from "../../../config/types";

defineOptions({ name: "HomeFriendLinkCard" });

const ns = useNamespace("friendLink");

const { theme, frontmatter } = useData();

// 友情链接配置项
const {
  list = [],
  limit = 4,
  title = `${friendLinkIcon}友情链接`,
  emptyLabel = "暂无友情链接",
  autoScroll = false,
  scrollSpeed = 2500,
  autoPage = false,
  pageSpeed = 4000,
}: FriendLink = { ...unref(theme).friendLink, ...unref(frontmatter).tk?.friendLink };

// 使用上下滚动功能
const { visibleData, startAutoScroll, stopAutoScroll } = useScrollData(list, 5, scrollSpeed);

const pageNum = ref(1);
// 友情链接渲染数据
const currentFriendLinkList = computed(() => {
  // 如果使用上下滚动功能，则显示滚动数据
  if (autoScroll) return unref(visibleData);

  // 分页功能
  const p = unref(pageNum);
  return list.slice((p - 1) * limit, p * limit);
});

const finalTitle = computed(() => {
  if (isFunction(title)) return title(friendLinkIcon);
  return title;
});

onMounted(() => {
  if (autoScroll) startAutoScroll();
});

// 每一个 li 的 ref 元素，用于获取元素高度来计算实际的 top 位置
const itemRefs = ref<HTMLLIElement[]>([]);

const getLiStyle = (index: number) => {
  if (autoScroll) return {};
  const clientRect = unref(itemRefs)?.[index]?.getBoundingClientRect();

  // 分页动画需要指定 top，否则默认移动到 0px 位置
  return {
    top: `calc(${index} * (calc(${ns.cssVar("home-friend-link-gap")} + ${clientRect?.height || 0}px)))`,
  };
};

const handleViewImg = (imgSrc: string, e: MouseEvent) => {
  // @click.stop 不起作用，因此手动阻止冒泡到 a 标签
  e.preventDefault();

  createImageViewer({ urlList: [imgSrc] });
};
</script>

<template>
  <slot name="teek-home-friend-link-before" />

  <HomeCard
    :page="!autoScroll"
    v-model="pageNum"
    :pageSize="limit"
    :total="list.length"
    :title="finalTitle"
    :autoPage
    :pageSpeed
    :class="ns.b()"
  >
    <template #default="{ transitionName, startAutoPage, closeAutoPage }">
      <TransitionGroup
        v-if="list?.length"
        :name="transitionName"
        tag="ul"
        mode="out-in"
        :class="`${ns.e('list')} flx-column`"
        @mouseenter="autoScroll ? stopAutoScroll() : autoPage ? closeAutoPage() : () => {}"
        @mouseleave="autoScroll ? startAutoScroll() : autoPage ? startAutoPage() : () => {}"
      >
        <li
          :ref="autoScroll ? '' : 'itemRefs'"
          v-for="(item, index) in currentFriendLinkList"
          :key="item.name"
          :class="ns.e('list__item')"
          :style="getLiStyle(index)"
        >
          <a :href="item.link && withBase(item.link)" target="_blank" class="hover-color flx-align-center">
            <img
              :src="item.avatar && withBase(item.avatar)"
              class="friend-avatar"
              :alt="item.name || item.alt"
              @click="handleViewImg(item.avatar, $event)"
            />
            <div :class="ns.e('list__item__info')">
              <div class="friend-name sle">{{ item.name }}</div>
              <div class="friend-desc sle">{{ item.desc }}</div>
            </div>
          </a>
        </li>
      </TransitionGroup>

      <div v-else :class="ns.m('empty')">{{ emptyLabel }}</div>
    </template>
  </HomeCard>

  <slot name="teek-home-friend-link-after" />
</template>
