<script setup lang="ts" name="TeekLayoutProvider">
import type { TeekConfig } from "vitepress-theme-teek";
import Teek, { teekConfigContext, clockIcon } from "vitepress-theme-teek";
import { useData } from "vitepress";
import { watch, nextTick, ref, provide } from "vue";
import { teekDocConfig } from "../config/teekConfig";
import { useRibbon } from "../hooks/useRibbon";
import { useRuntime } from "../hooks/useRuntime";
import ConfigSwitch from "./ConfigSwitch.vue";
import ContributeChart from "./ContributeChart.vue";

const ns = "layout-provider";
const { frontmatter } = useData();

const teekConfig = ref(teekDocConfig);
provide(teekConfigContext, teekConfig);

// 彩带背景
const { start, stop } = useRibbon({ immediate: false, clickReRender: true });
// 页脚运行时间
const { start: startRuntime, stop: stopRuntime } = useRuntime("2021-10-19 00:00:00", {
  prefix: `<span style="width: 16px; display: inline-block; vertical-align: -3px; margin-right: 3px;">${clockIcon}</span>小破站已运行 `,
});

const watchRuntime = async (condition: boolean) => {
  await nextTick();
  if (condition) startRuntime();
  else stopRuntime();
};

const watchRibbon = async (condition: boolean) => {
  await nextTick();
  if (condition) start();
  else stop();
};

const watchRuntimeAndRibbon = (layout: string, style: string) => {
  // 博客类风格的首页显示运行时间
  watchRuntime(layout === "home" && style.startsWith("blog"));

  // 博客类风格的首页显示彩带 & 设置了 pageStyle 的文章页显示彩带
  watchRibbon(
    (layout === "home" && style.startsWith("blog") && style !== "blog-body") ||
      ([undefined, "doc"].includes(layout) && !!teekConfig.value.pageStyle)
  );
};

const currentStyle = ref("");

watch(frontmatter, async newVal => watchRuntimeAndRibbon(newVal.layout, currentStyle.value), { immediate: true });

const handleConfigSwitch = (config: TeekConfig, style: string) => {
  teekConfig.value = config;
  currentStyle.value = style;

  watchRuntimeAndRibbon(frontmatter.value.layout, currentStyle.value);
};
</script>

<template>
  <Teek.Layout>
    <template #teek-theme-enhance-bottom>
      <div :class="[ns, 'flx-align-center']">
        <ConfigSwitch @switch="handleConfigSwitch" />
      </div>
    </template>

    <template #nav-screen-content-after>
      <ConfigSwitch @switch="handleConfigSwitch" />
    </template>

    <template #teek-archives-top-before>
      <ContributeChart />
    </template>
  </Teek.Layout>
</template>

<style lang="scss">
.tk-my.is-circle-bg {
  margin-bottom: 20px;

  .tk-my__avatar.circle-rotate {
    margin-top: 200px;
  }
}
</style>
