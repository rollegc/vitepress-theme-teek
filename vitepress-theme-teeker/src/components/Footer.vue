<script setup lang="ts" name="Footer">
import { useNamespace } from "../hooks";
import { useUnrefData } from "../configProvider";
import themeSvg from "../assets/svg/footerTheme";
import copyrightSvg from "../assets/svg/copyright";
import icpRecordSvg from "../assets/svg/icpRecord";
// @ts-ignore
import securityRecordImg from "../assets/img/securityRecord.png";
import { version } from "../version";
import { computed } from "vue";
import Icon from "./Icon.vue";
import { FooterInfo, Social } from "../config/types";

const ns = useNamespace("footer");

const { theme } = useUnrefData();

const { footerInfo, social = [] }: { footerInfo: FooterInfo; social: Social[] } = theme;

const footerData = computed(() => {
  const { theme, copyright, icpRecord, securityRecord }: FooterInfo = footerInfo || {};
  const data: Social[] = [];
  // 1.主题版权
  data.push({
    name: `Theme By Teeker@${version}`,
    icon: themeSvg,
    link: "https://teeker.tianke99.cn",
    // 可覆盖上面的配置项
    ...theme,
  });

  // 2.博客版权
  const { createYear = "", suffix = "" } = copyright || {};
  data.push({
    name: `Copyright ${createYear ? `${createYear}-` : ""}${new Date().getFullYear()} ${suffix}`,
    icon: copyrightSvg,
    ...copyright,
  });

  // 3.ICP 备案信息
  if (icpRecord) data.push({ icon: icpRecordSvg, ...icpRecord });

  // 4.网络安全备案信息
  if (securityRecord) {
    data.push({ icon: securityRecordImg, iconType: "img", imgAlt: "公网安备", ...securityRecord });
  }

  return data;
});
</script>

<template>
  <div v-if="footerInfo || social.length" :class="ns.b()">
    <div v-if="social.length" :class="`${ns.e('icons')} flx-center`">
      <a v-for="(item, index) in social" :key="index" :href="item.link" :title="item.name" target="_blank">
        <template v-if="item.icon">
          <Icon
            :iconType="item.iconType"
            :icon="item.icon"
            size="20px"
            color="var(--vp-c-text-2)"
            hover
            :imgAlt="item.imgAlt"
          />
        </template>
        <span v-else-if="item.name">{{ item.name }}</span>
      </a>
    </div>

    <template v-if="footerInfo">
      <p v-for="m in [footerInfo.message || []].flat()" v-html="m" />

      <div :class="`${ns.e('list')} flx-wrap-justify-center`">
        <div v-for="item in footerData" :key="item.name" :class="`${ns.e('list__item')} flx-align-center`">
          <template v-if="item.icon">
            <Icon
              :iconType="item.iconType"
              :icon="item.icon"
              size="16px"
              color="var(--vp-c-text-2)"
              :imgAlt="item.imgAlt"
            />
          </template>

          <a v-if="item.link" :href="item.link" target="_blank">
            {{ item.name }}
          </a>
          <span v-else>{{ item.name }}</span>
        </div>

        <span v-if="footerInfo.customerHtml" v-html="footerInfo.customerHtml"></span>
      </div>
    </template>
  </div>
</template>
