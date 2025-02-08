<script setup lang="ts" name="HomeCard">
import { unref, onMounted } from "vue";
import { useDesign } from "../hooks";
import { ElIcon } from "element-plus";
import { ArrowLeft, ArrowRight } from "@element-plus/icons-vue";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("homeCard");

export interface HomeCardProps {
  title?: string;
  titleLink?: string;
  page?: boolean;
  pageSize?: number;
  total?: number;
  auto?: boolean;
  timeout?: number;
}

const {
  title = "",
  titleLink,
  page = false,
  pageSize = 4,
  total,
  auto = false,
  timeout = 4000,
} = defineProps<HomeCardProps>();

const emit = defineEmits<{ pagination: [to: number, "pre" | "next"] }>();

const pageNum = defineModel<number>({ default: 1 });
const pageTotalNum = Math.ceil(total / pageSize);
const hasNextData = total !== 0 && pageTotalNum !== 1;

const pagination = (to: number, type: "prev" | "next") => {
  emit("pagination", to, type);

  if (auto) startTimer();
  const index = unref(pageNum) % pageTotalNum;
  const res = (index + to) % pageTotalNum;

  if (res < 1) pageNum.value = pageTotalNum + res;
  else if (res > pageTotalNum) pageNum.value = 1;
  else pageNum.value = res;
};

let timer: NodeJS.Timeout;

const startTimer = () => {
  if (timer) clearTimeout(timer);
  if (timeout > 0) {
    timer = setTimeout(() => {
      pagination(1, "next");
    }, timeout);
  }
};

onMounted(() => {
  if (auto) startTimer();
});
</script>

<template>
  <div :class="`${prefixClass} card`">
    <div :class="`${prefixClass}-header flx-justify-between`">
      <slot name="title">
        <a v-if="titleLink" :href="titleLink">
          <span class="title flx-align-center" v-html="title"></span>
        </a>
        <span v-else class="title flx-align-center" v-html="title"></span>
      </slot>
      <slot name="page" v-bind="{ pagination }">
        <div v-if="page">
          <slot name="page-left" v-bind="{ pagination }">
            <span :class="['page-button', hasNextData ? 'pointer' : 'disabled']" @click="pagination(-1, 'prev')">
              <el-icon :size="12"><ArrowLeft /></el-icon>
            </span>
          </slot>

          <slot name="page-right" v-bind="{ pagination }">
            <span :class="['page-button', hasNextData ? 'pointer' : 'disabled']" @click="pagination(1, 'next')">
              <el-icon :size="12"><ArrowRight /></el-icon>
            </span>
          </slot>
        </div>
      </slot>
    </div>

    <slot />
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/components/homeCard.scss";
</style>

<style lang="scss">
@use "../styles/namespace.scss" as *;

$prefix-class: #{$theme-namespace}-homeCard;

.#{$prefix-class} {
  /* 下一页滑动效果 */
  .slide-next-move,
  .slide-next-enter-active,
  .slide-next-leave-active {
    transition: all 0.5s ease;
  }
  .slide-next-enter-from {
    transform: translateX(100%);
    opacity: 0;
  }
  .slide-next-leave-to {
    transform: translateX(-100%);
    opacity: 0;
  }
  .slide-next-leave-active {
    position: absolute;
  }

  /* 上一页滑动效果 */
  .slide-prev-move,
  .slide-prev-enter-active,
  .slide-prev-leave-active {
    transition: all 0.5s ease;
  }
  .slide-prev-enter-from {
    transform: translateX(-100%);
    opacity: 0;
  }
  .slide-prev-leave-to {
    transform: translateX(100%);
    opacity: 0;
  }
  .slide-prev-leave-active {
    position: absolute;
  }

  /* 上下滚动效果 */
  .scroll-move,
  .scroll-enter-active,
  .scroll-leave-active {
    transition: all 0.5s ease;
  }
  .scroll-enter-from {
    transform: translateY(70px);
    opacity: 0;
  }
  .scroll-leave-to {
    transform: translateY(-30px);
    opacity: 0;
  }
  .scroll-leave-active {
    position: absolute;
  }
}
</style>
