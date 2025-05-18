<script setup lang="ts" name="Login">
import type { LoginInfo, Private } from "@teek/config";
import type { LoginForm, LoginFormItem } from "./login";
import { markRaw, reactive, ref } from "vue";
import { useData, useRouter } from "vitepress";
import { isClient } from "@teek/helper";
import { useNamespace, useLocale } from "@teek/hooks";
// @ts-ignore
import loginBgImg from "@teek/static/img/login_bg.png";
import { userIcon, lockIcon, successFilledIcon, refreshRightIcon } from "@teek/static";
import { useTeekConfig, usePosts } from "@teek/components/theme/ConfigProvider";
import { TkIcon } from "@teek/components/common/Icon";
import { TkMessage } from "@teek/components/common/Message";
import { TkVerifyCode } from "@teek/components/common/VerifyCode";
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

const imgCode = ref("");

const loginForm = reactive<LoginForm>({
  username: {
    model: "teek",
    focusModel: false,
    errorModel: false,
    icon: userIcon,
    placeholder: t("tk.login.usernamePlaceholder"),
    type: "text",
  },
  password: {
    model: "teek",
    focusModel: false,
    errorModel: false,
    icon: lockIcon,
    placeholder: t("tk.login.passwordPlaceholder"),
    type: "password",
  },
  verifyCode: {
    model: "",
    focusModel: false,
    errorModel: false,
    icon: lockIcon,
    placeholder: t("tk.login.verifyCodePlaceholder"),
    type: "text",
    append: markRaw(TkVerifyCode),
    appendModel: imgCode,
  },
});

/**
 * 校验登录表单
 */
const checkLoginForm = () => {
  if (loginForm.verifyCode.model === "") {
    loginForm.verifyCode.errorModel = true;
    TkMessage.warning({ message: t("tk.login.verifyCodeNonNull"), plain: true });
    return false;
  }

  if (loginForm.verifyCode.model !== imgCode.value) {
    loginForm.verifyCode.errorModel = true;
    TkMessage.error({ message: t("tk.login.verifyCodeError"), plain: true });
    return false;
  }

  if (loginForm.username.model === "" || loginForm.password.model === "") {
    loginForm.username.errorModel = true;
    TkMessage.warning({ message: t("tk.login.loginInfoNonNull"), plain: true });
    return false;
  }
  if (loginForm.password.model === "") {
    loginForm.password.errorModel = true;
    TkMessage.warning({ message: t("tk.login.loginInfoNonNull"), plain: true });
    return false;
  }
  return true;
};

/**
 * 获取过期时间，单位毫秒
 */
const getExpire = (expire?: string) => {
  // 默认 1 天
  if (!expire) return 86400000;

  if (expire.indexOf("d") !== -1) return parseInt(expire.replace("d", "")) * 24 * 60 * 60 * 1000; // 天
  if (expire.indexOf("h") !== -1) return parseInt(expire.replace("h", "")) * 60 * 60 * 1000; // 小时
  // 不加单位则为秒
  return parseInt(expire) * 1000;
};

/**
 * 重置表单
 */
const resetForm = () => {
  Object.values(loginForm).forEach(form => {
    form.model = "";
    form.focusModel = false;
  });
};

/**
 * 执行登录
 */
const login = () => {
  if (!isClient) return;

  const { enabled = false, site = [], pages = [], realm = {} } = privateConfig.value;
  // 如果登录功能成功，则默认登录成功，且直接跳转首页
  if (enabled) {
    TkMessage.success({ message: t("tk.login.loginSuccess"), plain: true });
    return router.go("/");
  }

  if (!checkLoginForm()) return;

  // 获取地址栏参数
  const { searchParams } = new URL(window.location.href);
  const verifyModeValue = searchParams.get(loginUrlKeyMap.verifyMode);
  const toPath = searchParams.get(loginUrlKeyMap.toPath);
  const realmValue = searchParams.get(loginUrlKeyMap.realm);

  const { doLogin } = privateConfig.value;
  const loginInfo = { username: loginForm.username.model, password: loginForm.password.model };

  let isLogin: boolean | undefined = false;

  // 根据不同的登录方式进行登录
  if (verifyModeValue === verifyModeMap.site) {
    const nativeLogin = () => execLogin(site, siteLoginKey, { isSite: true });
    isLogin = doLogin ? doLogin(loginInfo, "site", nativeLogin) : nativeLogin();
  } else if (verifyModeValue === verifyModeMap.pages) {
    const nativeLogin = () => execLogin(pages, pagesLoginKey);
    isLogin = doLogin ? doLogin(loginInfo, "pages", nativeLogin) : nativeLogin();
  } else if (verifyModeValue === verifyModeMap.realm && realmValue) {
    const nativeLogin = () => execLogin(realm[realmValue] || [], realmLoginKey, { isRealm: true, realm: realmValue });
    isLogin = doLogin ? doLogin(loginInfo, "realm", nativeLogin) : nativeLogin();
  } else if (verifyModeValue === verifyModeMap.page && toPath) {
    const nativeLogin = () => execLogin([], pageLoginKey, { toPath });
    isLogin = doLogin ? doLogin(loginInfo, "page", nativeLogin) : nativeLogin();
  }

  if (isLogin === undefined) return;

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

    if (pUsername && pPassword && pUsername === loginForm.username.model && pPassword === loginForm.password.model) {
      credential = { username: pUsername, password: pPassword, session, expire, strategy };
      storageKey = storageKey + post?.url;
    } else if (realm && privateConfig.value.realm) {
      // 如果来到此处，代表单页面级别认证失败，则换为为页面领域级别登录认证
      const nativeLogin = () => execLogin(privateConfig.value.realm![realm], realmLoginKey, { isRealm: true, realm });
      return privateConfig.value.doLogin
        ? privateConfig.value.doLogin({ username: pUsername, password: pPassword }, "realm", nativeLogin)
        : nativeLogin();
    } else return false;
  } else {
    // 此处为页面领域级别、共享页面级别的登录认证
    credential = credentialList.find(
      item => item.username === loginForm.username.model && item.password === loginForm.password.model
    );
  }

  if (!credential) return false;

  const { session, expire, strategy = "once", role = "common" } = credential;
  const storage = session || privateConfig.value.session ? sessionStorage : localStorage;
  const key = isRealm ? `${storageKey}${realm}` : storageKey;
  const encrypt = privateConfig.value.encrypt;

  // 将登录信息存储到 sessionStorage 或 localStorage 中
  storage.setItem(
    key,
    JSON.stringify({
      username: loginForm.username.model,
      password: encrypt ? encrypt(loginForm.password.model, frontmatter) : loginForm.password.model,
      loginTime: new Date().getTime(),
      expire:
        strategy === "always" ? new Date().getTime() + 30 * 1000 : getExpire(expire || privateConfig.value.expire),
      strategy: strategy || "once",
      ...(isSite && { role }), // 站点级别登录信息需要存储角色，如果为 admin，代表后续有所有的文章页面权限
    })
  );

  return true;
};

const handleFocus = (item: LoginFormItem, formName: "username" | "password" | "verifyCode") => {
  item.focusModel = true;
  item.errorModel = false;
  privateConfig.value.onFocus?.(item.model, formName);
};

const handleBlur = (item: LoginFormItem, formName: "username" | "password" | "verifyCode") => {
  item.focusModel = false;
  if (item.model === "") item.errorModel = true;
  privateConfig.value.onBlur?.(item.model, formName);
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
          <div v-for="(item, key) in loginForm" :key class="flx">
            <div :class="[ns.e('right__form'), ns.is('focus', item.focusModel), ns.is('error', item.errorModel)]">
              <TkIcon :icon="item.icon" />
              <label :for="'input-' + key" class="sr-only">{{ item.placeholder }}</label>
              <input
                v-model="item.model"
                :type="item.type"
                :class="ns.em('right__form', 'control')"
                :placeholder="item.placeholder"
                @focus="handleFocus(item, key)"
                @blur="handleBlur(item, key)"
                @keydown.enter="login"
              />
            </div>
            <component v-if="item.append" :is="item.append" v-model="item.appendModel" />
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
