<script setup lang="ts" name="TeekLayoutProvider">
import Teek, { teekConfigContext, clockIcon } from "vitepress-theme-teek";
import { useData } from "vitepress";
import { watch, nextTick, useTemplateRef, ref, provide } from "vue";
import { teekDocConfig } from "../config/teekConfig";
import { useRuntime } from "../hooks/useRuntime";
import ConfigSwitch from "./ConfigSwitch.vue";

const ns = "layout-provider";
const { frontmatter } = useData();

const teekConfig = ref(teekDocConfig);
provide(teekConfigContext, teekConfig);

const configSwitchRef = useTemplateRef("configSwitchRef");

// 页脚运行时间
const { start, stop } = useRuntime("2021-10-19 00:00:00", {
  prefix: `<span style="width: 16px; display: inline-block; vertical-align: -3px; margin-right: 3px;">${clockIcon}</span>小破站已运行 `,
});

const watchRuntime = async (condition: boolean) => {
  await nextTick();
  if (condition) start();
  else stop();
};

watch(frontmatter, async newVal => watchRuntime(newVal.layout === "home"), { immediate: true });

watch(
  () => configSwitchRef.value?.themeStyle,
  async newVal => watchRuntime(newVal === "blog"),
  { immediate: true }
);

watch(
  () => configSwitchRef.value?.teekConfig,
  async newVal => {
    if (newVal) teekConfig.value = newVal;
  }
);
</script>

<template>
  <Teek.Layout>
    <template #teek-theme-enhance-bottom>
      <div :class="[ns, 'flx-align-center']">
        <ConfigSwitch ref="configSwitchRef" />
      </div>
    </template>
  </Teek.Layout>
</template>

<style lang="scss">
.tk-my.is-circle-bg {
  .tk-my__avatar.circle-rotate {
    margin-top: 200px;
  }
}
</style>
