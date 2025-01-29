<script setup lang="ts" name="RouteLink">
import { useRouter } from "vitepress";

const router = useRouter();

interface RouteLinkProps {
  to?: string;
  target?: string;
}

const { to, target } = defineProps<RouteLinkProps>();

const handleGo = e => {
  // 如果传了 target，则走默认 a 标签的逻辑
  if (target) return;

  e.preventDefault();
  to !== undefined && router.push(to);
};
</script>

<template>
  <a :href="to" @click="handleGo" :target>
    <slot />
  </a>
</template>
