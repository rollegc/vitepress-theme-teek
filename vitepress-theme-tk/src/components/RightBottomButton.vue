<script setup lang="ts" name="RightBottomButton">
import { useDesign } from "../hooks";
import { computed, ref, unref, onMounted, onUnmounted } from "vue";
import { ElIcon } from "element-plus";
import { ArrowUp, MagicStick, Tools } from "@element-plus/icons-vue";
import { useUnrefData } from "../configProvider";
import { scrollTo } from "../helper";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("rightBottomButton");

// 返回顶部
const scrollTop = ref(0);
const showToTop = computed(() => unref(scrollTop) > 100);
const scrollToTop = () => {
  scrollTo("html", 0, 1500);
  scrollTop.value = 0;
};

const watchScroll = () => {
  scrollTop.value = document.documentElement.scrollTop || document.body.scrollTop || 0;
};

onMounted(() => {
  window.addEventListener("scroll", watchScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", watchScroll);
});

// 主题切换
const { theme } = useUnrefData();
const { themeMode = [], themeSize = [] } = theme;

const showThemeModeItem = ref(false);
const currentThemeMode = ref("vp-default");

const themeModeList = [
  {
    label: "VP 主题",
    tip: "VitePress 主题",
    options: [
      { name: "默认", theme: "vp-default" },
      { name: "绿色", theme: "vp-green" },
      { name: "黄色", theme: "vp-yellow" },
      { name: "红色", theme: "vp-red" },
    ],
  },
  {
    label: "EP 主题",
    tip: "Element Plus 主题",
    options: [
      { name: "蓝色", theme: "el-blue" },
      { name: "绿色", theme: "el-green" },
      { name: "黄色", theme: "el-yellow" },
      { name: "红色", theme: "el-red" },
    ],
  },

  ...themeMode,
];

const changeThemeMode = (themeMode: string) => {
  currentThemeMode.value = themeMode;
  document.documentElement.setAttribute("theme", themeMode);
};

const showThemeSizeItem = ref(false);
const currentThemeSize = ref("default");

const themeSizeList = [
  { name: "Large", size: "large" },
  { name: "Default", size: "default" },
  { name: "Small", size: "small" },
  ...themeSize,
];

const changeThemeSize = (themeSize: string) => {
  currentThemeSize.value = themeSize;
  document.documentElement.setAttribute("size", themeSize);
};
</script>

<template>
  <div :class="`${prefixClass} flx-column`">
    <transition name="fade">
      <div title="返回顶部" :class="`${prefixClass}-button`" v-show="showToTop" @click="scrollToTop">
        <el-icon><ArrowUp /></el-icon>
      </div>
    </transition>

    <div
      title="字体切换"
      :class="`${prefixClass}-button`"
      @mouseenter="showThemeSizeItem = true"
      @mouseleave="showThemeSizeItem = false"
      @click="showThemeSizeItem = true"
    >
      <el-icon><Tools /></el-icon>
      <transition name="mode">
        <ul :class="`${prefixClass}-button__size dropdown`" v-show="showThemeSizeItem" @click.stop @touchstart.stop>
          <li
            v-for="item in themeSizeList"
            :key="item.size"
            title=""
            :class="['dropdown-item', 'sle', { active: item.size === currentThemeSize }]"
            @click="changeThemeSize(item.size)"
          >
            {{ item.name }}
          </li>
        </ul>
      </transition>
    </div>

    <div
      title="主题切换"
      :class="`${prefixClass}-button`"
      @mouseenter="showThemeModeItem = true"
      @mouseleave="showThemeModeItem = false"
      @click="showThemeModeItem = true"
    >
      <el-icon><MagicStick /></el-icon>
      <transition name="mode">
        <div :class="`${prefixClass}-button__mode dropdown`" v-show="showThemeModeItem" @click.stop @touchstart.stop>
          <ul v-for="item in themeModeList" :key="item.label">
            <li :class="`${prefixClass}-button__mode-title sle`" :title="item.tip || ''">{{ item.label }}</li>
            <li>
              <ul>
                <li
                  v-for="option in item.options"
                  :key="item.label + option.theme"
                  title=""
                  :class="['dropdown-item', 'sle', { active: option.theme === currentThemeMode }]"
                  @click="changeThemeMode(option.theme)"
                >
                  {{ option.name }}
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/components/rightBottomButton.scss";
</style>
