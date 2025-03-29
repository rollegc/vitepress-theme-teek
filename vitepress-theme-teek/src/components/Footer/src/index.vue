<script setup lang="ts" name="Footer">
import { computed, unref } from "vue";
import { withBase, useData } from "vitepress";
import { useNamespace } from "../../../hooks";
import { themeIcon, copyrightIcon, icpRecordIcon } from "../../../assets/icons";
// @ts-ignore
import securityRecordImg from "../../../assets/img/securityRecord.png";
import { version } from "../../../version";
import Icon from "../../Icon";
import { FooterInfo, Social } from "../../../config/types";

defineOptions({ name: "Footer" });

const ns = useNamespace("footer");

const { theme, frontmatter } = useData();

const { footerInfo, social = [] }: { footerInfo: FooterInfo; social: Social[] } = {
  ...unref(theme),
  ...unref(frontmatter).tk,
};

const footerData = computed(() => {
  const { theme = {}, copyright = {}, icpRecord, securityRecord }: FooterInfo = footerInfo || {};
  const data: Social[] = [];
  // 1.主题版权
  if (theme.show !== false) {
    data.push({
      name: `Theme By Teek@${version}`,
      icon: themeIcon,
      link: "https://.tianke99.cn",
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
    data.push({ icon: securityRecordImg, iconType: "img", imgAlt: "公网安备", ...securityRecord });
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
      <p v-for="m in [footerInfo.topMessage || []].flat()" v-html="m" />

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

      <p v-for="m in [footerInfo.bottomMessage || []].flat()" v-html="m" />
    </template>
  </div>
</template>
