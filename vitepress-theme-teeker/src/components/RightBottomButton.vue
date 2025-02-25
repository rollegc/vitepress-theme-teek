<script setup lang="ts" name="RightBottomButton">
import { useNamespace, useDebounce } from "../hooks";
import { computed, ref, unref, onMounted, onUnmounted } from "vue";
import { ElIcon } from "element-plus";
import { ArrowUp, MagicStick, ChatDotSquare } from "@element-plus/icons-vue";
import { useUnrefData } from "../configProvider";
import { scrollTo } from "../helper";
import sizeSvg from "../assets/svg/size";
import { CommentConfig, ThemeSetting } from "../config/types";

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
  scrollTo("html", 0, 1500);
  scrollTop.value = 0;
}, 500);

const scrollToComment = useDebounce(() => {
  document.querySelector(`#${ns.joinNamespace("comment")}`)?.scrollIntoView({ behavior: "smooth" });
}, 500);

const watchScroll = () => {
  scrollTop.value = document.documentElement.scrollTop || document.body.scrollTop || 0;
};

onMounted(() => {
  window.addEventListener("scroll", watchScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", watchScroll);
});

const { theme } = useUnrefData();
const {
  useThemeMode = true,
  themeMode = "vp-default",
  themeModeAppend = [],
  useThemeSize = true,
  themeSize = "default",
  themeSizeAppend = [],
}: ThemeSetting = theme.themeSetting || {};

const { provider }: CommentConfig = theme.comment || {};

// 主题切换
const showThemeModeItem = ref(false);
const currentThemeMode = ref(themeMode);

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
  ...themeModeAppend,
];

const changeThemeMode = (themeMode: string) => {
  if (themeMode === unref(currentThemeMode)) return;
  currentThemeMode.value = themeMode;
  document.documentElement.setAttribute("theme", themeMode);
};

// 初始化主题模式
changeThemeMode(themeMode);

// 主题尺寸
const showThemeSizeItem = ref(false);
const currentThemeSize = ref(themeSize);

const themeSizeList = [
  { name: "Large", size: "large" },
  { name: "Default", size: "default" },
  { name: "Small", size: "small" },
  ...themeSizeAppend,
];

const changeThemeSize = (themeSize: string) => {
  if (themeSize === unref(currentThemeSize)) return;
  currentThemeSize.value = themeSize;
  document.documentElement.setAttribute("size", themeSize);
};

// 初始化主题尺寸
changeThemeSize(themeSize);
</script>

<template>
  <div :class="`${ns.b()} flx-column`">
    <transition name="fade">
      <div title="返回顶部" :class="ns.e('button')" v-show="showToTop" @click="scrollToTop">
        <el-icon><ArrowUp /></el-icon>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="provider && showToComment" title="前往评论" :class="ns.e('button')" @click="scrollToComment">
        <el-icon><ChatDotSquare /></el-icon>
      </div>
    </transition>

    <div
      v-if="useThemeSize"
      title="字体切换"
      :class="`${ns.e('button')} size-change`"
      @mouseenter="showThemeSizeItem = true"
      @mouseleave="showThemeSizeItem = false"
      @click="showThemeSizeItem = true"
    >
      <i class="el-icon" v-html="sizeSvg"></i>
      <transition name="mode">
        <ul :class="`${ns.e('button__size')} dropdown`" v-show="showThemeSizeItem" @click.stop @touchstart.stop>
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
      v-if="useThemeMode"
      title="主题切换"
      :class="ns.e('button')"
      @mouseenter="showThemeModeItem = true"
      @mouseleave="showThemeModeItem = false"
      @click="showThemeModeItem = true"
    >
      <el-icon><MagicStick /></el-icon>
      <transition name="mode">
        <div :class="`${ns.e('button__mode')} dropdown`" v-show="showThemeModeItem" @click.stop @touchstart.stop>
          <ul v-for="item in themeModeList" :key="item.label">
            <li :class="`${ns.e('button__mode__title')} sle`" :title="item.tip || ''">{{ item.label }}</li>
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
