<script setup lang="ts" name="RightBottomButton">
import { computed, ref, unref, onMounted, onUnmounted, watch } from "vue";
import { useNamespace, useDebounce } from "../../../hooks";
import Icon from "../../Icon";
import { sizeIcon, rocketIcon, magicIcon, commentIcon } from "../../../assets/icons";
import type { CommentConfig, ThemeSetting } from "../../../config/types";
import { useData } from "vitepress";

defineOptions({ name: "RightBottomButton" });

const ns = useNamespace("rightBottomButton");

// 返回顶部 & 前往评论区
const scrollTop = ref(0);
const showToTop = computed(() => unref(scrollTop) > 100);

const showToComment = computed(() => {
  let docContentHeight = document.querySelector(".content-container .main")?.getBoundingClientRect().height;
  let docFooterHeight = document.querySelector(".VPDocFooter")?.getBoundingClientRect().height || 200;
  let height = 0;
  if (docContentHeight) height = docContentHeight - docFooterHeight - window.innerHeight / 2;

  return unref(scrollTop) < height;
});

const scrollToTop = useDebounce(() => {
  document.querySelector("html")?.scrollIntoView({ behavior: "smooth" });
}, 500);

const scrollToComment = useDebounce(() => {
  document.querySelector(`#${ns.joinNamespace("comment")}`)?.scrollIntoView({ behavior: "smooth" });
}, 500);

const watchScroll = () => {
  scrollTop.value = document.documentElement.scrollTop || document.body.scrollTop || 0;
  updateScrollProgress();
};

const progress = ref(0);
/**
 * 更新返回顶部的进度条
 */
const updateScrollProgress = () => {
  const p = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  progress.value = Math.round(p * 100);
};

onMounted(() => {
  updateScrollProgress();
  window.addEventListener("scroll", watchScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", watchScroll);
});

const { theme, frontmatter } = useData();
const {
  useThemeStyle = true,
  themeStyle: defaultThemeStyle = "vp-default",
  themeStyleAppend = [],
  useThemeSize = true,
  themeSize: defaultThemeSize = "default",
  themeSizeAppend = [],
}: ThemeSetting = unref(theme).themeSetting || {};

const { provider }: CommentConfig = unref(theme).comment || {};
const themeStyleStorageKey = ns.b("themeStyle");
const themeSizeStorageKey = ns.b("themeSize");

// 主题切换
const showThemeStyleItem = ref(false);
const currentThemeStyle = ref(defaultThemeStyle);
const themeStyleList = [
  {
    label: "VP 主题",
    tip: "VitePress 主题",
    options: [
      { name: "默认", style: "vp-default" },
      { name: "绿色", style: "vp-green" },
      { name: "黄色", style: "vp-yellow" },
      { name: "红色", style: "vp-red" },
    ],
  },
  {
    label: "EP 主题",
    tip: "Element Plus 主题",
    options: [
      { name: "蓝色", style: "el-blue" },
      { name: "绿色", style: "el-green" },
      { name: "黄色", style: "el-yellow" },
      { name: "红色", style: "el-red" },
    ],
  },
  ...themeStyleAppend,
];

// 主题尺寸
const showThemeSizeItem = ref(false);
const currentThemeSize = ref(defaultThemeSize);
const themeSizeList = [
  { name: "Wide", size: "wide" },
  { name: "Large", size: "large" },
  { name: "Default", size: "default" },
  { name: "Small", size: "small" },
  ...themeSizeAppend,
];

/**
 * 修改主题风格或尺寸
 */
const changeTheme = (attribute: "theme-style" | "theme-size", value: string, isDoc = false) => {
  const currentTheme = attribute === "theme-style" ? currentThemeStyle : currentThemeSize;
  const themeStorageKey = attribute === "theme-style" ? themeStyleStorageKey : themeSizeStorageKey;

  // 当 value 是从 localstorage 取，可能是 "undefined" 字符串
  if ([document.documentElement.getAttribute(attribute), undefined, "undefined"].includes(value)) return;

  currentTheme.value = value;
  document.documentElement.setAttribute(attribute, value);

  // 只存储全局配置到本地
  if (!isDoc) localStorage.setItem(themeStorageKey, value);
};

/**
 * 修改文章页的主题风格或尺寸，仅当 frontmatter.themeStyle 或 frontmatter.themeSize 存在时生效
 */
const changeDocTheme = (attribute: "theme-style" | "theme-size", value: string) => {
  if (value) changeTheme(attribute, value, true);
  else {
    const themeStorageKey = attribute === "theme-style" ? themeStyleStorageKey : themeSizeStorageKey;
    const defaultTheme = attribute === "theme-style" ? defaultThemeStyle : defaultThemeSize;

    // 初始化/还原主题风格
    changeTheme(attribute, localStorage.getItem(themeStorageKey) || defaultTheme);
  }
};

// 文章页主题风格设置
watch(
  () => unref(frontmatter).themeStyle,
  (themeStyle: string) => changeDocTheme("theme-style", themeStyle),
  { immediate: true }
);

// 文章页主题尺寸设置
watch(
  () => unref(frontmatter).themeSize,
  (docThemeSize: string) => changeDocTheme("theme-size", docThemeSize),
  { immediate: true }
);
</script>

<template>
  <div :class="[ns.b(), ns.joinNamespace('wallpaper-outside'), 'flx-column']">
    <slot name="teek-right-bottom-before" />

    <transition :name="ns.joinNamespace('fade')">
      <div
        title="返回顶部"
        :class="[ns.e('button'), 'back-top']"
        v-show="showToTop"
        @click="scrollToTop"
        :style="{ [ns.cssVarName('progress')]: progress }"
      >
        <Icon :icon="rocketIcon"></Icon>
      </div>
    </transition>

    <transition :name="ns.joinNamespace('fade')">
      <div v-if="provider && showToComment" title="前往评论" :class="ns.e('button')" @click="scrollToComment">
        <Icon :icon="commentIcon" />
      </div>
    </transition>

    <div
      v-if="useThemeSize"
      title="主题尺寸切换"
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

    <div
      v-if="useThemeStyle"
      title="主题风格切换"
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

    <slot name="teek-right-bottom-after" />
  </div>
</template>
