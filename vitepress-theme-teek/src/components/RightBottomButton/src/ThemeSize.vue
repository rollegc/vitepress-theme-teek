<script setup lang="ts" name="ThemeSize">
import { computed, unref, ref, inject, watch } from "vue";
import { useData } from "vitepress";
import { useNamespace } from "../../../hooks";
import Icon from "../../Icon";
import { sizeIcon } from "../../../assets/icons";
import type { ThemeSetting } from "../../../config/types";
import { rightBottomButtonNsSymbol } from "./rightBottomButton";

defineOptions({ name: "ThemeSize" });

const ns = inject(rightBottomButtonNsSymbol, useNamespace("right-bottom-button"));

const { theme, frontmatter } = useData();
const themeSettingConfig = computed<Required<ThemeSetting>>(() => ({
  themeSize: "default",
  themeSizeAppend: [],
  themeSizeLabel: {},
  titleTip: {},
  ...unref(theme).themeSetting,
}));

const showThemeSizeItem = ref(false);
const currentThemeSize = ref(unref(themeSettingConfig).themeSize);
const themeSizeList = computed(() => {
  const { themeSizeLabel, themeSizeAppend } = unref(themeSettingConfig);
  return [
    { name: themeSizeLabel.wide ?? "Wide", size: "wide" },
    { name: themeSizeLabel.large ?? "Large", size: "large" },
    { name: themeSizeLabel.default ?? "Default", size: "default" },
    { name: themeSizeLabel.small ?? "Small", size: "small" },
    ...themeSizeAppend,
  ];
});

watch(
  () => unref(themeSettingConfig).themeSize,
  (themeSize: string) => (currentThemeSize.value = themeSize)
);

const themeSizeStorageKey = ns.b("themeSize");
/**
 * 修改主题尺寸
 */
const changeTheme = (attribute: "theme-size", value: string, isDoc = false) => {
  // 当 value 是从 localstorage 取，可能是 "undefined" 字符串
  if ([document.documentElement.getAttribute(attribute), undefined, "undefined"].includes(value)) return;

  currentThemeSize.value = value;
  document.documentElement.setAttribute(attribute, value);

  // 只存储全局配置到本地
  if (!isDoc) localStorage.setItem(themeSizeStorageKey, value);
};

/**
 * 修改文章页的主题尺寸，仅当 frontmatter.themeSize 存在时生效
 */
const changeDocTheme = (attribute: "theme-size", value: string) => {
  const { themeSize } = unref(themeSettingConfig);
  if (value) changeTheme(attribute, value, true);
  else {
    // 初始化/还原主题尺寸
    changeTheme(attribute, localStorage.getItem(themeSizeStorageKey) || themeSize);
  }
};

// 文章页主题尺寸设置
watch(
  () => unref(frontmatter).themeSize,
  (docThemeSize: string) => changeDocTheme("theme-size", docThemeSize),
  { immediate: true }
);
</script>

<template>
  <div
    :title="themeSettingConfig.titleTip.themeSize ?? '主题尺寸切换'"
    :class="`${ns.e('button')} size-change`"
    @mouseenter="showThemeSizeItem = true"
    @mouseleave="showThemeSizeItem = false"
    @click="showThemeSizeItem = true"
  >
    <Icon :icon="sizeIcon"></Icon>
    <transition :name="ns.joinNamespace('mode')">
      <ul :class="`${ns.e('button__size')} dropdown`" v-show="showThemeSizeItem" @click.stop @touchstart.stop>
        <li
          v-for="item in themeSizeList"
          :key="item.size"
          title=""
          :class="['dropdown-item', 'sle', { active: item.size === currentThemeSize }]"
          @click="changeTheme('theme-size', item.size)"
        >
          {{ item.name }}
        </li>
      </ul>
    </transition>
  </div>
</template>
