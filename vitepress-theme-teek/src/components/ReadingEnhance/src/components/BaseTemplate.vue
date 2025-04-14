<script setup lang="ts" name="Template">
import { inject, ref } from "vue";
import { readingEnhanceNsSymbol } from "../readingEnhance";
import { useNamespace } from "../../../../hooks";
import Icon, { type TkIconProps } from "../../../Icon";
import Title from "./Title.vue";
import Helper from "./Helper.vue";
import HighlightBorder from "./HighlightBorder.vue";

interface TemplateProps {
  title?: string;
  desc?: string;
  icon?: TkIconProps["icon"];
  messageList?: { title?: string; content?: string; icon?: TkIconProps["icon"] }[];
  disabled?: boolean;
}

defineProps<TemplateProps>();

const ns = inject(readingEnhanceNsSymbol, useNamespace("reading-enhance"));

const helperVisible = ref(false);
const titleElementRef = ref<HTMLDivElement | null>(null);
</script>

<template>
  <div>
    <div ref="titleElementRef" class="flx-align-center">
      <Title :title :icon="icon" :disabled="disabled" />

      <Helper v-model="helperVisible" :virtual-ref="titleElementRef!">
        <div :class="ns.e('helper__body')">
          <h4 :class="ns.em('helper__body', 'title')">
            <slot name="title">{{ title }}</slot>
          </h4>
          <p :class="ns.em('helper__body', 'desc')">
            <slot name="desc">{{ desc }}</slot>
          </p>

          <div v-for="(message, index) in messageList" :key="index" :class="ns.e('helper__body__content')">
            <div>
              <Icon
                v-if="message.icon"
                :icon="message.icon"
                :size="16"
                style="margin-right: 4px; vertical-align: -2px"
              />
              <span v-if="message.title" style="font-weight: 600">{{ message.title }}</span>
            </div>
            <span v-if="message.content">{{ message.content }}</span>
          </div>
        </div>
      </Helper>
    </div>

    <HighlightBorder :active="helperVisible" style="margin-top: 8px">
      <slot />
    </HighlightBorder>
  </div>
</template>
