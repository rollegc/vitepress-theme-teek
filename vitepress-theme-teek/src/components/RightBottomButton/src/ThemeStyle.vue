<script setup lang="ts" name="ThemeStyle">
import { computed, unref, ref, inject, watch } from "vue";
import { useData } from "vitepress";
import { useNamespace } from "../../../hooks";
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
const themeStyleStorageKey = ns.b("themeStyle");
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

watch(
  () => unref(themeSettingConfig).themeStyle,
  (themeStyle: string) => (currentThemeStyle.value = themeStyle)
);

/**
 * 修改主题风格
 */
const changeTheme = (attribute: "theme-style", value: string, isDoc = false) => {
  // 当 value 是从 localstorage 取，可能是 "undefined" 字符串
  if ([document.documentElement.getAttribute(attribute), undefined, "undefined"].includes(value)) return;

  currentThemeStyle.value = value;
  document.documentElement.setAttribute(attribute, value);

  // 只存储全局配置到本地
  if (!isDoc) localStorage.setItem(themeStyleStorageKey, value);
};

/**
 * 修改文章页的主题风格，仅当 frontmatter.themeStyle 存在时生效
 */
const changeDocTheme = (attribute: "theme-style", value: string) => {
  const { themeStyle } = unref(themeSettingConfig);
  if (value) changeTheme(attribute, value, true);
  else {
    // 初始化/还原主题风格
    changeTheme(attribute, localStorage.getItem(themeStyleStorageKey) || themeStyle);
  }
};

// 文章页主题风格设置
watch(
  () => unref(frontmatter).themeStyle,
  (themeStyle: string) => changeDocTheme("theme-style", themeStyle),
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
      <div :class="`${ns.e('button__mode')} dropdown`" v-show="showThemeStyleItem" @click.stop @touchstart.stop>
        <ul v-for="item in themeStyleList" :key="item.label">
          <li :class="`${ns.e('button__mode__title')} sle`" :title="item.tip || ''">{{ item.label }}</li>
          <li>
            <ul>
              <li
                v-for="option in item.options"
                :key="item.label + option.style"
                title=""
                :class="['dropdown-item', 'sle', { active: option.style === currentThemeStyle }]"
                @click="changeTheme('theme-style', option.style)"
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
