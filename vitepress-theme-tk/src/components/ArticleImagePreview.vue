<script setup lang="ts" name="ArticleImagePreview">
import { useDesign } from "../hooks";
import { onMounted, onUnmounted, reactive, ref } from "vue";
import { createImageViewer } from "./ImageViewer";

const { getPrefixClass } = useDesign();
const prefixClass = getPrefixClass("articleImagePreview");

const previewImage = (e: Event) => {
  const target = e.target as HTMLElement;
  const currentTarget = e.currentTarget as HTMLElement;

  if (target.tagName.toLowerCase() === "img") {
    const imgDoms = currentTarget.querySelectorAll<HTMLImageElement>(".content-container .main img");
    const imgs = Array.from(imgDoms);

    const urlList = imgs.map(el => el.src);
    const initialIndex = imgs.findIndex(el => el === target);
    const url = target.getAttribute("src");

    // 兼容点击文档之外的图片
    if (initialIndex === -1 && url) {
      urlList.push(url);
      initialIndex = urlList.length - 1;
    }

    createImageViewer({ urlList, initialIndex, infinite: false });
  }
};

onMounted(() => {
  const docDomContainer = document.querySelector("#VPContent");
  docDomContainer?.addEventListener("click", previewImage);
});

onUnmounted(() => {
  const docDomContainer = document.querySelector("#VPContent");
  docDomContainer?.removeEventListener("click", previewImage);
});
</script>
