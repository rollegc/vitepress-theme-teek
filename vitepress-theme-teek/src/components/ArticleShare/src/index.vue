<script setup lang="ts" name="ArticleShare">
import { computed } from "vue";
import { useTeekConfig } from "../../../configProvider";
import { useClipboard, useNamespace } from "../../../hooks";
import Icon from "../../Icon";
import { shareIcon, thumbsIcon } from "../../../assets/icons";
import type { ArticleShare } from "../../../config";

defineOptions({ name: "ArticleShare" });

const ns = useNamespace("article-share");
const { getTeekConfigRef } = useTeekConfig();
const articleShareConfig = getTeekConfigRef<ArticleShare>("articleShare", {
  icon: shareIcon,
  text: "分享此页面",
  copiedIcon: thumbsIcon,
  copiedText: "链接已复制",
  query: false,
  hash: false,
});

const shareLink = computed(() => {
  const { hash, query } = articleShareConfig.value;
  const { origin, pathname, search } = location;

  return `${origin}${pathname}${query ? search : ""}${hash ? location.hash : ""}`;
});

const { copy, copied } = useClipboard(2000);
</script>

<template>
  <div :class="ns.b()">
    <button
      :class="[ns.e('button'), { copied }, 'flx-center']"
      :aria-label="copied ? articleShareConfig.copiedText : articleShareConfig.text"
      aria-live="polite"
      @click="copy(shareLink)"
    >
      <div v-if="!copied" class="flx-center">
        <Icon :icon="shareIcon" style="margin-right: 4px" />
        {{ articleShareConfig.text }}
      </div>

      <div v-else class="flx-center">
        <Icon :icon="thumbsIcon" style="margin-right: 4px" />
        {{ articleShareConfig.copiedText }}
      </div>
    </button>
  </div>
</template>
