<script setup lang="ts" name="DocAfterAppreciation">
import { computed, ref, unref, watch } from "vue";
import { useTeekConfig } from "../../../configProvider";
import { useNamespace } from "../../../hooks";
import type { Appreciation } from "../../../config/types";
import Icon from "../../Icon";
import { aliPayIcon, weChatPayIcon } from "../../../assets/icons";

defineOptions({ name: "DocAfterAppreciation" });

const ns = useNamespace("article-appreciation");

const { getTeekConfigRef } = useTeekConfig();

const appreciateConfig = getTeekConfigRef<Required<Appreciation<"doc-after">>>("appreciation", { position: "" });

const docAfterOptions = computed(() => unref(appreciateConfig).options || { expand: false });

const showContent = ref(unref(docAfterOptions).expand);

const icon = computed(() => {
  const { icon } = unref(docAfterOptions);
  if (icon === "aliPay") return aliPayIcon;
  if (icon === "weChatPay") return weChatPayIcon;

  return icon;
});

const toggleShowContent = () => {
  showContent.value = !showContent.value;
};

watch(
  () => unref(docAfterOptions).expand,
  (newValue: boolean | undefined) => {
    showContent.value = newValue;
  }
);
</script>

<template>
  <div :class="[ns.b(), ns.m('doc-after')]">
    <div v-if="docAfterOptions.buttonHtml" v-html="docAfterOptions.buttonHtml" />
    <button
      v-else-if="docAfterOptions.expandTitle || docAfterOptions.collapseTitle"
      :class="ns.e('button')"
      @click="toggleShowContent"
    >
      <Icon v-if="icon" :class="ns.e('button__icon')" :icon="icon" :size="16" />

      <span v-if="showContent" v-html="docAfterOptions.collapseTitle" />
      <span v-else v-html="docAfterOptions.expandTitle" />
    </button>

    <transition :name="ns.joinNamespace('fade')">
      <div v-if="showContent" :class="ns.e('content')">
        <div :class="ns.e('content')" v-html="docAfterOptions.content" />
      </div>
    </transition>
  </div>
</template>
