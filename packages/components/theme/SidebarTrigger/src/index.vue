<script setup lang="ts" name="SidebarTrigger">
import { ref } from "vue";
import { useNamespace } from "@teek/composables";
import { autoWidthIcon } from "@teek/static";
import { TkIcon } from "@teek/components/common/Icon";

const ns = useNamespace("sidebar-trigger");

const active = ref(false);

const toggleSideBar = () => {
  const layoutDom = document.querySelector(`.${ns.join("layout")}`);
  layoutDom && layoutDom.classList.toggle(ns.is("sidebar-collapse"));

  // 激活添加样式（目的是添加 transition-duration）
  if (!active.value) {
    active.value = true;
    setTimeout(() => {
      active.value = false;
    }, 300);
  }
};
</script>

<template>
  <slot :active :icon="autoWidthIcon" :toggleSideBar>
    <div :class="[ns.b(), ns.is('active', active)]" @click="toggleSideBar">
      <div :class="[ns.join('right-bottom-button__button')]">
        <TkIcon :icon="autoWidthIcon" />
      </div>
    </div>
  </slot>
</template>
