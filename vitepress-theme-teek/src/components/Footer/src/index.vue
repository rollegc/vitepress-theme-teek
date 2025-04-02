<script setup lang="ts" name="Footer">
import { computed, unref } from "vue";
import { withBase, useData } from "vitepress";
import { useNamespace } from "../../../hooks";
import { themeIcon, copyrightIcon, icpRecordIcon } from "../../../assets/icons";
// @ts-ignore
import securityRecordImg from "../../../assets/img/securityRecord.png";
import Icon from "../../Icon";
import type { FooterInfo, Social } from "../../../config/types";

defineOptions({ name: "TkFooter" });

const ns = useNamespace("footer");

const { theme, frontmatter } = useData();

const footerInfo = computed<FooterInfo>(() => ({ ...unref(theme).footerInfo, ...unref(frontmatter).tk?.footerInfo }));
const social = computed<Social[]>(() => [...(unref(theme).social || []), ...(unref(frontmatter).tk?.social || [])]);

const footerData = computed(() => {
  const { theme = {}, copyright = {}, icpRecord, securityRecord }: FooterInfo = unref(footerInfo) || {};
  const data: Social[] = [];
  // 1.主题版权
  if (theme.show !== false) {
    data.push({
      name: "Theme By Teek",
      icon: themeIcon,
      link: "https://github.com/Kele-Bingtang/vitepress-theme-teek",
      // 可覆盖上面的配置项
      ...theme,
    });
  }

  // 2.博客版权
  const { show = true, createYear = "", suffix = "" } = copyright;
  if (show) {
    data.push({
      name: `Copyright ${createYear ? `${createYear}-` : ""}${new Date().getFullYear()} ${suffix}`,
      icon: copyrightIcon,
      ...copyright,
    });
  }

  // 3.ICP 备案信息
  if (icpRecord) data.push({ icon: icpRecordIcon, ...icpRecord });

  // 4.网络安全备案信息
  if (securityRecord) {
    data.push({ icon: securityRecordImg, iconType: "img", imgAlt: "Security Record", ...securityRecord });
  }

  return data;
});
</script>

<template>
  <div v-if="footerInfo || social.length" :class="[ns.b(), ns.joinNamespace('wallpaper-outside')]">
    <div v-if="social.length" :class="`${ns.e('icons')} flx-center`">
      <a
        v-for="(item, index) in social"
        :key="index"
        :href="item.link && withBase(item.link)"
        :title="item.name"
        target="_blank"
      >
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
      <p v-for="(message, index) in [footerInfo.topMessage || []].flat()" :key="index" v-html="message" />

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

          <a v-if="item.link" :href="withBase(item.link)" target="_blank">
            {{ item.name }}
          </a>
          <span v-else>{{ item.name }}</span>
        </div>

        <span v-if="footerInfo.customHtml" v-html="footerInfo.customHtml"></span>
      </div>

      <p v-for="(message, index) in [footerInfo.bottomMessage || []].flat()" :key="index" v-html="message" />
    </template>
  </div>
</template>
