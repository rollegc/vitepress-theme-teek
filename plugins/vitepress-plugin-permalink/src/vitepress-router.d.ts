/// <reference types="vitepress" />

declare module "vitepress" {
  interface Router {
    push: (href?: string, isPermalink?: boolean) => void;
  }
}

export {};

// 对所有以 virtual-dates: 开头的模块声明共同的类型
declare module "virtual:not-found-option" {}
