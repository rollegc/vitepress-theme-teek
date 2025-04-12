<script setup lang="ts" name="ThemeStyle">
import { computed, unref, ref, inject, watch } from "vue";
import { useData } from "vitepress";
import { useTeekConfig } from "../../../configProvider";
import { useNamespace, useLocale, useStorage } from "../../../hooks";
import Icon from "../../Icon";
import { magicIcon } from "../../../assets/icons";
import type { ThemeSetting } from "../../../config/types";
import { rightBottomButtonNsSymbol } from "./rightBottomButton";

defineOptions({ name: "ThemeStyle" });

const ns = inject(rightBottomButtonNsSymbol, useNamespace("right-bottom-button"));
const { t } = useLocale();

const { frontmatter } = useData();
const { getTeekConfigRef } = useTeekConfig();

const themeSettingConfig = getTeekConfigRef<Required<ThemeSetting>>("themeSetting", {
  themeStyle: "vp-default",
  themeStyleAppend: [],
  themeStyleLabel: {},
  titleTip: {},
});

// 主题样式
const showThemeStyleItem = ref(false);
const currentThemeStyle = ref(unref(themeSettingConfig).themeStyle);

const themeStyleList = computed(() => {
  const { themeStyleLabel, themeStyleAppend } = unref(themeSettingConfig);
  return [
    {
      label: themeStyleLabel.vpLabel ?? t("tk.rightBottomButton.vpLabel"),
      tip: themeStyleLabel.vpTip ?? t("tk.rightBottomButton.vpTip"),
      options: [
        { name: themeStyleLabel.default ?? t("tk.rightBottomButton.default"), style: "vp-default" },
        { name: themeStyleLabel.vpGreen ?? t("tk.rightBottomButton.vpGreen"), style: "vp-green" },
        { name: themeStyleLabel.vpYellow ?? t("tk.rightBottomButton.vpYellow"), style: "vp-yellow" },
        { name: themeStyleLabel.vpRed ?? t("tk.rightBottomButton.vpRed"), style: "vp-red" },
      ],
    },
    {
      label: themeStyleLabel.epLabel ?? t("tk.rightBottomButton.epLabel"),
      tip: themeStyleLabel.epTip ?? t("tk.rightBottomButton.epTip"),
      options: [
        { name: themeStyleLabel.epBlue ?? t("tk.rightBottomButton.epBlue"), style: "el-blue" },
        { name: themeStyleLabel.epGreen ?? t("tk.rightBottomButton.epGreen"), style: "el-green" },
        { name: themeStyleLabel.epYellow ?? t("tk.rightBottomButton.epYellow"), style: "el-yellow" },
        { name: themeStyleLabel.epRed ?? t("tk.rightBottomButton.epRed"), style: "el-red" },
      ],
    },
    ...themeStyleAppend,
  ];
});

const themeStyleStorageKey = ns.joinNamespace("themeStyle");
const localStorage = useStorage("localStorage");
const attribute = "theme-style";

/**
 * 修改主题风格
 */
const changeTheme = (value: string, isDoc = false) => {
  // 当 value 是从 localstorage 取，可能是 "undefined" 字符串
  if ([document.documentElement.getAttribute(attribute), undefined, "undefined"].includes(value)) return;

  currentThemeStyle.value = value;
  document.documentElement.setAttribute(attribute, value);

  // 只存储全局配置到本地
  if (!isDoc) localStorage.setStorage(themeStyleStorageKey, value);
};

/**
 * 修改文章页的主题风格，仅当 frontmatter.themeStyle 存在时生效
 */
const changeDocTheme = (value: string) => {
  const { themeStyle } = unref(themeSettingConfig);
  if (value) changeTheme(value, true);
  else {
    // 初始化/还原主题风格
    changeTheme(localStorage.getStorage(themeStyleStorageKey) || themeStyle);
  }
};

watch(
  () => unref(themeSettingConfig).themeStyle,
  (newValue: string) => changeTheme(newValue)
);

// 文章页主题风格设置
watch(
  () => unref(frontmatter).themeStyle,
  (docThemeStyle: string) => changeDocTheme(docThemeStyle),
  { immediate: true }
);
</script>

<template>
  <div
    :title="themeSettingConfig.titleTip.themeStyle ?? t('tk.rightBottomButton.themeStyleTitle')"
    :class="ns.e('button')"
    @mouseenter="showThemeStyleItem = true"
    @mouseleave="showThemeStyleItem = false"
    @click="showThemeStyleItem = true"
    role="button"
    :aria-label="themeSettingConfig.titleTip.themeStyle ?? t('tk.rightBottomButton.themeStyleTitle')"
  >
    <Icon :icon="magicIcon" aria-hidden="true" />
    <transition :name="ns.joinNamespace('mode')">
      <div :class="`${ns.e('button__style')} dropdown`" v-show="showThemeStyleItem" @click.stop @touchstart.stop>
        <ul v-for="item in themeStyleList" :key="item.label">
          <li :class="`${ns.e('button__style__title')} sle`" :title="item.tip || ''" :aria-label="item.label">
            {{ item.label }}
          </li>
          <li>
            <ul>
              <li
                v-for="option in item.options"
                :key="item.label + option.style"
                title=""
                :class="['dropdown-item', 'sle', { active: option.style === currentThemeStyle }]"
                @click="changeTheme(option.style)"
                role="button"
                :aria-label="option.name"
              >
                {{ option.name }}
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>
