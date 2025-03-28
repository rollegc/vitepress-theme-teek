<script setup lang="ts" name="DemoCode">
import { ref, computed, unref, defineAsyncComponent } from "vue";
import { useData } from "vitepress";
import { ElTooltip } from "element-plus";
import { DocumentCopy, ArrowDown, ArrowUp, EditPen, CaretTop } from "@element-plus/icons-vue";
import { useNamespace, useClipboard } from "../../../hooks";
import Icon from "../../Icon";
import TransitionCollapse from "../../TransitionCollapse";
import type { DemoCodeProps } from "./demoCode";
import type { Demo } from "../../../config/types";

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
  expandSourceButtonTip = "收起源代码",
}: Demo = { ...unref(theme).demo, ...unref(frontmatter).demo };

const sourceVisible = ref(false);

const DemoComponent = defineAsyncComponent(async () => {
  try {
    // / 表示从 .vitepress 目录层级开始
    return await import(/* @vite-ignore */ `/${props.path}`);
  } catch (error) {
    console.error(`[Teek Error] Failed to load component: '${props.relativePath}'`, error);
    return null;
  }
});

const handleToggleSourceVisible = (bol?: boolean) => {
  if (bol !== undefined) sourceVisible.value = bol;
  else sourceVisible.value = !sourceVisible.value;
};

const decodeSource = computed(() => decodeURIComponent(props.source));
const decodeRawSource = computed(() => decodeURIComponent(props.rawSource));

// 去 Playground 编辑
const handleEditPlayground = () => {
  const encoded = getPlaygroundEncoded(props.source);
  const darkParam = unref(isDark) ? "?theme=dark" : "";
  let link = playgroundUrl.includes("?")
    ? `${playgroundUrl}${darkParam.replace("?", "&")}`
    : `${playgroundUrl}${darkParam}`;

  const url = `${link.replace(/\/$/, "")}/#${encoded}`;
  window.open(url, "_blank");
};

// 去 Github 编辑
const handleEditGithub = () => {
  const url = `${githubUrl}/${props.path}.vue`;
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

// 复制源代码
const copyCode = async () => {
  if (!isSupported) console.error("浏览器不支持复制");

  copy(unref(decodeRawSource));

  // TODO：弹出提醒
  if (copied) console.log("复制成功");
  else console.error("复制失败");
};
</script>

<template>
  <div :class="ns.b()">
    <div :class="ns.e('effect')">
      <component :is="DemoComponent" />
    </div>

    <div :class="ns.e('button-group')">
      <ElTooltip
        v-if="playgroundUrl"
        :content="playgroundButtonTip"
        :show-arrow="false"
        :trigger="['hover', 'focus']"
        :trigger-keys="[]"
      >
        <Icon @click="handleEditPlayground">
          <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" width="1.2em" height="1.2em" data-v-5d9e4641="">
            <path
              fill="currentColor"
              d="M16 2v2h-1v3.243c0 1.158.251 2.301.736 3.352l4.282 9.276A1.5 1.5 0 0 1 18.656 22H5.344a1.5 1.5 0 0 1-1.362-2.129l4.282-9.276A7.994 7.994 0 0 0 9 7.243V4H8V2h8zm-2.612 8.001h-2.776c-.104.363-.23.721-.374 1.071l-.158.361L6.125 20h11.749l-3.954-8.567a9.978 9.978 0 0 1-.532-1.432zM11 7.243c0 .253-.01.506-.029.758h2.058a8.777 8.777 0 0 1-.021-.364L13 7.243V4h-2v3.243z"
            ></path>
          </svg>
        </Icon>
      </ElTooltip>
      <ElTooltip :content="githubButtonTip" :show-arrow="false" :trigger="['hover', 'focus']" :trigger-keys="[]">
        <Icon v-if="githubUrl" @click="handleEditGithub"><EditPen /></Icon>
      </ElTooltip>
      <ElTooltip :content="copyButtonTip" :show-arrow="false" :trigger="['hover', 'focus']" :trigger-keys="[]">
        <Icon><DocumentCopy @click="copyCode" /></Icon>
      </ElTooltip>
      <ElTooltip :content="sourceVisible ? expandSourceButtonTip : collapseSourceButtonTip">
        <Icon @click="handleToggleSourceVisible()">
          <ArrowUp v-if="sourceVisible" />
          <ArrowDown v-else />
        </Icon>
      </ElTooltip>
    </div>

    <TransitionCollapse>
      <div v-show="sourceVisible" :class="ns.joinNamespace('vp-code')" v-html="decodeSource" />
    </TransitionCollapse>

    <Transition :name="ns.joinNamespace('fade-linear')">
      <div v-show="sourceVisible" :class="ns.e('float-control')" @click="handleToggleSourceVisible(false)">
        <Icon>
          <CaretTop />
        </Icon>
        <span>隐藏源代码</span>
      </div>
    </Transition>
  </div>
</template>
