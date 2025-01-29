<script setup lang="ts" name="HomeBanner">
import { useDesign } from "../hooks";
import { useData } from "vitepress";
import { onMounted, onUnmounted, unref } from "vue";
import { useTypes } from "../hooks";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("banner");

const { site, frontmatter } = useData();

const title = unref(frontmatter).name || unref(site).title || "";
const descArray = [...new Set(unref(frontmatter).tk?.description?.filter((v: string) => !!v))];

const { text, shouldAnimate, startTypes, stopTypes } = useTypes(descArray, {
  typesInTime: unref(frontmatter).tk?.typesInTime,
  typesOutTime: unref(frontmatter).tk?.typesOutTime,
  typesNextTime: unref(frontmatter).tk?.typesNextTime,
});

onMounted(() => {
  startTypes();
});

onUnmounted(() => {
  stopTypes();
});
</script>

<template>
  <div :class="prefixClass">
    <h1 :class="`${prefixClass}-title`">
      {{ title }}
    </h1>
    <p v-if="descArray.length" :class="`${prefixClass}-desc`">
      <span>{{ text }}</span>
      <span :class="['typed', { 'is-animation': shouldAnimate }]">|</span>
    </p>
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/namespace.scss" as *;

$prefix-class: #{$theme-namespace}-banner;

.#{$prefix-class} {
  text-align: center;

  &-title {
    font-size: 3.2rem;
    font-weight: 600;
    line-height: 1.25;
  }

  &-desc {
    font-size: 1.4rem;
    max-width: 50rem;
    line-height: 1.3;
    opacity: 0.9;
    margin: 1.5rem auto;

    .typed {
      opacity: 1;

      &.is-animation {
        animation: typedBlink 1s infinite;
      }
    }
  }
}

@keyframes typedBlink {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>
