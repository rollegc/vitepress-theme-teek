import type { Private } from "@teek/config";
import { isClient } from "@teek/helper";

/**
 * 获取登录状态的存储键
 */
export const getLoginStorageKey = () => {
  if (!isClient) return { siteLoginKey: "", pagesLoginKey: "", pageLoginKey: "", realmLoginKey: "" };

  const siteLoginKey = `teek:private:site:${window.location.hostname}`;
  const pagesLoginKey = `teek:private:pages:${window.location.hostname}`;
  const pageLoginKey = `teek:private:page:${window.location.hostname}:`;
  const realmLoginKey = `teek:private:realm:${window.location.hostname}:`;

  return { siteLoginKey, pagesLoginKey, pageLoginKey, realmLoginKey };
};

// 跳转到登录页时 url 可携带的参数
export const loginUrlKeyMap = {
  realm: "realm",
  toPath: "toPath",
  verifyMode: "verifyMode",
};

// 支持的认证级别
export const verifyModeMap = {
  site: "site",
  pages: "pages",
  page: "page",
  realm: "realm",
};

// 私密认证配置的默认值，重置用到
export const defaultPrivateConfig: Private = {
  enabled: false,
  expire: "1d",
  session: false,
  siteLogin: false,
  site: [],
  page: [],
  realm: {},
};
