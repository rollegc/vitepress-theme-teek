<script setup lang="ts" name="Login">
import type { LoginInfo, Private } from "@teek/config";
import { reactive, ref } from "vue";
import { useData, useRouter } from "vitepress";
import { isClient } from "@teek/helper";
import { useNamespace, useLocale } from "@teek/hooks";
// @ts-ignore
import loginBgImg from "@teek/static/img/login_bg.png";
import { userIcon, lockIcon, successFilledIcon, refreshRightIcon } from "@teek/static";
import { useTeekConfig, usePosts } from "@teek/components/theme/ConfigProvider";
import { TkIcon } from "@teek/components/common/Icon";
import { TkMessage } from "@teek/components/common/Message";
import { getLoginStorageKey, verifyModeMap, loginUrlKeyMap, defaultPrivateConfig } from "./login";

defineOptions({ name: "Login" });

const ns = useNamespace("login");
const router = useRouter();
const { frontmatter } = useData();
const posts = usePosts();
const { t } = useLocale();
const { getTeekConfigRef } = useTeekConfig();
const privateConfig = getTeekConfigRef<Private>("private", defaultPrivateConfig);

const { siteLoginKey, pagesLoginKey, pageLoginKey, realmLoginKey } = getLoginStorageKey();

const username = ref("teek");
const password = ref("teek");
const focus = reactive({ username: false, password: false });

const loginForm = ref([
  {
    model: username,
    focusModel: focus.username,
    icon: userIcon,
    placeholder: t("tk.login.usernamePlaceholder"),
    type: "text",
  },
  {
    model: password,
    focusModel: focus.password,
    icon: lockIcon,
    placeholder: t("tk.login.passwordPlaceholder"),
    type: "password",
  },
]);

/**
 * 获取过期时间，单位毫秒
 */
const getExpire = (expire?: string) => {
  // 默认 1 天
  let expireTime = 86400000;

  if (!expire) return expireTime;

  if (expire.indexOf("d") !== -1) {
    expireTime = parseInt(expire.replace("d", "")) * 24 * 60 * 60 * 1000; // 天
  } else if (expire.indexOf("h") !== -1) {
    expireTime = parseInt(expire.replace("h", "")) * 60 * 60 * 1000; // 小时
  } else expireTime = parseInt(expire) * 1000; // 不加单位则为秒

  return expireTime;
};

/**
 * 重置表单
 */
const resetForm = () => {
  loginForm.value.forEach(item => {
    item.model = "";
    item.focusModel = false;
  });
};

/**
 * 执行登录
 */
const login = () => {
  if (!isClient) return;

  const { enabled = false, site = [], page = [], realm = {} } = privateConfig.value;
  // 如果登录功能成功，则默认登录成功，且直接跳转首页
  if (enabled) {
    TkMessage.success({ message: t("tk.login.loginSuccess"), plain: true });
    return router.go("/");
  }

  if (!username.value || !password.value) {
    return TkMessage.warning({ message: t("tk.login.loginInfoNull"), plain: true });
  }

  // 获取地址栏参数
  const { searchParams } = new URL(window.location.href);
  const verifyModeValue = searchParams.get(loginUrlKeyMap.verifyMode);
  const toPath = searchParams.get(loginUrlKeyMap.toPath);
  const realmValue = searchParams.get(loginUrlKeyMap.realm);

  let isLogin = false;

  // 根据不同的登录方式进行登录
  if (verifyModeValue === verifyModeMap.site) isLogin = execLogin(site, siteLoginKey, { isSite: true });
  else if (verifyModeValue === verifyModeMap.pages) isLogin = execLogin(page, pagesLoginKey);
  else if (verifyModeValue === verifyModeMap.page && toPath) isLogin = execLogin([], pageLoginKey, { toPath });
  else if (verifyModeValue === verifyModeMap.realm && realmValue) {
    isLogin = execLogin(realm[realmValue] || [], realmLoginKey, { isRealm: true, realm: realmValue });
  }

  if (isLogin) {
    TkMessage.success({ message: t("tk.login.loginSuccess"), plain: true });

    if (toPath) router.go(toPath);
  } else TkMessage.error({ message: t("tk.login.loginError"), plain: true });
};

/**
 * 执行登录核心逻辑
 */
const execLogin = (
  credentialList: (LoginInfo & { role?: string })[],
  storageKey: string,
  options: { isRealm?: boolean; realm?: string; isSite?: boolean; toPath?: string } = {}
) => {
  const { isSite = false, isRealm = false, realm, toPath } = options;

  let credential: (typeof credentialList)[0] | undefined;

  // 如果是单页面级别登录认证，则需要遍历所有文章信息，找出当前页面的登录信息
  if (toPath) {
    const post = posts.value.originPosts.find(post => [post.frontmatter.permalink, post.url].includes(toPath));
    const { username: pUsername, password: pPassword, session, expire, strategy, realm } = post?.frontmatter || {};

    if (pUsername && pPassword && pUsername === username.value && pPassword === password.value) {
      credential = { username: pUsername, password: pPassword, session, expire, strategy };
      storageKey = storageKey + post?.url;
    } else if (realm && privateConfig.value.realm) {
      // 如果来到此处，代表单页面级别认证失败，则换为为页面领域级别登录认证
      return execLogin(privateConfig.value.realm[realm], realmLoginKey, { isRealm: true, realm });
    } else return false;
  } else {
    // 此处为页面领域级别、共享页面级别的登录认证
    credential = credentialList.find(item => item.username === username.value && item.password === password.value);
  }

  if (!credential) return false;

  const { session, expire, strategy = "once", role = "common" } = credential;
  const storage = session || privateConfig.value.session ? sessionStorage : localStorage;
  const key = isRealm ? `${storageKey}${realm}` : storageKey;

  // 将登录信息存储到 sessionStorage 或 localStorage 中
  storage.setItem(
    key,
    JSON.stringify({
      username: username.value,
      password: password.value,
      loginTime: new Date().getTime(),
      expire:
        strategy === "always" ? new Date().getTime() + 30 * 1000 : getExpire(expire || privateConfig.value.expire),
      strategy: strategy || "once",
      ...(isSite && { role }), // 站点级别登录信息需要存储角色，如果为 admin，代表后续有所有的文章页面权限
    })
  );

  return true;
};
</script>

<template>
  <div :class="ns.b()" :aria-label="t('tk.login.label')">
    <div :class="ns.e('wrapper')">
      <div :class="ns.e('left')">
        <img :src="loginBgImg" alt="login" />
      </div>

      <div :class="ns.e('right')">
        <div :class="[ns.e('right__header'), 'flx-center']">
          <img v-if="frontmatter.logo" :src="frontmatter.logo" alt="logo" />
          <span class="title">{{ frontmatter.name ?? "VitePress Theme Teek" }}</span>
        </div>

        <form class="flx-space-y-20">
          <div
            :class="[ns.e('right__form'), ns.is('focus', item.focusModel)]"
            v-for="(item, index) in loginForm"
            :key="index"
          >
            <TkIcon :icon="item.icon" />
            <label :for="'input-' + index" class="sr-only">{{ item.placeholder }}</label>
            <input
              v-model="item.model"
              :type="item.type"
              :class="ns.em('right__form', 'control')"
              :placeholder="item.placeholder"
              @focus="() => (item.focusModel = true)"
              @blur="() => (item.focusModel = false)"
              @keydown.enter="login"
            />
          </div>

          <div :class="ns.e('right__form__btn')">
            <button type="button" @click="resetForm()" class="flx-center" :aria-label="t('tk.login.reset')">
              <TkIcon :icon="refreshRightIcon" />
              <span>{{ t("tk.login.reset") }}</span>
            </button>
            <button
              type="button"
              :icon="successFilledIcon"
              @click="login()"
              class="flx-center primary"
              :aria-label="t('tk.login.login')"
            >
              <TkIcon :icon="successFilledIcon" />
              <span>{{ t("tk.login.login") }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
