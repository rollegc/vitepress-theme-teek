<script setup lang="ts" name="RiskLink">
import { onMounted, ref } from "vue";
import { useData } from "vitepress";
import { useNamespace, useLocale } from "@teek/hooks";
import { isValidURL } from "@teek/helper";

defineOptions({ name: "RiskLink" });

const ns = useNamespace("risk-link");
const { t } = useLocale();
const { frontmatter } = useData();

const targetLink = ref("");

onMounted(() => {
  const { searchParams } = new URL(window.location.href);
  const target = searchParams.get("target");

  if (target && isValidURL(target)) {
    targetLink.value = target;
  }
});

const confirmRedirect = () => {
  window.location.href = targetLink.value;
};
</script>

<template>
  <div :class="[ns.b(), ns.joinNamespace('center'), 'flx-space-y-20']">
    <div :class="[ns.e('header'), 'flx-align-center']">
      <img v-if="frontmatter.logo" :src="frontmatter.logo" alt="logo" />
      <p v-if="targetLink" :class="ns.e('title')">
        {{
          frontmatter.desc
            ? frontmatter.desc
            : t("tk.riskLink.title", { name: frontmatter.name || "VitePress Theme Teek" })
        }}
      </p>
      <p v-else :class="ns.e('title')">
        {{ frontmatter.linkNullTip ? frontmatter.linkNullTip : t("tk.riskLink.linkNoNull") }}
      </p>
    </div>

    <p v-if="targetLink" :class="[ns.e('link'), 'sle']">{{ targetLink }}</p>
    <div v-if="targetLink">
      <button class="btn" @click="confirmRedirect">{{ t("tk.riskLink.confirmButtonText") }}</button>
    </div>
  </div>
</template>
