<script setup lang="ts" name="RouteLink">
import { useRouter } from "vitepress";

const router = useRouter();

interface RouteLinkProps {
  to?: string; // 跳转的路由地址
  target?: string; // a 标签带的跳转方式
}

const { to, target } = defineProps<RouteLinkProps>();

// 缓存上次 to，避免重复点击跳转
const handleGo = (e: MouseEvent) => {
  e.preventDefault();

  const { pathname, search, hash } = new URL(window.location.href);
  // 避免重复跳转
  const currentPath = `${decodeURIComponent(pathname)}${search}${decodeURIComponent(hash)}`;

  if (to !== undefined && to !== currentPath) {
    router.push(to);
  }
};
</script>

<template>
  <a v-if="target" :href="to" :target>
    <slot />
  </a>
  <a v-else :href="to" @click="handleGo">
    <slot />
  </a>
</template>
