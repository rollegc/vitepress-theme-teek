<script setup lang="ts" name="HomeMyCard">
import { useNamespace } from "../hooks";
import { useUnrefData } from "../configProvider";
import Icon from "./Icon.vue";
import { Blogger, Social } from "../config/types";
import HomeCard from "./HomeCard.vue";

const ns = useNamespace("my");

const { theme } = useUnrefData();

const { blogger = {}, social = [] }: { blogger: Partial<Blogger>; social: Social[] } = theme;
</script>

<template>
  <HomeCard :class="ns.b()">
    <div :class="`${ns.e('avatar')} ${blogger.avatarStyle || 'radius'} flx-center`">
      <img :src="blogger.avatar" alt="头像" title="我好看吗" />
    </div>

    <div v-if="social.length" :class="`${ns.e('icons')} flx-justify-around`">
      <a v-for="(item, index) in social" :key="index" :href="item.link" :title="item.name" target="_blank">
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
</template>
