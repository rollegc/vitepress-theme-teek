<script setup lang="ts" name="DemoCode">
import { ref, computed, unref, defineAsyncComponent } from "vue";
import { useData } from "vitepress";
import Message from "../../Message";
import { useNamespace, useClipboard } from "../../../hooks";
import Icon from "../../Icon";
import TransitionCollapse from "../../TransitionCollapse";
import type { DemoCodeProps } from "./demoCode";
import { playgroundIcon, githubIcon, copyIcon, codeIcon, caretTopIcon } from "../../../assets/icons";

defineOptions({ name: "DemoCode" });

const props = defineProps<DemoCodeProps>();

const ns = useNamespace("demo-code");
const { copy, copied, isSupported } = useClipboard();
const { frontmatter, isDark } = useData();

const {
  playgroundUrl = "",
  playgroundMainFileName = "App.vue",
  githubUrl = "",
  playgroundButtonTip = "在 Playground 中编辑",
  githubButtonTip = "在 Github 中编辑",
  copyButtonTip = "复制代码",
  collapseSourceButtonTip = "查看源代码",
  expandSourceButtonTip = "隐藏源代码",
} = { ...JSON.parse(decodeURIComponent(props.demo)), ...unref(frontmatter).demo };

const decodeSource = computed(() => decodeURIComponent(props.source));
const decodeRawSource = computed(() => decodeURIComponent(props.rawSource));
const decodedDescription = computed(() => decodeURIComponent(props.description));

// 预加载 Demo 组件，防止 VitePress 打包时不包含 Demo 组件
const moduleFiles = (import.meta as any).glob("/examples/**/*.vue", { eager: true });

const DemoComponent = defineAsyncComponent(async () => {
  try {
    const key = Object.keys(moduleFiles).find(i => i.endsWith(`/${props.path}`)) as string;
    return moduleFiles[key];
  } catch (error) {
    console.error(`[Teek Error] Failed to load component: '/${props.path}'`, error);
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
  const link = playgroundUrl.includes("?")
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
  const url = `${githubUrl}/${props.path}`;
  window.open(url, "_blank");
};

/**
 * 复制源代码
 */
const copyCode = async () => {
  if (!isSupported) console.error("浏览器不支持复制");

  await copy(unref(decodeRawSource));

  unref(copied)
    ? Message.success({
        message: "复制成功",
        plain: true,
      })
    : Message.error({
        message: "复制失败",
        plain: true,
      });
};
</script>

<template>
  <div :class="ns.b('description')" v-html="decodedDescription" />

  <div :class="ns.b()">
    <div :class="ns.e('effect')">
      <component :is="DemoComponent" />
    </div>

    <div :class="ns.e('button-group')">
      <slot name="teek-demo-code-button-left" />

      <Icon
        v-if="playgroundUrl"
        :title="playgroundButtonTip"
        @click="handleEditPlayground"
        :icon="playgroundIcon"
        role="link"
        :aria-label="playgroundButtonTip"
      />
      <Icon
        v-if="githubUrl"
        :title="githubButtonTip"
        @click="handleEditGithub"
        :icon="githubIcon"
        role="link"
        :aria-label="githubUrl"
      />
      <Icon :title="copyButtonTip" :icon="copyIcon" @click="copyCode" role="button" :aria-label="copyButtonTip" />
      <Icon
        :title="sourceVisible ? expandSourceButtonTip : collapseSourceButtonTip"
        @click="handleToggleSourceVisible()"
        :icon="codeIcon"
        role="button"
        :aria-label="sourceVisible ? expandSourceButtonTip : collapseSourceButtonTip"
      />

      <slot name="teek-demo-code-button-right" />
    </div>

    <TransitionCollapse>
      <div v-show="sourceVisible" :class="ns.joinNamespace('vp-code')" v-html="decodeSource" />
    </TransitionCollapse>

    <Transition :name="ns.joinNamespace('fade-linear')">
      <div
        v-show="sourceVisible"
        :class="ns.e('float-control')"
        @click="handleToggleSourceVisible(false)"
        role="button"
      >
        <Icon :icon="caretTopIcon" />
        <span>{{ expandSourceButtonTip }}</span>
      </div>
    </Transition>
  </div>
</template>
