<script setup lang="ts" name="DocAfterAppreciationPopper">
import type { Appreciation } from "@teek/config";
import { computed, ref } from "vue";
import { useNamespace, useLocale } from "@teek/hooks";
import { aliPayIcon, weChatPayIcon } from "@teek/static";
import { useTeekConfig } from "@teek/components/theme/ConfigProvider";
import { TkIcon } from "@teek/components/common/Icon";
import { TkPopover } from "@teek/components/common/Popover";

defineOptions({ name: "DocAfterAppreciationPopper" });

const ns = useNamespace("article-appreciation");
const { t } = useLocale();

const { getTeekConfigRef } = useTeekConfig();
const appreciateConfig = getTeekConfigRef<Required<Appreciation<"doc-after-popper">>>("appreciation", { position: "" });

const showContent = ref(false);
const docAfterOptions = computed(() => ({ trigger: "click", ...appreciateConfig.value.options }));

const icon = computed(() => {
  const { icon } = docAfterOptions.value;
  if (icon === "aliPay") return aliPayIcon;
  if (icon === "weChatPay") return weChatPayIcon;

  return icon;
});
</script>

<template>
  <div :class="ns.b()" :aria-label="t('tk.articleAppreciation.label')">
    <TkPopover v-model="showContent" :trigger="docAfterOptions.trigger">
      <template #reference>
        <div
          v-if="docAfterOptions.buttonHtml"
          v-html="docAfterOptions.buttonHtml"
          role="button"
          :aria-expanded="showContent"
          :aria-controls="`${ns.e('content')}`"
        />
        <button
          v-else-if="docAfterOptions.title"
          :class="ns.e('button')"
          @click="toggleShowContent"
          :aria-expanded="showContent"
          :aria-controls="`${ns.e('content')}`"
          aria-live="polite"
        >
          <TkIcon v-if="icon" :class="ns.e('button__icon')" :icon="icon" :size="16" aria-hidden="true" />

          <span v-if="docAfterOptions.title" v-html="docAfterOptions.title" />
        </button>
      </template>

      <div :class="[ns.e('content'), ns.m('doc-after-popper')]" :aria-label="t('tk.articleAppreciation.contentLabel')">
        <div :class="ns.e('content')" v-html="docAfterOptions.content" />
      </div>
    </TkPopover>
  </div>
</template>
