<script setup lang="ts" name="IconifyOffline">
import { Icon, addIcon, type IconifyIcon as IconifyIconInterface } from "@iconify/vue/dist/offline";
import { onMounted } from "vue";

defineOptions({ name: "IconifyOffline" });

const props = defineProps<{ icon: Object | string | IconifyIconInterface }>();

onMounted(() => {
  if (typeof props.icon === "object") addIcon(props.icon + "", props.icon as IconifyIconInterface);
});
</script>

<template>
  <Icon :icon="icon" :style="{ outline: 'none' }" />
</template>
