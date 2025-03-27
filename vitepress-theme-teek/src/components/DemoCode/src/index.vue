<script setup lang="ts" name="DemoCode">
import { ref, computed, unref } from "vue";
import { DocumentCopy, ArrowDown, ArrowUp, EditPen, CaretTop } from "@element-plus/icons-vue";
import { useNamespace } from "../../../hooks";
import Icon from "../../Icon";
import TransitionCollapse from "../../TransitionCollapse";
import type { DemoCodeProps } from "./demoCode";
import { useData } from "vitepress";

defineOptions({ name: "DemoCode" });

const props = defineProps<DemoCodeProps>();

const ns = useNamespace("demoCode");
const { theme, frontmatter, isDark } = useData();

const {
  playgroundUrl,
  playgroundMainFileName = "App.vue",
  githubUrl,
} = { ...unref(theme).demo, ...unref(frontmatter).demo };

const sourceVisible = ref(false);
const total = ref(0);
const size = 18;

// 自动加载件夹下所有的 Demo 异步组件
// const moduleFiles = (import.meta as any).glob(`${props.relativePath}/*.vue`, {
//   eager: true,
// });
const moduleFiles: any[] = [];

const getComponent = (moduleFiles: Record<string, any>, path: string) => {
  const key = Object.keys(moduleFiles).find(i => i.endsWith(`/examples/${path}.vue`)) as string;
  return moduleFiles[key]?.default;
};

const DemoComponent = getComponent(moduleFiles, props.path);

const handleToggleSourceVisible = (bol?: boolean) => {
  if (bol !== undefined) sourceVisible.value = bol;
  else sourceVisible.value = !sourceVisible.value;
};

const content = computed(() => decodeURIComponent(props.source));

// 添加行号
const tem = content.value.split("\r\n");
total.value = tem.length;

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
</script>

<template>
  <div :class="ns.b()">
    <div :class="ns.e('effect')">
      <DemoComponent />
    </div>

    <div :class="ns.e('button-group')">
      <el-tooltip content="在 Playground 中编辑">
        <Icon :size="size" @click="handleEditPlayground">
          <svg preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" width="1.2em" height="1.2em" data-v-5d9e4641="">
            <path
              d="M16 2v2h-1v3.243c0 1.158.251 2.301.736 3.352l4.282 9.276A1.5 1.5 0 0 1 18.656 22H5.344a1.5 1.5 0 0 1-1.362-2.129l4.282-9.276A7.994 7.994 0 0 0 9 7.243V4H8V2h8zm-2.612 8.001h-2.776c-.104.363-.23.721-.374 1.071l-.158.361L6.125 20h11.749l-3.954-8.567a9.978 9.978 0 0 1-.532-1.432zM11 7.243c0 .253-.01.506-.029.758h2.058a8.777 8.777 0 0 1-.021-.364L13 7.243V4h-2v3.243z"
            ></path>
          </svg>
        </Icon>
      </el-tooltip>
      <el-tooltip content="在 GitHub 中编辑">
        <Icon :size="size" @click="handleEditGithub"><EditPen /></Icon>
      </el-tooltip>
      <el-tooltip content="复制代码">
        <Icon :size="size"><DocumentCopy v-copy="content" /></Icon>
      </el-tooltip>
      <el-tooltip :content="sourceVisible ? '收起源代码' : '查看源代码'">
        <Icon :size="size" @click="handleToggleSourceVisible">
          <ArrowUp v-if="sourceVisible" />
          <ArrowDown v-else />
        </Icon>
      </el-tooltip>
    </div>

    <TransitionCollapse>
      <div v-show="sourceVisible" :class="`${ns.e('language-vue')} language-vue`">
        <div :class="ns.e('language-vue__code')">
          <div v-html="decoded"></div>
        </div>
        <div :class="ns.e('line-numbers-wrapper')">
          <template v-for="item in total" :key="item">
            <span class="line-number">
              {{ item }}
            </span>
            <br />
          </template>
        </div>
      </div>
    </TransitionCollapse>

    <Transition :name="ns.joinNamespace('fade-linear')">
      <div v-show="sourceVisible" :class="ns.e('float-control')" @click="handleToggleSourceVisible(false)">
        <ElIcon :size="size">
          <CaretTop />
        </ElIcon>
        <span>隐藏源代码</span>
      </div>
    </Transition>
  </div>
</template>
