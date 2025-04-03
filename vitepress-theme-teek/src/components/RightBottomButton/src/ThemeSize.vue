<script setup lang="ts" name="ThemeSize">
import { computed, unref, ref, inject, watch } from "vue";
import { useData } from "vitepress";
import { useNamespace, useStorage } from "../../../hooks";
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

// 主题尺寸
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

const themeSizeStorageKey = ns.joinNamespace("themeSize");
const localStorage = useStorage("localStorage");
const attribute = "theme-size";

/**
 * 修改主题尺寸
 */
const changeTheme = (value: string, isDoc = false) => {
  // 当 value 是从 localstorage 取，可能是 "undefined" 字符串
  if ([document.documentElement.getAttribute(attribute), undefined, "undefined"].includes(value)) return;

  currentThemeSize.value = value;
  document.documentElement.setAttribute(attribute, value);

  // 只存储全局配置到本地
  if (!isDoc) localStorage.setStorage(themeSizeStorageKey, value);
};

/**
 * 修改文章页的主题尺寸，仅当 frontmatter.themeSize 存在时生效
 */
const changeDocTheme = (value: string) => {
  const { themeSize } = unref(themeSettingConfig);
  if (value) changeTheme(value, true);
  else {
    // 初始化/还原主题尺寸
    changeTheme(localStorage.getStorage(themeSizeStorageKey) || themeSize);
  }
};

watch(
  () => unref(themeSettingConfig).themeSize,
  (newValue: string) => changeTheme(newValue)
);

// 文章页主题尺寸设置
watch(
  () => unref(frontmatter).themeSize,
  (docThemeSize: string) => changeDocTheme(docThemeSize),
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
          @click="changeTheme(item.size)"
        >
          {{ item.name }}
        </li>
      </ul>
    </transition>
  </div>
</template>
