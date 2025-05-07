<script setup lang="ts" name="ItemInfo">
import type { FriendLink, FriendLinkItem } from "@teek/config";
import type { UseNamespaceReturn } from "@teek/hooks";
import { withBase } from "vitepress";
import { useTeekConfig } from "@teek/components/theme/ConfigProvider";
import { createImageViewer } from "@teek/components/common/ImageViewer";

defineProps<{ item: FriendLinkItem; ns: UseNamespaceReturn }>();

const { getTeekConfigRef } = useTeekConfig();

const friendLinkConfig = getTeekConfigRef<FriendLink>("friendLink", { imageViewer: {} });

const handleViewImg = (imgSrc: string | undefined, e: MouseEvent) => {
  // @click.stop 不起作用，因此手动阻止冒泡到 a 标签
  e.preventDefault();

  if (!imgSrc) return;

  createImageViewer({ ...friendLinkConfig.value.imageViewer, urlList: [imgSrc] });
};
</script>

<template>
  <a
    :href="item.link && withBase(item.link)"
    target="_blank"
    class="hover-color flx-align-center"
    :aria-label="item.name"
  >
    <img
      :src="item.avatar && withBase(item.avatar)"
      class="friend-avatar"
      :alt="item.name || item.alt"
      @click="handleViewImg(item.avatar, $event)"
      aria-hidden="true"
    />
    <div :class="ns.e('list__item__info')">
      <div class="friend-name sle">{{ item.name }}</div>
      <div class="friend-desc sle">{{ item.desc }}</div>
    </div>
  </a>
</template>
