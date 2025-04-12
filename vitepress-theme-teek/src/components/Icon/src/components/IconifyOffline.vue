<script setup lang="ts" name="IconifyOffline">
import { Icon, addIcon, type IconifyIcon } from "@iconify/vue/dist/offline";
import { onMounted } from "vue";

defineOptions({ name: "IconifyOffline" });

const props = defineProps<{ icon: IconifyIcon }>();

onMounted(() => {
  addIcon(props.icon + "", props.icon as IconifyIcon);
});
</script>

<template>
  <Icon :icon :style="{ outline: 'none' }" />
</template>
