<script setup lang="ts" name="HomeMyCard">
import { withBase, useData } from "vitepress";
import { useNamespace } from "../../../hooks";
import HomeCard from "../../HomeCard";
import Icon from "../../Icon";
import type { Blogger, Social } from "../../../config/types";
import { computed, unref } from "vue";

defineOptions({ name: "HomeMyCard" });

const ns = useNamespace("my");

const { theme, frontmatter } = useData();

const blogger = computed<Blogger>(() => ({ ...unref(theme).blogger, ...unref(frontmatter).tk?.blogger }));
const social = computed<Social[]>(() => [...(unref(theme).social || []), ...(unref(frontmatter).tk?.social || [])]);
</script>

<template>
  <slot name="teek-home-my-before" />

  <HomeCard :class="ns.b()">
    <div :class="`${ns.e('avatar')} ${blogger.avatarStyle || 'full'} flx-center`">
      <img :src="blogger.avatar && withBase(blogger.avatar)" alt="头像" title="我好看吗" />
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
