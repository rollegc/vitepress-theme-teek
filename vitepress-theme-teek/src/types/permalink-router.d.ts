/// <reference types="vitepress" />

declare module "vitepress" {
  interface Router {
    to: (href?: string) => void;
    state: Record<string, any>;
  }
}

export {};
