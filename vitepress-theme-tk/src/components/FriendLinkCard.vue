<script setup lang="ts" name="FriendLinkCard">
import { computed, ref, unref, onMounted } from "vue";
import { useUnrefData } from "../configProvider";
import { useDesign, useScrollData } from "../hooks";
import HomeCard from "./HomeCard.vue";
import friendLinkSvg from "../assets/svg/friendLink";
import { watch } from "vue";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("friendLink");

const { theme, frontmatter } = useUnrefData();
const {
  list = [],
  limit = 4,
  title = `${friendLinkSvg}友情链接`,
  autoScroll = false,
  scrollTimeOut = 2500,
  autoPage = false,
  pageTimeOut = 4000,
} = { ...theme.friendLink, ...frontmatter.tk?.friendLink };

const { visibleData, startAutoScroll, stopAutoScroll } = useScrollData(list, 5, scrollTimeOut);

const pageNum = ref(1);
const currentFriendLinkList = computed(() => {
  if (autoScroll) return unref(visibleData);

  const p = unref(pageNum);
  return list.slice((p - 1) * limit, p * limit);
});

onMounted(() => {
  if (autoScroll) startAutoScroll();
});

const itemRefs = ref<HTMLLIElement[]>([]);

const setItemRefs = (el: HTMLLIElement) => {
  // 非自动滚动时才记录 dom 元素，否则自动滚动部分动画失效，割裂严重
  if (!autoScroll) unref(itemRefs).push(el);
};

const getLiStyle = (index: number) => {
  if (autoScroll) return {};
  const clientRect = unref(itemRefs)?.[index]?.getBoundingClientRect();
  // 分页动画需要指定 top，否则默认移动到 0px 位置
  return {
    top: `calc(${index} * (calc(var(--tk-friend-gap) + ${clientRect?.height || 0}px)))`,
  };
};
</script>

<template>
  <HomeCard
    :page="!autoScroll"
    v-model="pageNum"
    :pageSize="limit"
    :total="list.length"
    :title
    :autoPage
    :pageTimeOut
    :class="prefixClass"
  >
    <template #default="{ transitionName, startAutoPage, closeAutoPage }">
      <TransitionGroup
        v-if="list?.length"
        :name="transitionName"
        tag="ul"
        mode="out-in"
        :class="`${prefixClass}-list flx-column`"
        @mouseenter="autoScroll ? stopAutoScroll() : autoPage ? closeAutoPage() : () => {}"
        @mouseleave="autoScroll ? startAutoScroll() : autoPage ? startAutoPage() : () => {}"
      >
        <li
          :ref="setItemRefs"
          v-for="(item, index) in currentFriendLinkList"
          :key="item.name"
          :class="`${prefixClass}-list__item`"
          :style="getLiStyle(index)"
        >
          <a :href="item.link" class="flx-align-center">
            <img :src="item.avatar" class="friend-avatar" />
            <div :class="`${prefixClass}-list__item-info`">
              <div class="friend-name sle">{{ item.name }}</div>
              <div class="friend-desc sle">{{ item.desc }}</div>
            </div>
          </a>
        </li>
      </TransitionGroup>

      <div v-else :class="`${prefixClass}-empty`">暂无友链</div>
    </template>
  </HomeCard>
</template>

<style lang="scss" scoped>
@use "../styles/components/friendLinkCard.scss";
</style>
