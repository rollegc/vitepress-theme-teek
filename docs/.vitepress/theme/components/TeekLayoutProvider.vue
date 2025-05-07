<script setup lang="ts" name="TeekLayoutProvider">
import Teek, { TkAvatar, teekConfigContext, useNamespace, clockIcon } from "vitepress-theme-teek";
import { provide, ref, watch, nextTick } from "vue";
import { teekDocConfig, teekBlogConfig } from "../config/teekConfig";
import { useRuntime } from "../hooks/useRuntime";
import { useData } from "vitepress";

const ns = useNamespace("layout-provider");
const { frontmatter } = useData();

// 默认文档风
const current = ref("D");

const teekConfig = ref(current.value === "D" ? teekDocConfig : teekBlogConfig);
provide(teekConfigContext, teekConfig);

const handleSwitch = () => {
  current.value = current.value === "D" ? "B" : "D";

  if (current.value === "D") teekConfig.value = teekDocConfig;
  else teekConfig.value = teekBlogConfig;
};

// 页脚运行时间
const { start, stop } = useRuntime("2021-10-19 00:00:00", {
  prefix: `<span style="width: 16px; display: inline-block; vertical-align: -3px; margin-right: 3px;">${clockIcon}</span>小破站已运行 `,
});

watch(
  [current, frontmatter],
  async ([newC, newF]) => {
    await nextTick();
    if (newC === "B" && newF.layout === "home") start();
    else stop();
  },
  { immediate: true }
);
</script>

<template>
  <Teek.Layout>
    <template #nav-bar-content-after>
      <div :class="ns.b('appearance')">
        <TkAvatar
          :size="24"
          :class="ns.be('appearance', 'switch')"
          :bg-color="ns.cssVar('theme-color')"
          @click="handleSwitch"
          title="切换文档风(D)/博客风(B)"
        >
          <span class="name">{{ current }}</span>
        </TkAvatar>
      </div>
    </template>
  </Teek.Layout>
</template>

<style lang="scss" scoped>
$namespace: tk-layout-provider;

.#{$namespace}-appearance {
  display: flex;

  &::before {
    margin-left: 16px;
    margin-right: 8px;
    width: 1px;
    height: 24px;
    background-color: var(--vp-c-divider);
    content: "";
  }

  &__switch {
    margin-left: 8px;
    margin-right: 8px;
    cursor: pointer;

    .name {
      user-select: none;
    }
  }

  // > span {
  //   width: var(--tk-avatar-size);
  //   height: var(--tk-avatar-size);
  //   border-radius: 50%;
  // }
}
</style>
