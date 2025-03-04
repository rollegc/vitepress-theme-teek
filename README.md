# vitepress-theme-teeker

基础功能已完成开发，剩余加强功能请看下面的 TODO。

## 使用

项目拉取

```bash
git clone https://github.com/Kele-Bingtang/vitepress-theme-teeker.git
```

依赖安装（只能用 pnpm 安装依赖）

```bash
pnpm install
```

引用包构建

```bash
pnpm stub
```

项目启动（三选一）

```bash
# 基本文档 Demo
pnpm demo:base dev
# 多语言文档 Demo（默认语言的文档放到根目录下）
pnpm demo:locales dev
# 多语言文档 Demo（默认语言的文档放到指定目录下）
pnpm demo:localesRoot dev
```

## 配置

主题提供了大量的配置，可以在 `src/config/types.ts` 文件阅读配置项。

## TODO

- 主题使用文档编写
- 部署测试、线上效果测试
- 发布 NPM 库
- 支持无障碍
- 归档页添加 commit 图标风格，如：`http://niubin.site/archive.html`