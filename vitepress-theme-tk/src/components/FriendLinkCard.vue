<script setup lang="ts" name="FriendLinkCard">
import { computed, ref, unref, onMounted } from "vue";
import { useUnrefData } from "../configProvider";
import { useDesign, useSwiper } from "../hooks";
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
  autoScroll = true,
  scrollIntervalTime = 2500,
} = { ...theme.friendLink, ...frontmatter.tk };

const { visibleData, startScroll, stopScroll } = useSwiper(list, 5, scrollIntervalTime);

const pageNum = ref(1);
const currentFriendLinkList = computed(() => {
  if (autoScroll) return unref(visibleData);

  const p = unref(pageNum);
  return list.slice((p - 1) * limit, p * limit);
});

onMounted(() => {
  if (autoScroll) startScroll();
});

const transitionName = ref("scroll");

const pagination = (_: number, type: "prev" | "next") => {
  transitionName.value = `slide-${type}`;
};
</script>

<template>
  <HomeCard
    :page="!autoScroll"
    v-model="pageNum"
    :pageSize="limit"
    :total="list?.length"
    :title
    :class="prefixClass"
    @pagination="pagination"
  >
    <TransitionGroup
      :name="transitionName"
      tag="ul"
      mode="out-in"
      v-if="list?.length"
      :class="`${prefixClass}-list flx-column`"
      @mouseenter="stopScroll"
      @mouseleave="startScroll"
    >
      <li v-for="item in currentFriendLinkList" :key="item.name" :class="`${prefixClass}-list__item`">
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
  </HomeCard>
</template>

<style lang="scss" scoped>
@use "../styles/components/friendLinkCard.scss";
</style>
