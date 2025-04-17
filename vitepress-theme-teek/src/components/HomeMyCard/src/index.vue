<script setup lang="ts" name="HomeMyCard">
import type { Blogger, Social } from "@teek/config/types";
import type { TkAvatarProps } from "@teek/components/Avatar";
import { withBase } from "vitepress";
import { computed, unref } from "vue";
import { useTeekConfig } from "@teek/configProvider";
import { useNamespace, useLocale } from "@teek/hooks";
import HomeCard from "@teek/components/HomeCard";
import Avatar from "@teek/components/Avatar";
import Icon from "@teek/components/Icon";

defineOptions({ name: "HomeMyCard" });

const ns = useNamespace("my");
const { t } = useLocale();

const { getTeekConfigRef } = useTeekConfig();

const blogger = getTeekConfigRef<Required<Blogger>>("blogger", { shape: "square" });
const social = getTeekConfigRef<Social[]>("social", []);

const shape = computed(() => unref(blogger).shape.replace("-rotate", "") as TkAvatarProps["shape"]);
</script>

<template>
  <slot name="teek-home-my-before" />

  <HomeCard :class="ns.b()" :aria-label="t('tk.myCard.label')">
    <div :class="`${ns.e('avatar')} ${blogger.shape} flx-center`">
      <Avatar
        v-if="blogger.avatar"
        :src="withBase(blogger.avatar)"
        :size="blogger.shape === 'square' ? '100%' : 100"
        :shape
        bg-color="transparent"
        :alt="t('tk.myCard.avatarAlt')"
        :title="t('tk.myCard.avatarTitle')"
        aria-hidden="true"
      />
      <Avatar
        v-else-if="blogger.name"
        :size="100"
        :text="blogger.name"
        :text-size="50"
        :bg-color="ns.cssVar('theme-color')"
        aria-hidden="true"
      />
    </div>

    <div v-if="social.length" :class="`${ns.e('icons')} flx-justify-around`" :aria-label="t('tk.myCard.socialLabel')">
      <a
        v-for="(item, index) in social"
        :key="index"
        :href="item.link && withBase(item.link)"
        :title="item.name"
        target="_blank"
        :aria-label="item.name"
      >
        <template v-if="item.icon">
          <Icon
            :iconType="item.iconType"
            :icon="item.icon"
            size="20px"
            hover
            :imgAlt="item.imgAlt"
            aria-hidden="true"
          />
        </template>
      </a>
    </div>

    <div :class="ns.e('blogger')" :aria-label="t('tk.myCard.bloggerLabel')">
      <span class="name">{{ blogger.name }}</span>
      <span class="slogan">{{ blogger.slogan }}</span>
    </div>
  </HomeCard>

  <slot name="teek-home-my-after" />
</template>
