/// <reference types="vitepress" />

declare module "vitepress" {
  interface Router {
    to: (href?: string) => void;
  }
}

export {};
