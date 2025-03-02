<script setup lang="ts" name="Breadcrumb">
import { useData } from "vitepress";
import { useNamespace } from "../../../hooks";
import { ElBreadcrumb, ElBreadcrumbItem, ElIcon } from "element-plus";
import { computed, unref } from "vue";
import { House } from "@element-plus/icons-vue";
import { useUnrefData } from "../../../configProvider";
import { Breadcrumb } from "../../../config/types";

const ns = useNamespace("breadcrumb");

const { theme, frontmatter } = useUnrefData();
const { localeIndex, page } = useData();

// 面包屑配置项
const breadcrumb: Breadcrumb = {
  enabled: true,
  showCurrentName: false,
  separator: "/",
  ...theme.breadcrumb,
  ...frontmatter.breadcrumb,
};
const relativePathArr = computed(() => unref(page).relativePath.split("/") || []);

const breadcrumbList = computed(() => {
  const classifyList: { fileName: string; filePath: string }[] = [];
  const relativePathArrConst: string[] = unref(relativePathArr);

  relativePathArrConst.forEach((item, index) => {
    // 去除「序号.」的前缀，并获取文件名
    const fileName = item.replace(/^\d+\./, "").split(".")?.[0] || "";

    // 兼容多语言功能，如果使用多语言，在面包屑去掉多语言根目录名
    if ((index !== relativePathArrConst.length - 1 || breadcrumb?.showCurrentName) && fileName !== unref(localeIndex)) {
      classifyList.push({
        fileName,
        filePath: theme.catalogues?.inv[item]?.filePath || "",
      });
    }
  });
  return classifyList;
});
</script>

<template>
  <div :class="`${ns.b()}`">
    <el-breadcrumb v-if="breadcrumb?.enabled" :separator="breadcrumb.separator">
      <el-breadcrumb-item>
        <a href="/" title="首页" class="hover-color">
          <el-icon><House /></el-icon>
        </a>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index">
        <component
          :is="item.filePath ? 'a' : 'span'"
          :href="item.filePath ? `/${item.filePath}` : undefined"
          :title="item.fileName"
          :class="[item.filePath ? 'hover-color' : '']"
        >
          {{ item.fileName }}
        </component>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
