<script setup lang="ts" name="DemoCode">
import { ref, computed, unref, defineAsyncComponent } from "vue";
import { useData } from "vitepress";
import { ElTooltip } from "element-plus";
import { useNamespace, useClipboard } from "../../../hooks";
import Icon from "../../Icon";
import TransitionCollapse from "../../TransitionCollapse";
import type { DemoCodeProps } from "./demoCode";
import type { Demo } from "../../../config/types";
import { playgroundIcon, githubIcon, copyIcon, codeIcon, caretTopIcon } from "../../../assets/icons";

defineOptions({ name: "DemoCode" });

const props = defineProps<DemoCodeProps>();

const ns = useNamespace("demoCode");
const { copy, copied, isSupported } = useClipboard();
const { theme, frontmatter, isDark } = useData();

const {
  playgroundUrl = "",
  playgroundMainFileName = "App.vue",
  githubUrl = "",
  playgroundButtonTip = "在 Playground 中编辑",
  githubButtonTip = "在 Github 中编辑",
  copyButtonTip = "复制代码",
  collapseSourceButtonTip = "查看源代码",
  expandSourceButtonTip = "隐藏源代码",
}: Demo = { ...unref(theme).demo, ...unref(frontmatter).demo };

const decodeSource = computed(() => decodeURIComponent(props.source));
const decodeRawSource = computed(() => decodeURIComponent(props.rawSource));
const decodedDescription = computed(() => decodeURIComponent(props.description));

const DemoComponent = defineAsyncComponent(async () => {
  try {
    // / 表示从 .vitepress 目录层级开始
    return await import(/* @vite-ignore */ `/${props.path}`);
  } catch (error) {
    console.error(`[Teek Error] Failed to load component: '${props.source}'`, error);
    return null;
  }
});

const sourceVisible = ref(false);

/**
 * 切换源代码显示状态
 */
const handleToggleSourceVisible = (bol?: boolean) => {
  if (bol !== undefined) sourceVisible.value = bol;
  else sourceVisible.value = !sourceVisible.value;
};

/**
 * 去 Playground 编辑
 */
const handleEditPlayground = () => {
  const encoded = getPlaygroundEncoded(props.source);
  const darkParam = unref(isDark) ? "?theme=dark" : "";
  let link = playgroundUrl.includes("?")
    ? `${playgroundUrl}${darkParam.replace("?", "&")}`
    : `${playgroundUrl}${darkParam}`;

  const url = `${link.replace(/\/$/, "")}/#${encoded}`;
  window.open(url, "_blank");
};

const getPlaygroundEncoded = (source: string) => {
  const code = decodeURIComponent(source);
  const originCode = {
    [playgroundMainFileName]: code,
  };
  const encoded = btoa(JSON.stringify(originCode));
  return encoded;
};

/**
 * 去 Github 编辑
 */
const handleEditGithub = () => {
  const url = `${githubUrl}/${props.path}.vue`;
  window.open(url, "_blank");
};

/**
 * 复制源代码
 */
const copyCode = async () => {
  if (!isSupported) console.error("浏览器不支持复制");

  copy(unref(decodeRawSource));

  // TODO：弹出提醒
  console.log(copied ? "复制成功" : "复制失败");
};
</script>

<template>
  <div :class="ns.b('description')" v-html="decodedDescription" />

  <div :class="ns.b()">
    <div :class="ns.e('effect')">
      <component :is="DemoComponent" />
    </div>

    <div :class="ns.e('button-group')">
      <slot name="teek-demo-code-button-before" />

      <ElTooltip
        v-if="playgroundUrl"
        :content="playgroundButtonTip"
        :show-arrow="false"
        :trigger="['hover', 'focus']"
        :trigger-keys="[]"
      >
        <Icon @click="handleEditPlayground" :icon="playgroundIcon"></Icon>
      </ElTooltip>
      <ElTooltip
        v-if="githubUrl"
        :content="githubButtonTip"
        :show-arrow="false"
        :trigger="['hover', 'focus']"
        :trigger-keys="[]"
      >
        <Icon @click="handleEditGithub" :icon="githubIcon" />
      </ElTooltip>
      <ElTooltip :content="copyButtonTip" :show-arrow="false" :trigger="['hover', 'focus']" :trigger-keys="[]">
        <Icon :icon="copyIcon" @click="copyCode" />
      </ElTooltip>
      <ElTooltip :content="sourceVisible ? expandSourceButtonTip : collapseSourceButtonTip">
        <Icon @click="handleToggleSourceVisible()" :icon="codeIcon" />
      </ElTooltip>

      <slot name="teek-demo-code-button-after" />
    </div>

    <TransitionCollapse>
      <div v-show="sourceVisible" :class="ns.joinNamespace('vp-code')" v-html="decodeSource" />
    </TransitionCollapse>

    <Transition :name="ns.joinNamespace('fade-linear')">
      <div v-show="sourceVisible" :class="ns.e('float-control')" @click="handleToggleSourceVisible(false)">
        <Icon :icon="caretTopIcon" />
        <span>{{ expandSourceButtonTip }}</span>
      </div>
    </Transition>
  </div>
</template>
