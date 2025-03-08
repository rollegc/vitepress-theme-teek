---
# 文档 Demo 请看项目根目录的 demo 文件夹
# https://vitepress.dev/reference/default-theme-home-page
layout: home

tk:
  tkHome: false

hero:
  name: Teeker
  text: Vitepress 主题框架
  tagline: 一个轻量、简易的 Vitepress 主题框架
  actions:
    - theme: brand
      text: 开始
      link: /guild/intro
    - theme: alt
      text: 配置
      link: /config/theme
  image:
    src: /teeker-logo-large.png
    alt: Teeker

features:
  - title: 特性 A
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
  - title: 特性 B
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
  - title: 特性 C
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);

  --vp-home-hero-image-background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(44px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}
</style>
