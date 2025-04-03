<script setup lang="ts" name="DemoCode">
import { ref, computed, unref, defineAsyncComponent } from "vue";
import { useData } from "vitepress";
import { ElTooltip, ElMessage } from "element-plus";
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

// 预加载 Demo 组件，防止 Vitepress 打包时不包含 Demo 组件
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

  unref(copied) ? ElMessage.success("复制成功") : ElMessage.error("复制失败");
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

      <slot name="teek-demo-code-button-right" />
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
