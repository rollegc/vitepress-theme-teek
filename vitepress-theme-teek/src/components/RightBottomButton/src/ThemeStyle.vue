<script setup lang="ts" name="ThemeStyle">
import { computed, unref, ref, inject, watch } from "vue";
import { useData } from "vitepress";
import { useNamespace, useStorage } from "../../../hooks";
import Icon from "../../Icon";
import { magicIcon } from "../../../assets/icons";
import type { ThemeSetting } from "../../../config/types";
import { rightBottomButtonNsSymbol } from "./rightBottomButton";

defineOptions({ name: "ThemeStyle" });

const ns = inject(rightBottomButtonNsSymbol, useNamespace("right-bottom-button"));

const { theme, frontmatter } = useData();
const themeSettingConfig = computed<Required<ThemeSetting>>(() => ({
  themeStyle: "vp-default",
  themeStyleAppend: [],
  themeStyleLabel: {},
  titleTip: {},
  ...unref(theme).themeSetting,
}));

// 主题样式
const showThemeStyleItem = ref(false);
const currentThemeStyle = ref(unref(themeSettingConfig).themeStyle);

const themeStyleList = computed(() => {
  const { themeStyleLabel, themeStyleAppend } = unref(themeSettingConfig);
  return [
    {
      label: themeStyleLabel.vpLabel ?? "VP 主题",
      tip: themeStyleLabel.vpTip ?? "VitePress 主题",
      options: [
        { name: themeStyleLabel.default ?? "默认", style: "vp-default" },
        { name: themeStyleLabel.vpGreen ?? "绿色", style: "vp-green" },
        { name: themeStyleLabel.vpYellow ?? "黄色", style: "vp-yellow" },
        { name: themeStyleLabel.vpRed ?? "红色", style: "vp-red" },
      ],
    },
    {
      label: themeStyleLabel.epLabel ?? "EP 主题",
      tip: themeStyleLabel.epTip ?? "Element Plus 主题",
      options: [
        { name: themeStyleLabel.epBlue ?? "蓝色", style: "el-blue" },
        { name: themeStyleLabel.epGreen ?? "绿色", style: "el-green" },
        { name: themeStyleLabel.epYellow ?? "黄色", style: "el-yellow" },
        { name: themeStyleLabel.epRed ?? "红色", style: "el-red" },
      ],
    },
    ...themeStyleAppend,
  ];
});

const themeStyleStorageKey = ns.joinNamespace("themeStyle");
const localStorage = useStorage("localStorage");
const attribute = "theme-size";

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
    :title="themeSettingConfig.titleTip.themeStyle ?? '主题风格切换'"
    :class="ns.e('button')"
    @mouseenter="showThemeStyleItem = true"
    @mouseleave="showThemeStyleItem = false"
    @click="showThemeStyleItem = true"
  >
    <Icon :icon="magicIcon" />
    <transition :name="ns.joinNamespace('mode')">
      <div :class="`${ns.e('button__style')} dropdown`" v-show="showThemeStyleItem" @click.stop @touchstart.stop>
        <ul v-for="item in themeStyleList" :key="item.label">
          <li :class="`${ns.e('button__style__title')} sle`" :title="item.tip || ''">{{ item.label }}</li>
          <li>
            <ul>
              <li
                v-for="option in item.options"
                :key="item.label + option.style"
                title=""
                :class="['dropdown-item', 'sle', { active: option.style === currentThemeStyle }]"
                @click="changeTheme(option.style)"
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
