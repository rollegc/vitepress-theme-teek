<script setup lang="ts" name="Notice">
import { computed, onMounted, ref, unref, watch } from "vue";
import { useData, useRouter } from "vitepress";
import { useNamespace, useWindowSize } from "../../../hooks";
import { Icon } from "../../";
import noticeSvg from "../../../assets/svg/notice";
import closeSvg from "../../../assets/svg/close";
import { isString } from "../../../helper";
import { Notice } from "../../../config/types";

defineOptions({ name: "Notice" });

const ns = useNamespace("notice");
const { theme, localeIndex } = useData();

const {
  noticeStyle,
  iconStyle = {},
  popoverStyle = {},
  title = "公告",
  initOpen = true,
  duration = 0,
  mobileMinify = false,
  reopen = true,
  useStorage = true,
  twinkle = false,
  position = "top",
  noticeIcon = noticeSvg,
  closeIcon = closeSvg,
  onAfterRouteChange,
}: Notice = unref(theme).notice || {};

const destroyNoticeIcon = ref(false);
const showNoticeIcon = computed(() => !unref(showPopover) && !unref(destroyNoticeIcon));
const showPopover = ref(initOpen);

// 公告样式
const style = computed(() => {
  if (!noticeStyle) return "";
  return noticeStyle.trim().startsWith(`.${ns.b()}`) ? noticeStyle : `.${ns.b()} { ${noticeStyle} }`;
});

// 公告标题
const noticeTitle = computed(() => {
  if (isString(title)) return title;
  return title(unref(localeIndex));
});

// 是否在移动端隐藏公告功能
if (mobileMinify) {
  useWindowSize(width => {
    if (width < 768) destroyNoticeIcon.value = false;
    else if (destroyNoticeIcon.value !== true) destroyNoticeIcon.value = true;
  });
}

const router = useRouter();

/**
 * 将自定义的路由切换后回调绑定到路由上
 */
const bindCallBackToRouter = () => {
  const selfOnAfterRouteChange = router.onAfterRouteChange;
  router.onAfterRouteChange = (href: string) => {
    selfOnAfterRouteChange?.(href);
    // 调用自定义的切换后回调
    onAfterRouteChange?.(router.route, showNoticeIcon, showPopover);
  };
};

let timer: NodeJS.Timeout | null = null;

/**
 * 弹框定时自动关闭
 */
const closePopoverWhenTimeout = () => {
  if (unref(showPopover) && duration > 0) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(handleClosePopover, duration);
  }
};

onMounted(() => {
  bindCallBackToRouter();
  closePopoverWhenTimeout();
});

/**
 * 如果公告弹框的 position 为 center，则当遮罩层出现时禁止滚动，即将滚动去掉
 * @param action 对滚动条的行为
 */
const openOrDisableScroll = (action: "open" | "disable") => {
  if (position !== "center") return;

  const actions: Record<"open" | "disable", "add" | "remove"> = {
    open: "remove",
    disable: "add",
  };
  document.documentElement.classList[actions[action]]("disable-scroll");
};

// 记录公告弹框状态的缓存 Key
const storageKey = computed(() => `${ns.b()}-${unref(localeIndex)}`);

if (useStorage) {
  // 多语言切换后，读取新语言的缓存，更新公告弹框状态
  watch(
    localeIndex,
    () => {
      const oldValue = localStorage.getItem(unref(storageKey));
      if (oldValue) {
        const isShowPopover = oldValue === "true";
        showPopover.value = isShowPopover;

        if (isShowPopover) openOrDisableScroll("disable");
      }
    },
    { immediate: true }
  );
}

/**
 * 打开公告弹窗
 */
const handleOpenPopover = () => {
  showPopover.value = true;
  storagePopoverState("true");
  closePopoverWhenTimeout();

  openOrDisableScroll("disable");
};

/**
 * 关闭公告弹窗
 */
const handleClosePopover = () => {
  showPopover.value = false;
  storagePopoverState("false");

  if (!reopen) destroyNoticeIcon.value = true;

  if (timer) clearTimeout(timer);
  openOrDisableScroll("open");
};

/**
 * 缓存公告弹框状态
 * @param state 状态
 */
const storagePopoverState = (state: string) => {
  if (useStorage) localStorage.setItem(unref(storageKey), state);
};
</script>

<template>
  <div :class="[ns.b(), ns.joinNamespace('wallpaper-outside')]">
    <component v-if="style" is="style">{{ style }}</component>

    <!-- 公告图标 -->
    <div
      v-if="!destroyNoticeIcon"
      v-show="showNoticeIcon"
      :class="[ns.e('icon'), { twinkle: twinkle }]"
      :style="iconStyle"
      @click="handleOpenPopover"
    >
      <Icon :icon="noticeIcon" color="#ffffff" size="14px"></Icon>
    </div>

    <!-- 公告弹窗 -->
    <div v-show="showPopover" :class="[ns.e('popover'), ns.is(position)]" :style="popoverStyle">
      <slot name="header">
        <div :class="[ns.e('popover__header'), 'flx-justify-between']">
          <div class="flx-align-center">
            <Icon :icon="noticeIcon" color="#ffffff" size="20px"></Icon>
            <span class="title sle">{{ noticeTitle }}</span>
          </div>
          <Icon :icon="closeIcon" size="20px" :style="{ cursor: 'pointer' }" @click="handleClosePopover"></Icon>
        </div>
      </slot>

      <div :class="ns.e('popover__content')">
        <slot name="content" />
      </div>
    </div>

    <!-- 遮罩层，与公告弹窗一起出现 -->
    <div v-show="showPopover && position === 'center'" :class="ns.e('mask')"></div>
  </div>
</template>
