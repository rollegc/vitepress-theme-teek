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
pnpm to:theme stub
```

使用文档项目启动

```bash
pnpm docs:dev
```

Demo 项目启动（三选一）

```bash
# 基本文档 Demo
pnpm demo:base dev
# 国际化文档 Demo（默认语言的文档放到根目录下）
pnpm demo:locales dev
# 国际化文档 Demo（默认语言的文档放到指定目录下）
pnpm demo:localesRoot dev
```

如果启动项目失败，则执行如下命令：

```base
pnpm plugin:build
```

## 配置

主题提供了大量的配置，可以在 `src/config/types.ts` 文件阅读配置项。

## TODO

- permalink 重新点击菜单不重新加载，permalink 导航栏同级文档访问不高亮问题
- Banner 支持半图背景
- 文章页添加 updateTime
- 代码块 codeBlock 配置没有关闭 md 文档和样式，支持官方 [xxx] 命名
- 新增、删除、修改 md 后自动重启，参考 Vitepress 修改 config 重启方式
- 主题使用文档编写
- 部署测试、线上效果测试
- 发布 NPM 库
- 支持无障碍
- 归档页添加 commit 图标风格，如：`http://niubin.site/archive.html`