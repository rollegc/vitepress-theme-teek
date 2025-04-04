<script setup lang="ts" name="HomeMyCard">
import { withBase } from "vitepress";
import { computed, unref } from "vue";
import { useTeekConfig } from "../../../configProvider";
import { useNamespace } from "../../../hooks";
import HomeCard from "../../HomeCard";
import Icon from "../../Icon";
import Avatar from "../../Avatar";
import type { Blogger, Social } from "../../../config/types";
import type { AvatarProps } from "../../Avatar/src/avatar";

defineOptions({ name: "HomeMyCard" });

const ns = useNamespace("my");

const { getTeekConfigRef } = useTeekConfig();

const blogger = getTeekConfigRef<Required<Blogger>>("blogger", { shape: "square" });
const social = getTeekConfigRef<Social[]>("social", []);

const shape = computed(() => unref(blogger).shape.replace("-rotate", "") as AvatarProps["shape"]);
</script>

<template>
  <slot name="teek-home-my-before" />

  <HomeCard :class="ns.b()">
    <div :class="`${ns.e('avatar')} ${blogger.shape} flx-center`">
      <Avatar
        v-if="blogger.avatar"
        :src="withBase(blogger.avatar)"
        :size="blogger.shape === 'square' ? '100%' : 100"
        :shape
        alt="头像"
        title="我好看吗"
      />
      <Avatar
        v-else-if="blogger.name"
        :size="100"
        :text="blogger.name"
        :text-size="50"
        :bg-color="ns.cssVar('theme-color')"
      />
    </div>

    <div v-if="social.length" :class="`${ns.e('icons')} flx-justify-around`">
      <a
        v-for="(item, index) in social"
        :key="index"
        :href="item.link && withBase(item.link)"
        :title="item.name"
        target="_blank"
      >
        <template v-if="item.icon">
          <Icon :iconType="item.iconType" :icon="item.icon" size="20px" hover :imgAlt="item.imgAlt" />
        </template>
      </a>
    </div>

    <div :class="ns.e('blogger')">
      <span class="name">{{ blogger.name }}</span>
      <span class="slogan">{{ blogger.slogan }}</span>
    </div>
  </HomeCard>

  <slot name="teek-home-my-after" />
</template>
