// .vitepress/config.ts
import { defineConfig } from "file:///E:/%E9%A1%B9%E7%9B%AE%E5%8C%BA/VSCodeProjects/MyProjects/vitepress-theme-teek/node_modules/.pnpm/vitepress@1.6.3_@algolia+cl_b61d29432dccfe08909ddc1fe7aed12e/node_modules/vitepress/dist/node/index.js";

// ../packages/config/index.ts
import Sidebar from "file:///E:/%E9%A1%B9%E7%9B%AE%E5%8C%BA/VSCodeProjects/MyProjects/vitepress-theme-teek/plugins/vitepress-plugin-sidebar-resolve/dist/index.mjs";
import Permalink from "file:///E:/%E9%A1%B9%E7%9B%AE%E5%8C%BA/VSCodeProjects/MyProjects/vitepress-theme-teek/plugins/vitepress-plugin-permalink/dist/index.mjs";
import MdH1 from "file:///E:/%E9%A1%B9%E7%9B%AE%E5%8C%BA/VSCodeProjects/MyProjects/vitepress-theme-teek/plugins/vitepress-plugin-md-h1/dist/index.mjs";
import Catalogue from "file:///E:/%E9%A1%B9%E7%9B%AE%E5%8C%BA/VSCodeProjects/MyProjects/vitepress-theme-teek/plugins/vitepress-plugin-catalogue/dist/index.mjs";
import DocAnalysis from "file:///E:/%E9%A1%B9%E7%9B%AE%E5%8C%BA/VSCodeProjects/MyProjects/vitepress-theme-teek/plugins/vitepress-plugin-doc-analysis/dist/index.mjs";
import FileContentLoader from "file:///E:/%E9%A1%B9%E7%9B%AE%E5%8C%BA/VSCodeProjects/MyProjects/vitepress-theme-teek/plugins/vitepress-plugin-file-content-loader/dist/index.mjs";
import AutoFrontmatter from "file:///E:/%E9%A1%B9%E7%9B%AE%E5%8C%BA/VSCodeProjects/MyProjects/vitepress-theme-teek/plugins/vitepress-plugin-auto-frontmatter/dist/index.mjs";

// ../packages/config/post/index.ts
import { getTitleFromMd } from "file:///E:/%E9%A1%B9%E7%9B%AE%E5%8C%BA/VSCodeProjects/MyProjects/vitepress-theme-teek/plugins/vitepress-plugin-sidebar-resolve/dist/index.mjs";
import { basename, join } from "node:path";
import { statSync } from "node:fs";
import { formatDate } from "file:///E:/%E9%A1%B9%E7%9B%AE%E5%8C%BA/VSCodeProjects/MyProjects/vitepress-theme-teek/packages/helper/dist/index.mjs";

// ../packages/config/post/helper.ts
var filterPosts = (posts) => {
  return posts.filter(({ frontmatter: { article, layout } }) => article !== false && layout !== "home");
};
var getSortPostsByDateAndSticky = (posts) => {
  const p = [...posts];
  return p.sort((prev, next) => {
    const prevSticky = prev.frontmatter.sticky;
    const nextSticky = next.frontmatter.sticky;
    if (prevSticky && nextSticky) return prevSticky === nextSticky ? compareDate(prev, next) : prevSticky - nextSticky;
    if (prevSticky) return -1;
    if (nextSticky) return 1;
    return compareDate(prev, next);
  });
};
var getSortPostsByDate = (posts) => {
  const p = [...posts];
  return p.sort((prev, next) => compareDate(prev, next));
};
var getGroupPosts = (posts) => {
  const categoriesObj = {};
  const tagsObj = {};
  posts.forEach((post) => {
    const { categories, tags } = post.frontmatter;
    [categories || []].flat().forEach((category) => {
      if (category) {
        if (!categoriesObj[category]) categoriesObj[category] = [];
        categoriesObj[category].push(post);
      }
    });
    [tags || []].flat().forEach((tag) => {
      if (tag) {
        if (!tagsObj[tag]) tagsObj[tag] = [];
        tagsObj[tag].push(post);
      }
    });
  });
  return {
    categories: categoriesObj,
    tags: tagsObj
  };
};
var getGroupCards = (groupPosts) => {
  const categoriesArr = [];
  const tagsArr = [];
  for (const key in groupPosts.categories) categoriesArr.push({ name: key, length: groupPosts.categories[key].length });
  for (const key in groupPosts.tags) tagsArr.push({ name: key, length: groupPosts.tags[key].length });
  return {
    categories: categoriesArr,
    tags: tagsArr
  };
};
var getPostsTime = (post) => {
  const dateStr = post.date;
  const date = dateStr ? new Date(dateStr) : /* @__PURE__ */ new Date();
  if (date === "Invalid Date" && dateStr) {
    return new Date(dateStr.replace(/-/g, "/")).getTime();
  }
  return date.getTime();
};
var compareDate = (prev, next) => {
  return getPostsTime(next) - getPostsTime(prev);
};
var groupByYear = (posts) => {
  return posts.reduce(
    (pre, cur) => {
      const year = new Date(cur.date || cur.frontmatter.date).getFullYear() + " ";
      if (!pre[year]) pre[year] = [];
      pre[year].push(cur);
      return pre;
    },
    {}
  );
};
var groupByYearMonth = (posts) => {
  return posts.reduce(
    (pre, cur) => {
      const date = new Date(cur.date || cur.frontmatter.date);
      const year = date.getFullYear() + " ";
      const month = String(date.getMonth() + 1).padStart(2, "0");
      if (!pre[year]) pre[year] = {};
      if (!pre[year][month]) pre[year][month] = [];
      pre[year][month].push(cur);
      return pre;
    },
    {}
  );
};

// ../packages/config/post/index.ts
import matter from "file:///E:/%E9%A1%B9%E7%9B%AE%E5%8C%BA/VSCodeProjects/MyProjects/vitepress-theme-teek/node_modules/.pnpm/gray-matter@4.0.3/node_modules/gray-matter/index.js";
var transformData = (data) => {
  const siteConfig = globalThis.VITEPRESS_CONFIG;
  const { themeConfig } = siteConfig.userConfig;
  const { frontmatter, url, excerpt } = data;
  if (frontmatter.date) frontmatter.date = formatDate(frontmatter.date);
  return {
    url,
    frontmatter,
    author: themeConfig.author,
    title: getTitle(data),
    date: getDate(data, siteConfig.srcDir),
    excerpt,
    capture: getCaptureText(data)
  };
};
var transformRaw = (posts) => {
  const siteConfig = globalThis.VITEPRESS_CONFIG;
  const { locales = {} } = siteConfig.userConfig;
  const postsData = resolvePosts(posts);
  const localesKeys = Object.keys(locales);
  if (!localesKeys.length) return postsData;
  const postsLocale = {};
  localesKeys.filter((localesKey) => localesKey !== "root").forEach((localesKey) => {
    const localePosts = posts.filter((post) => post.url.startsWith(`/${localesKey}`));
    postsLocale[localesKey] = resolvePosts(localePosts);
  });
  const rootPosts = posts.filter((post) => !localesKeys.some((localesKey) => post.url.startsWith(`/${localesKey}`)));
  postsLocale["root"] = resolvePosts(rootPosts);
  return { ...postsData, locales: postsLocale };
};
var resolvePosts = (posts) => {
  const originPosts = filterPosts(posts);
  const sortPostsByDateAndSticky = getSortPostsByDateAndSticky(originPosts);
  const sortPostsByDate = getSortPostsByDate(originPosts);
  const groupPostsByYear = groupByYear(sortPostsByDate);
  const groupPostsByYearMonth = groupByYearMonth(sortPostsByDate);
  const groupPosts = getGroupPosts(sortPostsByDateAndSticky);
  const groupCards = getGroupCards(groupPosts);
  return {
    originPosts,
    sortPostsByDateAndSticky,
    sortPostsByDate,
    groupPostsByYear,
    groupPostsByYearMonth,
    groupPosts,
    groupCards
  };
};
function getTitle(post) {
  if (post.frontmatter.title) return post.frontmatter.title;
  const { content = "" } = matter(post.src || "", {});
  const splitName = basename(post.url).split(".");
  const name = splitName.length > 1 ? splitName[1] : splitName[0];
  return getTitleFromMd(content) || name || "";
}
function getDate(post, srcDir) {
  const { frontmatter, url } = post;
  if (frontmatter.date) return frontmatter.date;
  const filePath = join(srcDir, `${url.endsWith("/") ? `${url}/index` : url.replace(/\.html$/, "")}.md`);
  const stat = statSync(filePath);
  return formatDate(stat.birthtime || stat.atime);
}
var getCaptureText = (post, count = 400) => {
  const { content = "" } = matter(post.src || "", {});
  return content?.replace(/^#+\s+.*/, "")?.replace(/#/g, "")?.replace(/!\[.*?\]\(.*?\)/g, "")?.replace(/\[(.*?)\]\(.*?\)/g, "$1")?.replace(/\*\*(.*?)\*\*/g, "$1")?.replace(/\[\[TOC\]\]/g, "")?.replace(/:::.*?(\n|$)/g, "")?.replace(/<!-- more -->/g, "")?.split("\n")?.filter((v) => !!v)?.join("\n")?.replace(/>(.*)/, "")?.replace(/</g, "&lt;").replace(/>/g, "&gt;")?.trim()?.slice(0, count);
};

// ../packages/markdown/plugins/todo.ts
var todoUncheck = "[ ] ";
var todoCheck = "[x] ";
var todoPlugin = (md) => {
  md.renderer.rules.list_item_open = (tokens, idx, options, _, self) => {
    for (let i = idx + 1; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.type === "list_item_close") break;
      const content = token.content;
      if (content?.startsWith(todoUncheck) || content?.startsWith(todoCheck)) {
        const isChecked = content.startsWith(todoCheck);
        const checkbox = `<input class="todo-checkbox" type="checkbox" ${isChecked ? "checked" : ""} disabled />`;
        const text = content.slice(4);
        token.content = text;
        if (token.children) token.children[0].content = text;
        return `<li class="todo">${checkbox}`;
      }
    }
    return self.renderToken(tokens, idx, options);
  };
};
var todo_default = todoPlugin;

// ../packages/markdown/helper/simpleContainer.ts
import container from "file:///E:/%E9%A1%B9%E7%9B%AE%E5%8C%BA/VSCodeProjects/MyProjects/vitepress-theme-teek/node_modules/.pnpm/markdown-it-container@4.0.0/node_modules/markdown-it-container/index.mjs";
var createContainerThenGet = (md, option) => {
  const { type: type2, useTitle, defaultTitle, className } = option;
  return [
    container,
    type2,
    {
      render(tokens, idx) {
        const token = tokens[idx];
        const info = token.info.trim().slice(type2.length).trim();
        if (token.nesting === 1) {
          const title = useTitle ? md.renderInline(info || defaultTitle || "") : "";
          return `<div class="${type2} ${className}">${useTitle ? `<p class="title ${type2}-title ${className ? `${className}-title` : ""}">${title}</p>` : ""}
`;
        } else return `</div>
`;
      }
    }
  ];
};
var createContainersThenUse = (md, options) => {
  options.forEach((option) => {
    md.use(...createContainerThenGet(md, option));
  });
};

// ../packages/markdown/helper/cardContainer.ts
import container2 from "file:///E:/%E9%A1%B9%E7%9B%AE%E5%8C%BA/VSCodeProjects/MyProjects/vitepress-theme-teek/node_modules/.pnpm/markdown-it-container@4.0.0/node_modules/markdown-it-container/index.mjs";
import yaml from "file:///E:/%E9%A1%B9%E7%9B%AE%E5%8C%BA/VSCodeProjects/MyProjects/vitepress-theme-teek/node_modules/.pnpm/js-yaml@4.1.0/node_modules/js-yaml/dist/js-yaml.mjs";
var createCardContainer = (md, option) => {
  const { type: type2, className, beforeHtmlRender, htmlRender, afterHtmlRender, transformHtml } = option;
  md.use(container2, type2, {});
  md.renderer.rules[`container_${type2}_open`] = (tokens, idx) => {
    const containerToken = tokens[idx];
    let html = `<div class="${className || `${type2}-container`}">`;
    for (let i = idx; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.type === `container_${type2}_close`) break;
      if (!["yaml", "yml"].includes(token.info)) continue;
      const yamlContent = yaml.load(token.content.trim());
      let data = [];
      let config = {};
      if (Array.isArray(yamlContent)) data = yamlContent;
      else {
        data = yamlContent.data || [];
        config = yamlContent.config || {};
      }
      const info = containerToken.info.trim().slice(type2.length).trim();
      const result = beforeHtmlRender?.({ data, config }, info, tokens, i);
      if (result === false) continue;
      html += htmlRender({ data, config }, info, tokens, i);
      afterHtmlRender?.({ data, config }, info, tokens, i);
    }
    html = transformHtml?.(html) ?? html;
    return html;
  };
};

// ../packages/markdown/plugins/container.ts
var containerPlugin = (md, containerLabel) => {
  const markdownContainer = [
    { type: "center", useTitle: false, className: `tk-center-container` },
    { type: "right", useTitle: false, className: `tk-right-container` },
    { type: "note", useTitle: true, defaultTitle: containerLabel?.noteLabel || "NOTE", className: `custom-block` }
  ];
  createContainersThenUse(md, markdownContainer);
};
var container_default = containerPlugin;

// ../packages/markdown/plugins/shareCard.ts
import { withBase } from "file:///E:/%E9%A1%B9%E7%9B%AE%E5%8C%BA/VSCodeProjects/MyProjects/vitepress-theme-teek/packages/helper/dist/index.mjs";
var rootClass = "share-card";
var shareCardPlugin = (md) => {
  const siteConfig = globalThis.VITEPRESS_CONFIG;
  const { base = "/" } = siteConfig.userConfig;
  createCardContainer(md, {
    type: "shareCard",
    className: `container ${rootClass}-container`,
    htmlRender: (props, info) => renderShareCard(props, info, base),
    afterHtmlRender: (props, _, tokens, idx) => {
      if (props.config.showCode !== true) {
        tokens[idx].type = "";
        tokens[idx].tag = "";
        tokens[idx].hidden = true;
      }
    }
  });
};
var renderShareCard = (shareCard, info, base) => {
  const { data = [], config = {} } = shareCard;
  if (!data.length) return "";
  const { cardNum: defaultNum = 2, cardGap = 20, target = "_blank" } = config;
  let cardNum = info && typeof info !== "string" ? Number(info) : defaultNum;
  if (cardNum > 4 || cardNum < 1) cardNum = defaultNum;
  const index = info === "auto" ? "auto" : cardNum;
  return `
    <div
        class="${rootClass} index-${index}"
        style="--row-gap: ${cardGap}px; --column-gap: ${cardGap}px; --column-min-width: calc(100% / ${cardNum} - ${cardGap * (cardNum - 1)}px);"
    >
      ${data.map(
    (card) => `
            <${card.link ? "a" : "span"}
              href="${withBase(base, card.link)}" target=${target}
              class="${rootClass}__item ${cardNum ? `row-${cardNum}` : ""}"
              style="--item-bg-color: ${card.bgColor || "var(--vp-c-gray-1)"}; --item-text-color: ${card.textColor || "var(--vp-c-text-1)"};"
             >
              ${card.avatar ? `<img src="${withBase(base, card.avatar)}" alt="${card.name}">` : ""}
              <div>
                <p class="name">${card.name}</p>
                <p class="desc">${card.desc}</p>
              </div>
            </${card.link ? "a" : "span"}>
          `
  ).join("")}
    </div>
  `;
};
var shareCard_default = shareCardPlugin;

// ../packages/markdown/plugins/imgCard.ts
import { withBase as withBase2 } from "file:///E:/%E9%A1%B9%E7%9B%AE%E5%8C%BA/VSCodeProjects/MyProjects/vitepress-theme-teek/packages/helper/dist/index.mjs";
var rootClass2 = "img-card";
var imgCardPlugin = (md) => {
  const siteConfig = globalThis.VITEPRESS_CONFIG;
  const { base = "/" } = siteConfig.userConfig;
  createCardContainer(md, {
    type: "imgCard",
    className: `container ${rootClass2}-container`,
    htmlRender: (props, info) => renderImgCard(props, info, base),
    afterHtmlRender: (props, _, tokens, idx) => {
      if (props.config.showCode !== true) {
        tokens[idx].type = "";
        tokens[idx].tag = "";
        tokens[idx].hidden = true;
      }
    }
  });
};
var renderImgCard = (imgCard, info, base) => {
  const { data = [], config = {} } = imgCard;
  if (!data.length) return "";
  const {
    cardNum: defaultNum = 2,
    cardGap = 20,
    lineClamp = 2,
    target = "_blank",
    objectFit = "cover",
    imgHeight = "auto"
  } = config;
  let cardNum = info && typeof info !== "string" ? Number(info) : defaultNum;
  if (cardNum > 4 || cardNum < 1) cardNum = defaultNum;
  const index = info === "auto" ? "auto" : cardNum;
  return `
    <div
      class="${rootClass2} index-${index}"
      style="--row-gap: ${cardGap}px; --column-gap: ${cardGap}px; --column-min-width: calc(100% / ${cardNum} - ${cardGap * (cardNum - 1)}px);"
    >
      ${data.map(
    (card) => `
            <${card.link ? "a" : "span"}
              href="${withBase2(base, card.link)}"
              target="${target}"
              class="${rootClass2}__item ${cardNum ? `row-${cardNum}` : ""}"
              style="--img-height: ${imgHeight}; --img-object-fit: ${objectFit}; --desc-line-clamp: ${lineClamp}"
            >
              <div class="${rootClass2}__item__img">
                <img src="${withBase2(base, card.img)}">
              </div>
              <div class="${rootClass2}__item__info">
                  <p class="name">${card.name}</p>
                  ${card.desc ? `<p class="desc">${card.desc}</p>` : ""}
              </div>
              ${card.avatar || card.author ? `<div class="${rootClass2}__item__footer">
                      ${card.avatar ? `<img src="${withBase2(base, card.avatar)}">` : ""}
                      ${card.author ? `<span>${card.author}</span>` : ""}
                    </div>` : ""}
            </${card.link ? "a" : "span"}>
          `
  ).join("")}
    </div>
  `;
};
var imgCard_default = imgCardPlugin;

// ../packages/markdown/plugins/navCard.ts
import { withBase as withBase3 } from "file:///E:/%E9%A1%B9%E7%9B%AE%E5%8C%BA/VSCodeProjects/MyProjects/vitepress-theme-teek/packages/helper/dist/index.mjs";
var rootClass3 = "nav-card";
var navCardPlugin = (md) => {
  const siteConfig = globalThis.VITEPRESS_CONFIG;
  const { base = "/" } = siteConfig.userConfig;
  createCardContainer(md, {
    type: "navCard",
    className: `container ${rootClass3}-container`,
    htmlRender: (props, info) => getNavCardHtml(props, info, base),
    afterHtmlRender: (props, _, tokens, idx) => {
      if (props.config.showCode !== true) {
        tokens[idx].type = "";
        tokens[idx].tag = "";
        tokens[idx].hidden = true;
      }
    }
  });
};
var getNavCardHtml = (navCard, info, base) => {
  const { data = [], config = {} } = navCard;
  if (!data.length) return "";
  const { cardNum: defaultNum = 2, cardGap = 20, lineClamp = 2, target = "_blank" } = config;
  let cardNum = info && typeof info !== "string" ? Number(info) : defaultNum;
  if (cardNum > 4 || cardNum < 1) cardNum = defaultNum;
  const index = info === "auto" ? "auto" : cardNum;
  return `
    <div
      class="${rootClass3} index-${index}"
      style="--row-gap: ${cardGap}px; --column-gap: ${cardGap}px; --column-min-width: calc(100% / ${cardNum} - ${cardGap * (cardNum - 1)}px);"
    >
      ${data.map(
    (card) => `
            <${card.link ? "a" : "span"}
              href="${card.link}" target="${target}"
              class="${rootClass3}__item"
              style="--desc-line-clamp: ${lineClamp}"
            >
              <div class="${rootClass3}__item__info">
                ${card.img ? `<img src="${withBase3(base, card.img)}">` : ""}
                <span class="name">${card.name}</span>
              </div>

              <p class="desc">${card.desc}</p>
              ${card.badge ? `<span class="VPBadge ${card.badgeType || "info"} badge">${card.badge}</span>` : ""}
            </${card.link ? "a" : "span"}>
        `
  ).join("")}
      </div>`;
};
var navCard_default = navCardPlugin;

// ../packages/markdown/plugins/demo.ts
import { readFileSync } from "fs";
import { join as join2, resolve, posix } from "path";
import container3 from "file:///E:/%E9%A1%B9%E7%9B%AE%E5%8C%BA/VSCodeProjects/MyProjects/vitepress-theme-teek/node_modules/.pnpm/markdown-it-container@4.0.0/node_modules/markdown-it-container/index.mjs";
var demoPlugin = (md, option = {}) => {
  const siteConfig = globalThis.VITEPRESS_CONFIG;
  const srcDir = siteConfig.srcDir;
  const path = "examples";
  const demoPath = join2(srcDir, path);
  const options = {
    validate(params) {
      return !!params.trim().match(/^demo\s*(.*)$/);
    },
    render(tokens, idx) {
      const desc = tokens[idx].info.trim().match(/^demo\s*(.*)$/);
      if (tokens[idx].nesting === 1) {
        const description2 = desc && desc.length > 1 ? desc[1] : "";
        const sourceFileToken = tokens[idx + 2];
        let source = "";
        const containerContent = sourceFileToken.children?.[0].content ?? "";
        const sourceFile = containerContent ? `${containerContent.replace(/.vue$/, "")}.vue` : "";
        if (sourceFile && sourceFileToken.type === "inline") {
          source = readFileSync(resolve(demoPath, sourceFile), "utf-8");
        }
        if (!source) throw new Error(`Incorrect source file path: ${sourceFile}`);
        return `<TkDemoCode source="${encodeURIComponent(
          md.render(`\`\`\` vue
${source}\`\`\``)
        )}" path="${posix.join(path, sourceFile)}" raw-source="${encodeURIComponent(
          source
        )}" description="${encodeURIComponent(md.render(description2))}" demo="${encodeURIComponent(JSON.stringify(option))}">`;
      } else return "</TkDemoCode>";
    }
  };
  md.use(container3, "demo", options);
};
var demo_default = demoPlugin;

// ../packages/markdown/plugins/video.ts
import container4 from "file:///E:/%E9%A1%B9%E7%9B%AE%E5%8C%BA/VSCodeProjects/MyProjects/vitepress-theme-teek/node_modules/.pnpm/markdown-it-container@4.0.0/node_modules/markdown-it-container/index.mjs";
var type = "video";
var videoPlugin = (md) => {
  md.use(container4, type, {});
  md.renderer.rules[`container_${type}_open`] = (tokens, idx) => {
    const containerToken = tokens[idx];
    const info = containerToken.info.trim().slice(type.length).trim();
    const contentToken = tokens[idx + 2];
    const content = contentToken.content.trim() || "";
    const video = info ? videoMap[info] : { src: () => content, title: "Custom video player" };
    contentToken.type = "";
    contentToken.tag = "";
    contentToken.hidden = true;
    return `<div class="${`${type}-container`}">
      <iframe
        class="video-iframe"
        loading="lazy"
        src="${video.src(content)}"
        title="${video.title}"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen;"
        allowfullscreen="true"
      />
    `;
  };
};
var videoMap = {
  bilibili: {
    src: (id) => `https://player.bilibili.com/player.html?bvid=${id}&autoplay=0`,
    title: "Bilibili video player"
  },
  tencent: {
    src: (id) => `https://v.qq.com/txp/iframe/player.html?vid=${id}`,
    title: "Tencent Video player"
  },
  youku: {
    src: (id) => `https://player.youku.com/embed/${id}`,
    title: "Youku video player"
  },
  youtube: {
    src: (id) => `https://www.youtube-nocookie.com/embed/${id}`,
    title: "YouTube video player"
  },
  vimeo: {
    src: (id) => `https://player.vimeo.com/video/${id}`,
    title: "Vimeo video player"
  },
  xigua: {
    src: (id) => `https://www.ixigua.com/iframe/${id}`,
    title: "XiGua video player"
  }
};
var video_default = videoPlugin;

// ../packages/config/addFrontmatter.ts
var createPermalink = (permalinkPrefix = "") => {
  let finalPermalinkPrefix = permalinkPrefix;
  if (!finalPermalinkPrefix.startsWith("/")) finalPermalinkPrefix = "/" + finalPermalinkPrefix;
  if (!finalPermalinkPrefix.endsWith("/")) finalPermalinkPrefix = finalPermalinkPrefix + "/";
  return {
    permalink: `${finalPermalinkPrefix}${(Math.random() + Math.random()).toString(16).slice(2, 8)}`
  };
};
var createCategory = (fileInfo, ignore = []) => {
  const siteConfig = globalThis.VITEPRESS_CONFIG;
  const { locales = {} } = siteConfig.userConfig;
  const relativePathArr = fileInfo.relativePath.split("/");
  const categories = [];
  relativePathArr.forEach((item, index) => {
    const filename = item.replace(/^\d+\./, "").split(".")?.[0] || "";
    if (index !== relativePathArr.length - 1 && !locales[filename] && !ignore.includes(filename))
      categories.push(filename);
  });
  return { categories: categories.length ? categories : [""] };
};

// ../packages/config/index.ts
var defineTeekConfig = (config = {}) => {
  const { vitePlugins, markdown = {}, ...teekConfig2 } = config;
  const {
    sidebar = true,
    sidebarOption = {},
    permalink = true,
    permalinkOption = {},
    mdH1 = true,
    mdH1Option = {},
    catalogueOption = {},
    docAnalysis = true,
    docAnalysisOption = {},
    fileContentLoaderIgnore = [],
    autoFrontmatter = false,
    autoFrontmatterOption = {}
  } = vitePlugins || {};
  const plugins = [];
  const ignoreDir = {
    autoFrontmatter: ["**/@pages/**", "**/.scripts/**"],
    sidebar: ["@pages", "@fragment", "examples", ".scripts"],
    mdH1: ["@pages", ".scripts"],
    docAnalysis: ["@pages", /目录页/, ".scripts"],
    fileContentLoader: ["**/components/**", "**/.vitepress/**", "**/public/**", "**/*\u76EE\u5F55\u9875*/**", "**/.scripts/**"]
  };
  if (autoFrontmatter) {
    const {
      pattern,
      globOptions = {},
      transform,
      permalinkPrefix = "pages",
      categories = true
    } = autoFrontmatterOption;
    if (!pattern) autoFrontmatterOption.pattern = "**/*.md";
    autoFrontmatterOption.globOptions = {
      ...autoFrontmatterOption.globOptions,
      ignore: [...ignoreDir.autoFrontmatter, ...globOptions.ignore || []]
    };
    autoFrontmatterOption.transform = (frontmatter, fileInfo) => {
      let transformResult = transform?.(frontmatter, fileInfo) || {};
      if (permalink && !frontmatter.permalink) {
        transformResult = { ...transformResult, ...createPermalink(permalinkPrefix) };
      }
      if (categories && !frontmatter.categories) {
        transformResult = { ...transformResult, ...createCategory(fileInfo, ["@fragment"]) };
      }
      return Object.keys(transformResult).length ? { ...frontmatter, ...transformResult } : void 0;
    };
    plugins.push(AutoFrontmatter(autoFrontmatterOption));
  }
  if (sidebar) {
    sidebarOption.ignoreList = [...sidebarOption?.ignoreList || [], ...ignoreDir.sidebar];
    plugins.push(Sidebar(sidebarOption));
  }
  if (permalink) {
    plugins.push(...Permalink({ permalinkOption, notFoundOption: permalinkOption }));
  }
  if (mdH1) {
    const selfBeforeInject = mdH1Option.beforeInject;
    mdH1Option.beforeInject = (frontmatter, id, title) => {
      if (frontmatter.layout === "cataloguePage" || frontmatter.catalogue) return false;
      if (frontmatter.layout === "archivesPage" || frontmatter.archivesPage) return false;
      return selfBeforeInject?.(frontmatter, id, title);
    };
    mdH1Option.ignoreList = [...mdH1Option?.ignoreList || [], ...ignoreDir.mdH1];
    plugins.push(MdH1(mdH1Option));
  }
  if (docAnalysis) {
    docAnalysisOption.ignoreList = [...sidebarOption?.ignoreList || [], ...ignoreDir.docAnalysis];
    plugins.push(DocAnalysis(docAnalysisOption));
  }
  if (config.teekTheme !== false) {
    plugins.push(Catalogue(catalogueOption));
    const fileContentLoaderOptions = {
      pattern: ["**/*.md"],
      // 指定摘录格式
      excerpt: "<!-- more -->",
      includeSrc: true,
      transformData,
      transformRaw,
      themeConfigKey: "posts",
      globOptions: {
        ignore: [...ignoreDir.fileContentLoader, ...fileContentLoaderIgnore]
      }
    };
    plugins.push(FileContentLoader(fileContentLoaderOptions));
  }
  const head = [];
  if (teekConfig2.docAnalysis?.statistics?.provider === "busuanzi") {
    head.push(["meta", { name: "referrer", content: "no-referrer-when-downgrade" }]);
  }
  return {
    // 使用永久链接插件需要忽略死链提醒
    ignoreDeadLinks: true,
    metaChunk: true,
    head,
    vite: {
      plugins,
      ssr: { noExternal: ["vitepress-theme-teek"] },
      // 解决项目启动后终端打印 Scss 的废弃警告：The legacy JS API is deprecated and will be removed in Dart Sass 2.0.0.
      css: { preprocessorOptions: { scss: { api: "modern" } } }
    },
    markdown: {
      config: (md) => {
        [todo_default, shareCard_default, imgCard_default, navCard_default, video_default].forEach((plugin) => md.use(plugin));
        const { container: container5 = {}, demo, config: config2 } = markdown;
        md.use(demo_default, demo).use(container_default, container5.label);
        createContainersThenUse(md, container5.config?.() || []);
        config2?.(md);
      }
    },
    themeConfig: teekConfig2
  };
};

// ../packages/teek/version.ts
var version = "1.0.2";

// .vitepress/config.ts
var description = ["vitepress-theme-teek \u4F7F\u7528\u6587\u6863", "vitepress \u4E3B\u9898"].toString();
var teekConfig = defineTeekConfig({
  author: { name: "Teeker", link: "https://github.com/Kele-Bingtang" },
  footerInfo: {
    theme: {
      name: `Theme By Teek@${version}`
    },
    copyright: {
      createYear: 2025,
      suffix: "Teek"
    }
  },
  articleShare: { enabled: true },
  vitePlugins: {
    sidebarOption: {
      initItems: false
    }
  },
  markdown: {
    demo: {
      githubUrl: "https://github.com/Kele-Bingtang/vitepress-theme-teek/blob/master/docs"
    }
  },
  siteAnalytics: [
    {
      provider: "baidu",
      options: {
        id: "d5ee872d9aa1ef8021f4a3921b2e9c2a"
      }
    },
    {
      provider: "google",
      options: {
        id: "G-K5GNDW3L7K"
      }
    }
  ]
});
var config_default = defineConfig({
  extends: teekConfig,
  title: "vitepress-theme-teek",
  description,
  cleanUrls: true,
  lastUpdated: true,
  lang: "zh-CN",
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/teek-logo-mini.svg" }],
    ["link", { rel: "icon", type: "image/png", href: "/teek-logo-mini.png" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:locale", content: "zh-CN" }],
    ["meta", { property: "og:title", content: "Teek | VitePress Theme" }],
    ["meta", { property: "og:site_name", content: "Teek" }],
    ["meta", { property: "og:image", content: "" }],
    ["meta", { property: "og:url", content: "" }],
    ["meta", { name: "author", content: "Teek" }],
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"
      }
    ],
    [
      "meta",
      {
        name: "description",
        description
      }
    ],
    ["meta", { name: "keywords", description }],
    ["meta", { name: "baidu-site-verification", content: "codeva-GdK2q9MO1i" }],
    // 百度收录
    ["meta", { name: "msvalidate.01", content: "48CABE70F538B8D117567176ABF325AF" }],
    // Bing 收录验证
    ["link", { rel: "stylesheet", href: "//at.alicdn.com/t/font_2989306_w303erbip9.css" }],
    // 阿里在线矢量库
    ["script", { charset: "UTF-8", id: "LA_COLLECT", src: "//sdk.51.la/js-sdk-pro.min.js" }],
    // 51.la
    [
      "script",
      {},
      `typeof LA !== 'undefined' && LA.init({ id: "3LqfP8Icg0GeEvtn", ck: "3LqfP8Icg0GeEvtn", hashMode: true })`
    ]
    // 51.la
  ],
  markdown: {
    // 开启行号
    lineNumbers: true,
    image: {
      // 默认禁用；设置为 true 可为所有图片启用懒加载。
      lazyLoading: true
    },
    // 更改容器默认值标题
    container: {
      tipLabel: "\u63D0\u793A",
      warningLabel: "\u8B66\u544A",
      dangerLabel: "\u5371\u9669",
      infoLabel: "\u4FE1\u606F",
      detailsLabel: "\u8BE6\u7EC6\u4FE1\u606F"
    }
  },
  sitemap: {
    hostname: "https://vp.teek.top",
    transformItems: (items) => {
      const permalinkItemBak = [];
      const permalinks = globalThis.VITEPRESS_CONFIG.site.themeConfig.permalinks;
      items.forEach((item) => {
        const permalink = permalinks?.map[item.url];
        if (permalink) permalinkItemBak.push({ url: permalink, lastmod: item.lastmod });
      });
      return [...items, ...permalinkItemBak];
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/teek-logo-mini.svg",
    darkModeSwitchLabel: "\u4E3B\u9898",
    sidebarMenuLabel: "\u83DC\u5355",
    returnToTopLabel: "\u8FD4\u56DE\u9876\u90E8",
    lastUpdatedText: "\u4E0A\u6B21\u66F4\u65B0\u65F6\u95F4",
    outline: {
      level: [2, 4],
      label: "\u672C\u9875\u5BFC\u822A"
    },
    docFooter: {
      prev: "\u4E0A\u4E00\u9875",
      next: "\u4E0B\u4E00\u9875"
    },
    nav: [
      { text: "\u9996\u9875", link: "/" },
      { text: "\u6307\u5357", link: "/guide/intro", activeMatch: "/01.\u6307\u5357/" },
      { text: "\u914D\u7F6E", link: "/reference/config", activeMatch: "/10.\u914D\u7F6E/" },
      { text: "\u5F00\u53D1", link: "/develop/intro", activeMatch: "/15.\u4E3B\u9898\u5F00\u53D1/" },
      { text: "\u5E38\u89C1\u95EE\u9898", link: "/theme/qa", activeMatch: "/20.\u5E38\u89C1\u95EE\u9898/" },
      { text: "\u6848\u4F8B", link: "/case" },
      {
        text: "\u751F\u6001",
        items: [
          { text: "Components", link: "/ecosystem/components" },
          { text: "Helper", link: "/ecosystem/helper" },
          { text: "Hooks", link: "/ecosystem/hooks" },
          { text: "Markdown \u63D2\u4EF6\u5DE5\u5177", link: "/ecosystem/md-plugin-utils" }
        ]
      },
      {
        text: version,
        items: [
          { text: "\u5386\u53F2\u7248\u672C", link: "https://github.com/Kele-Bingtang/vitepress-theme-teek/releases" },
          { text: "\u66F4\u65B0\u65E5\u5FD7", link: "https://github.com/Kele-Bingtang/vitepress-theme-teek/blob/dev/CHANGELOG.md" }
        ]
      }
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/Kele-Bingtang/vitepress-theme-teek" }],
    search: {
      provider: "local"
    },
    editLink: {
      text: "\u5728 GitHub \u4E0A\u7F16\u8F91\u6B64\u9875",
      pattern: "https://github.com/Kele-Bingtang/vitepress-theme-teek/edit/master/docs/:path"
    }
  }
});
export {
  config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLnZpdGVwcmVzcy9jb25maWcudHMiLCAiLi4vcGFja2FnZXMvY29uZmlnL2luZGV4LnRzIiwgIi4uL3BhY2thZ2VzL2NvbmZpZy9wb3N0L2luZGV4LnRzIiwgIi4uL3BhY2thZ2VzL2NvbmZpZy9wb3N0L2hlbHBlci50cyIsICIuLi9wYWNrYWdlcy9tYXJrZG93bi9wbHVnaW5zL3RvZG8udHMiLCAiLi4vcGFja2FnZXMvbWFya2Rvd24vaGVscGVyL3NpbXBsZUNvbnRhaW5lci50cyIsICIuLi9wYWNrYWdlcy9tYXJrZG93bi9oZWxwZXIvY2FyZENvbnRhaW5lci50cyIsICIuLi9wYWNrYWdlcy9tYXJrZG93bi9wbHVnaW5zL2NvbnRhaW5lci50cyIsICIuLi9wYWNrYWdlcy9tYXJrZG93bi9wbHVnaW5zL3NoYXJlQ2FyZC50cyIsICIuLi9wYWNrYWdlcy9tYXJrZG93bi9wbHVnaW5zL2ltZ0NhcmQudHMiLCAiLi4vcGFja2FnZXMvbWFya2Rvd24vcGx1Z2lucy9uYXZDYXJkLnRzIiwgIi4uL3BhY2thZ2VzL21hcmtkb3duL3BsdWdpbnMvZGVtby50cyIsICIuLi9wYWNrYWdlcy9tYXJrZG93bi9wbHVnaW5zL3ZpZGVvLnRzIiwgIi4uL3BhY2thZ2VzL2NvbmZpZy9hZGRGcm9udG1hdHRlci50cyIsICIuLi9wYWNrYWdlcy90ZWVrL3ZlcnNpb24udHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxcdTk4NzlcdTc2RUVcdTUzM0FcXFxcVlNDb2RlUHJvamVjdHNcXFxcTXlQcm9qZWN0c1xcXFx2aXRlcHJlc3MtdGhlbWUtdGVla1xcXFxkb2NzXFxcXC52aXRlcHJlc3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXFx1OTg3OVx1NzZFRVx1NTMzQVxcXFxWU0NvZGVQcm9qZWN0c1xcXFxNeVByb2plY3RzXFxcXHZpdGVwcmVzcy10aGVtZS10ZWVrXFxcXGRvY3NcXFxcLnZpdGVwcmVzc1xcXFxjb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6LyVFOSVBMSVCOSVFNyU5QiVBRSVFNSU4QyVCQS9WU0NvZGVQcm9qZWN0cy9NeVByb2plY3RzL3ZpdGVwcmVzcy10aGVtZS10ZWVrL2RvY3MvLnZpdGVwcmVzcy9jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZXByZXNzXCI7XHJcbmltcG9ydCB7IGRlZmluZVRlZWtDb25maWcgfSBmcm9tIFwiLi4vLi4vcGFja2FnZXMvY29uZmlnXCI7XHJcbmltcG9ydCB7IHZlcnNpb24gfSBmcm9tIFwiLi4vLi4vcGFja2FnZXMvdGVlay92ZXJzaW9uXCI7XHJcblxyXG5jb25zdCBkZXNjcmlwdGlvbiA9IFtcInZpdGVwcmVzcy10aGVtZS10ZWVrIFx1NEY3Rlx1NzUyOFx1NjU4N1x1Njg2M1wiLCBcInZpdGVwcmVzcyBcdTRFM0JcdTk4OThcIl0udG9TdHJpbmcoKTtcclxuXHJcbmNvbnN0IHRlZWtDb25maWcgPSBkZWZpbmVUZWVrQ29uZmlnKHtcclxuICBhdXRob3I6IHsgbmFtZTogXCJUZWVrZXJcIiwgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vS2VsZS1CaW5ndGFuZ1wiIH0sXHJcbiAgZm9vdGVySW5mbzoge1xyXG4gICAgdGhlbWU6IHtcclxuICAgICAgbmFtZTogYFRoZW1lIEJ5IFRlZWtAJHt2ZXJzaW9ufWAsXHJcbiAgICB9LFxyXG4gICAgY29weXJpZ2h0OiB7XHJcbiAgICAgIGNyZWF0ZVllYXI6IDIwMjUsXHJcbiAgICAgIHN1ZmZpeDogXCJUZWVrXCIsXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgYXJ0aWNsZVNoYXJlOiB7IGVuYWJsZWQ6IHRydWUgfSxcclxuICB2aXRlUGx1Z2luczoge1xyXG4gICAgc2lkZWJhck9wdGlvbjoge1xyXG4gICAgICBpbml0SXRlbXM6IGZhbHNlLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIG1hcmtkb3duOiB7XHJcbiAgICBkZW1vOiB7XHJcbiAgICAgIGdpdGh1YlVybDogXCJodHRwczovL2dpdGh1Yi5jb20vS2VsZS1CaW5ndGFuZy92aXRlcHJlc3MtdGhlbWUtdGVlay9ibG9iL21hc3Rlci9kb2NzXCIsXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgc2l0ZUFuYWx5dGljczogW1xyXG4gICAge1xyXG4gICAgICBwcm92aWRlcjogXCJiYWlkdVwiLFxyXG4gICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgaWQ6IFwiZDVlZTg3MmQ5YWExZWY4MDIxZjRhMzkyMWIyZTljMmFcIixcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIHByb3ZpZGVyOiBcImdvb2dsZVwiLFxyXG4gICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgaWQ6IFwiRy1LNUdORFczTDdLXCIsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF0sXHJcbn0pO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlcHJlc3MuZGV2L3JlZmVyZW5jZS9zaXRlLWNvbmZpZ1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIGV4dGVuZHM6IHRlZWtDb25maWcsXHJcbiAgdGl0bGU6IFwidml0ZXByZXNzLXRoZW1lLXRlZWtcIixcclxuICBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sXHJcbiAgY2xlYW5VcmxzOiB0cnVlLFxyXG4gIGxhc3RVcGRhdGVkOiB0cnVlLFxyXG4gIGxhbmc6IFwiemgtQ05cIixcclxuICBoZWFkOiBbXHJcbiAgICBbXCJsaW5rXCIsIHsgcmVsOiBcImljb25cIiwgdHlwZTogXCJpbWFnZS9zdmcreG1sXCIsIGhyZWY6IFwiL3RlZWstbG9nby1taW5pLnN2Z1wiIH1dLFxyXG4gICAgW1wibGlua1wiLCB7IHJlbDogXCJpY29uXCIsIHR5cGU6IFwiaW1hZ2UvcG5nXCIsIGhyZWY6IFwiL3RlZWstbG9nby1taW5pLnBuZ1wiIH1dLFxyXG4gICAgW1wibWV0YVwiLCB7IHByb3BlcnR5OiBcIm9nOnR5cGVcIiwgY29udGVudDogXCJ3ZWJzaXRlXCIgfV0sXHJcbiAgICBbXCJtZXRhXCIsIHsgcHJvcGVydHk6IFwib2c6bG9jYWxlXCIsIGNvbnRlbnQ6IFwiemgtQ05cIiB9XSxcclxuICAgIFtcIm1ldGFcIiwgeyBwcm9wZXJ0eTogXCJvZzp0aXRsZVwiLCBjb250ZW50OiBcIlRlZWsgfCBWaXRlUHJlc3MgVGhlbWVcIiB9XSxcclxuICAgIFtcIm1ldGFcIiwgeyBwcm9wZXJ0eTogXCJvZzpzaXRlX25hbWVcIiwgY29udGVudDogXCJUZWVrXCIgfV0sXHJcbiAgICBbXCJtZXRhXCIsIHsgcHJvcGVydHk6IFwib2c6aW1hZ2VcIiwgY29udGVudDogXCJcIiB9XSxcclxuICAgIFtcIm1ldGFcIiwgeyBwcm9wZXJ0eTogXCJvZzp1cmxcIiwgY29udGVudDogXCJcIiB9XSxcclxuICAgIFtcIm1ldGFcIiwgeyBuYW1lOiBcImF1dGhvclwiLCBjb250ZW50OiBcIlRlZWtcIiB9XSxcclxuICAgIFtcclxuICAgICAgXCJtZXRhXCIsXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiBcInZpZXdwb3J0XCIsXHJcbiAgICAgICAgY29udGVudDogXCJ3aWR0aD1kZXZpY2Utd2lkdGgsaW5pdGlhbC1zY2FsZT0xLG1pbmltdW0tc2NhbGU9MS4wLG1heGltdW0tc2NhbGU9MS4wLHVzZXItc2NhbGFibGU9bm9cIixcclxuICAgICAgfSxcclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgIFwibWV0YVwiLFxyXG4gICAgICB7XHJcbiAgICAgICAgbmFtZTogXCJkZXNjcmlwdGlvblwiLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uLFxyXG4gICAgICB9LFxyXG4gICAgXSxcclxuICAgIFtcIm1ldGFcIiwgeyBuYW1lOiBcImtleXdvcmRzXCIsIGRlc2NyaXB0aW9uIH1dLFxyXG4gICAgW1wibWV0YVwiLCB7IG5hbWU6IFwiYmFpZHUtc2l0ZS12ZXJpZmljYXRpb25cIiwgY29udGVudDogXCJjb2RldmEtR2RLMnE5TU8xaVwiIH1dLCAvLyBcdTc2N0VcdTVFQTZcdTY1MzZcdTVGNTVcclxuICAgIFtcIm1ldGFcIiwgeyBuYW1lOiBcIm1zdmFsaWRhdGUuMDFcIiwgY29udGVudDogXCI0OENBQkU3MEY1MzhCOEQxMTc1NjcxNzZBQkYzMjVBRlwiIH1dLCAvLyBCaW5nIFx1NjUzNlx1NUY1NVx1OUE4Q1x1OEJDMVxyXG4gICAgW1wibGlua1wiLCB7IHJlbDogXCJzdHlsZXNoZWV0XCIsIGhyZWY6IFwiLy9hdC5hbGljZG4uY29tL3QvZm9udF8yOTg5MzA2X3czMDNlcmJpcDkuY3NzXCIgfV0sIC8vIFx1OTYzRlx1OTFDQ1x1NTcyOFx1N0VCRlx1NzdFMlx1OTFDRlx1NUU5M1xyXG4gICAgW1wic2NyaXB0XCIsIHsgY2hhcnNldDogXCJVVEYtOFwiLCBpZDogXCJMQV9DT0xMRUNUXCIsIHNyYzogXCIvL3Nkay41MS5sYS9qcy1zZGstcHJvLm1pbi5qc1wiIH1dLCAvLyA1MS5sYVxyXG4gICAgW1xyXG4gICAgICBcInNjcmlwdFwiLFxyXG4gICAgICB7fSxcclxuICAgICAgYHR5cGVvZiBMQSAhPT0gJ3VuZGVmaW5lZCcgJiYgTEEuaW5pdCh7IGlkOiBcIjNMcWZQOEljZzBHZUV2dG5cIiwgY2s6IFwiM0xxZlA4SWNnMEdlRXZ0blwiLCBoYXNoTW9kZTogdHJ1ZSB9KWAsXHJcbiAgICBdLCAvLyA1MS5sYVxyXG4gIF0sXHJcbiAgbWFya2Rvd246IHtcclxuICAgIC8vIFx1NUYwMFx1NTQyRlx1ODg0Q1x1NTNGN1xyXG4gICAgbGluZU51bWJlcnM6IHRydWUsXHJcbiAgICBpbWFnZToge1xyXG4gICAgICAvLyBcdTlFRDhcdThCQTRcdTc5ODFcdTc1MjhcdUZGMUJcdThCQkVcdTdGNkVcdTRFM0EgdHJ1ZSBcdTUzRUZcdTRFM0FcdTYyNDBcdTY3MDlcdTU2RkVcdTcyNDdcdTU0MkZcdTc1MjhcdTYxRDJcdTUyQTBcdThGN0RcdTMwMDJcclxuICAgICAgbGF6eUxvYWRpbmc6IHRydWUsXHJcbiAgICB9LFxyXG4gICAgLy8gXHU2NkY0XHU2NTM5XHU1QkI5XHU1NjY4XHU5RUQ4XHU4QkE0XHU1MDNDXHU2ODA3XHU5ODk4XHJcbiAgICBjb250YWluZXI6IHtcclxuICAgICAgdGlwTGFiZWw6IFwiXHU2M0QwXHU3OTNBXCIsXHJcbiAgICAgIHdhcm5pbmdMYWJlbDogXCJcdThCNjZcdTU0NEFcIixcclxuICAgICAgZGFuZ2VyTGFiZWw6IFwiXHU1MzcxXHU5NjY5XCIsXHJcbiAgICAgIGluZm9MYWJlbDogXCJcdTRGRTFcdTYwNkZcIixcclxuICAgICAgZGV0YWlsc0xhYmVsOiBcIlx1OEJFNlx1N0VDNlx1NEZFMVx1NjA2RlwiLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHNpdGVtYXA6IHtcclxuICAgIGhvc3RuYW1lOiBcImh0dHBzOi8vdnAudGVlay50b3BcIixcclxuICAgIHRyYW5zZm9ybUl0ZW1zOiBpdGVtcyA9PiB7XHJcbiAgICAgIGNvbnN0IHBlcm1hbGlua0l0ZW1CYWs6IHR5cGVvZiBpdGVtcyA9IFtdO1xyXG4gICAgICAvLyBcdTRGN0ZcdTc1MjhcdTZDMzhcdTRFNDVcdTk0RkVcdTYzQTVcdTc1MUZcdTYyMTAgc2l0ZW1hcFxyXG4gICAgICBjb25zdCBwZXJtYWxpbmtzID0gKGdsb2JhbFRoaXMgYXMgYW55KS5WSVRFUFJFU1NfQ09ORklHLnNpdGUudGhlbWVDb25maWcucGVybWFsaW5rcztcclxuICAgICAgaXRlbXMuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICBjb25zdCBwZXJtYWxpbmsgPSBwZXJtYWxpbmtzPy5tYXBbaXRlbS51cmxdO1xyXG4gICAgICAgIGlmIChwZXJtYWxpbmspIHBlcm1hbGlua0l0ZW1CYWsucHVzaCh7IHVybDogcGVybWFsaW5rLCBsYXN0bW9kOiBpdGVtLmxhc3Rtb2QgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXR1cm4gWy4uLml0ZW1zLCAuLi5wZXJtYWxpbmtJdGVtQmFrXTtcclxuICAgIH0sXHJcbiAgfSxcclxuICB0aGVtZUNvbmZpZzoge1xyXG4gICAgLy8gaHR0cHM6Ly92aXRlcHJlc3MuZGV2L3JlZmVyZW5jZS9kZWZhdWx0LXRoZW1lLWNvbmZpZ1xyXG4gICAgbG9nbzogXCIvdGVlay1sb2dvLW1pbmkuc3ZnXCIsXHJcbiAgICBkYXJrTW9kZVN3aXRjaExhYmVsOiBcIlx1NEUzQlx1OTg5OFwiLFxyXG4gICAgc2lkZWJhck1lbnVMYWJlbDogXCJcdTgzRENcdTUzNTVcIixcclxuICAgIHJldHVyblRvVG9wTGFiZWw6IFwiXHU4RkQ0XHU1NkRFXHU5ODc2XHU5MEU4XCIsXHJcbiAgICBsYXN0VXBkYXRlZFRleHQ6IFwiXHU0RTBBXHU2QjIxXHU2NkY0XHU2NUIwXHU2NUY2XHU5NUY0XCIsXHJcbiAgICBvdXRsaW5lOiB7XHJcbiAgICAgIGxldmVsOiBbMiwgNF0sXHJcbiAgICAgIGxhYmVsOiBcIlx1NjcyQ1x1OTg3NVx1NUJGQ1x1ODIyQVwiLFxyXG4gICAgfSxcclxuICAgIGRvY0Zvb3Rlcjoge1xyXG4gICAgICBwcmV2OiBcIlx1NEUwQVx1NEUwMFx1OTg3NVwiLFxyXG4gICAgICBuZXh0OiBcIlx1NEUwQlx1NEUwMFx1OTg3NVwiLFxyXG4gICAgfSxcclxuICAgIG5hdjogW1xyXG4gICAgICB7IHRleHQ6IFwiXHU5OTk2XHU5ODc1XCIsIGxpbms6IFwiL1wiIH0sXHJcbiAgICAgIHsgdGV4dDogXCJcdTYzMDdcdTUzNTdcIiwgbGluazogXCIvZ3VpZGUvaW50cm9cIiwgYWN0aXZlTWF0Y2g6IFwiLzAxLlx1NjMwN1x1NTM1Ny9cIiB9LFxyXG4gICAgICB7IHRleHQ6IFwiXHU5MTREXHU3RjZFXCIsIGxpbms6IFwiL3JlZmVyZW5jZS9jb25maWdcIiwgYWN0aXZlTWF0Y2g6IFwiLzEwLlx1OTE0RFx1N0Y2RS9cIiB9LFxyXG4gICAgICB7IHRleHQ6IFwiXHU1RjAwXHU1M0QxXCIsIGxpbms6IFwiL2RldmVsb3AvaW50cm9cIiwgYWN0aXZlTWF0Y2g6IFwiLzE1Llx1NEUzQlx1OTg5OFx1NUYwMFx1NTNEMS9cIiB9LFxyXG4gICAgICB7IHRleHQ6IFwiXHU1RTM4XHU4OUMxXHU5NUVFXHU5ODk4XCIsIGxpbms6IFwiL3RoZW1lL3FhXCIsIGFjdGl2ZU1hdGNoOiBcIi8yMC5cdTVFMzhcdTg5QzFcdTk1RUVcdTk4OTgvXCIgfSxcclxuICAgICAgeyB0ZXh0OiBcIlx1Njg0OFx1NEY4QlwiLCBsaW5rOiBcIi9jYXNlXCIgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRleHQ6IFwiXHU3NTFGXHU2MDAxXCIsXHJcbiAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgIHsgdGV4dDogXCJDb21wb25lbnRzXCIsIGxpbms6IFwiL2Vjb3N5c3RlbS9jb21wb25lbnRzXCIgfSxcclxuICAgICAgICAgIHsgdGV4dDogXCJIZWxwZXJcIiwgbGluazogXCIvZWNvc3lzdGVtL2hlbHBlclwiIH0sXHJcbiAgICAgICAgICB7IHRleHQ6IFwiSG9va3NcIiwgbGluazogXCIvZWNvc3lzdGVtL2hvb2tzXCIgfSxcclxuICAgICAgICAgIHsgdGV4dDogXCJNYXJrZG93biBcdTYzRDJcdTRFRjZcdTVERTVcdTUxNzdcIiwgbGluazogXCIvZWNvc3lzdGVtL21kLXBsdWdpbi11dGlsc1wiIH0sXHJcbiAgICAgICAgXSxcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRleHQ6IHZlcnNpb24sXHJcbiAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgIHsgdGV4dDogXCJcdTUzODZcdTUzRjJcdTcyNDhcdTY3MkNcIiwgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vS2VsZS1CaW5ndGFuZy92aXRlcHJlc3MtdGhlbWUtdGVlay9yZWxlYXNlc1wiIH0sXHJcbiAgICAgICAgICB7IHRleHQ6IFwiXHU2NkY0XHU2NUIwXHU2NUU1XHU1RkQ3XCIsIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL0tlbGUtQmluZ3Rhbmcvdml0ZXByZXNzLXRoZW1lLXRlZWsvYmxvYi9kZXYvQ0hBTkdFTE9HLm1kXCIgfSxcclxuICAgICAgICBdLFxyXG4gICAgICB9LFxyXG4gICAgXSxcclxuICAgIHNvY2lhbExpbmtzOiBbeyBpY29uOiBcImdpdGh1YlwiLCBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9LZWxlLUJpbmd0YW5nL3ZpdGVwcmVzcy10aGVtZS10ZWVrXCIgfV0sXHJcblxyXG4gICAgc2VhcmNoOiB7XHJcbiAgICAgIHByb3ZpZGVyOiBcImxvY2FsXCIsXHJcbiAgICB9LFxyXG4gICAgZWRpdExpbms6IHtcclxuICAgICAgdGV4dDogXCJcdTU3MjggR2l0SHViIFx1NEUwQVx1N0YxNlx1OEY5MVx1NkI2NFx1OTg3NVwiLFxyXG4gICAgICBwYXR0ZXJuOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9LZWxlLUJpbmd0YW5nL3ZpdGVwcmVzcy10aGVtZS10ZWVrL2VkaXQvbWFzdGVyL2RvY3MvOnBhdGhcIixcclxuICAgIH0sXHJcbiAgfSxcclxufSk7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRTpcXFxcXHU5ODc5XHU3NkVFXHU1MzNBXFxcXFZTQ29kZVByb2plY3RzXFxcXE15UHJvamVjdHNcXFxcdml0ZXByZXNzLXRoZW1lLXRlZWtcXFxccGFja2FnZXNcXFxcY29uZmlnXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFxcdTk4NzlcdTc2RUVcdTUzM0FcXFxcVlNDb2RlUHJvamVjdHNcXFxcTXlQcm9qZWN0c1xcXFx2aXRlcHJlc3MtdGhlbWUtdGVla1xcXFxwYWNrYWdlc1xcXFxjb25maWdcXFxcaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6LyVFOSVBMSVCOSVFNyU5QiVBRSVFNSU4QyVCQS9WU0NvZGVQcm9qZWN0cy9NeVByb2plY3RzL3ZpdGVwcmVzcy10aGVtZS10ZWVrL3BhY2thZ2VzL2NvbmZpZy9pbmRleC50c1wiO2ltcG9ydCB0eXBlIHsgRGVmYXVsdFRoZW1lLCBIZWFkQ29uZmlnLCBVc2VyQ29uZmlnIH0gZnJvbSBcInZpdGVwcmVzc1wiO1xyXG5pbXBvcnQgdHlwZSB7IFRlZWtDb25maWcgfSBmcm9tIFwiLi90eXBlc1wiO1xyXG5pbXBvcnQgdHlwZSB7IFBvc3REYXRhLCBUa0NvbnRlbnREYXRhIH0gZnJvbSBcIi4vcG9zdC90eXBlc1wiO1xyXG5pbXBvcnQgU2lkZWJhciBmcm9tIFwidml0ZXByZXNzLXBsdWdpbi1zaWRlYmFyLXJlc29sdmVcIjtcclxuaW1wb3J0IFBlcm1hbGluayBmcm9tIFwidml0ZXByZXNzLXBsdWdpbi1wZXJtYWxpbmtcIjtcclxuaW1wb3J0IE1kSDEgZnJvbSBcInZpdGVwcmVzcy1wbHVnaW4tbWQtaDFcIjtcclxuaW1wb3J0IENhdGFsb2d1ZSBmcm9tIFwidml0ZXByZXNzLXBsdWdpbi1jYXRhbG9ndWVcIjtcclxuaW1wb3J0IERvY0FuYWx5c2lzIGZyb20gXCJ2aXRlcHJlc3MtcGx1Z2luLWRvYy1hbmFseXNpc1wiO1xyXG5pbXBvcnQgRmlsZUNvbnRlbnRMb2FkZXIsIHsgRmlsZUNvbnRlbnRMb2FkZXJPcHRpb25zIH0gZnJvbSBcInZpdGVwcmVzcy1wbHVnaW4tZmlsZS1jb250ZW50LWxvYWRlclwiO1xyXG5pbXBvcnQgQXV0b0Zyb250bWF0dGVyIGZyb20gXCJ2aXRlcHJlc3MtcGx1Z2luLWF1dG8tZnJvbnRtYXR0ZXJcIjtcclxuaW1wb3J0IHsgdHJhbnNmb3JtRGF0YSwgdHJhbnNmb3JtUmF3IH0gZnJvbSBcIi4vcG9zdFwiO1xyXG5pbXBvcnQge1xyXG4gIHRvZG9QbHVnaW4sXHJcbiAgc2hhcmVDYXJkUGx1Z2luLFxyXG4gIGltZ0NhcmRQbHVnaW4sXHJcbiAgbmF2Q2FyZFBsdWdpbixcclxuICBkZW1vUGx1Z2luLFxyXG4gIHZpZGVvUGx1Z2luLFxyXG4gIGNvbnRhaW5lclBsdWdpbixcclxuICBjcmVhdGVDb250YWluZXJzVGhlblVzZSxcclxufSBmcm9tIFwiLi4vbWFya2Rvd25cIjtcclxuaW1wb3J0IHsgY3JlYXRlQ2F0ZWdvcnksIGNyZWF0ZVBlcm1hbGluayB9IGZyb20gXCIuL2FkZEZyb250bWF0dGVyXCI7XHJcblxyXG5leHBvcnQgeyBMYXlvdXRUaGVtZUNvbG9yLCBMYXlvdXRNb2RlLCBTcG90bGlnaHRTdHlsZSB9IGZyb20gXCIuLi9jb21wb25lbnRzL3RoZW1lL0xheW91dEVuaGFuY2Uvc3JjL2xheW91dEVuaGFuY2VcIjtcclxuZXhwb3J0IHR5cGUgKiBmcm9tIFwiLi90eXBlc1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGRlZmluZVRlZWtDb25maWcgPSAoY29uZmlnOiBUZWVrQ29uZmlnICYgVXNlckNvbmZpZzxEZWZhdWx0VGhlbWUuQ29uZmlnPiA9IHt9KTogVXNlckNvbmZpZyA9PiB7XHJcbiAgY29uc3QgeyB2aXRlUGx1Z2lucywgbWFya2Rvd24gPSB7fSwgLi4udGVla0NvbmZpZyB9ID0gY29uZmlnO1xyXG4gIGNvbnN0IHtcclxuICAgIHNpZGViYXIgPSB0cnVlLFxyXG4gICAgc2lkZWJhck9wdGlvbiA9IHt9LFxyXG4gICAgcGVybWFsaW5rID0gdHJ1ZSxcclxuICAgIHBlcm1hbGlua09wdGlvbiA9IHt9LFxyXG4gICAgbWRIMSA9IHRydWUsXHJcbiAgICBtZEgxT3B0aW9uID0ge30sXHJcbiAgICBjYXRhbG9ndWVPcHRpb24gPSB7fSxcclxuICAgIGRvY0FuYWx5c2lzID0gdHJ1ZSxcclxuICAgIGRvY0FuYWx5c2lzT3B0aW9uID0ge30sXHJcbiAgICBmaWxlQ29udGVudExvYWRlcklnbm9yZSA9IFtdLFxyXG4gICAgYXV0b0Zyb250bWF0dGVyID0gZmFsc2UsXHJcbiAgICBhdXRvRnJvbnRtYXR0ZXJPcHRpb24gPSB7fSxcclxuICB9ID0gdml0ZVBsdWdpbnMgfHwge307XHJcblxyXG4gIGNvbnN0IHBsdWdpbnM6IGFueVtdID0gW107XHJcblxyXG4gIC8vIFx1NUI5QVx1NEU0OVx1NTQwNFx1NjNEMlx1NEVGNlx1NjI2Qlx1NjNDRlx1NjVGNlx1NUZGRFx1NzU2NVx1NzY4NFx1NzZFRVx1NUY1NVxyXG4gIGNvbnN0IGlnbm9yZURpciA9IHtcclxuICAgIGF1dG9Gcm9udG1hdHRlcjogW1wiKiovQHBhZ2VzLyoqXCIsIFwiKiovLnNjcmlwdHMvKipcIl0sXHJcbiAgICBzaWRlYmFyOiBbXCJAcGFnZXNcIiwgXCJAZnJhZ21lbnRcIiwgXCJleGFtcGxlc1wiLCBcIi5zY3JpcHRzXCJdLFxyXG4gICAgbWRIMTogW1wiQHBhZ2VzXCIsIFwiLnNjcmlwdHNcIl0sXHJcbiAgICBkb2NBbmFseXNpczogW1wiQHBhZ2VzXCIsIC9cdTc2RUVcdTVGNTVcdTk4NzUvLCBcIi5zY3JpcHRzXCJdLFxyXG4gICAgZmlsZUNvbnRlbnRMb2FkZXI6IFtcIioqL2NvbXBvbmVudHMvKipcIiwgXCIqKi8udml0ZXByZXNzLyoqXCIsIFwiKiovcHVibGljLyoqXCIsIFwiKiovKlx1NzZFRVx1NUY1NVx1OTg3NSovKipcIiwgXCIqKi8uc2NyaXB0cy8qKlwiXSxcclxuICB9O1xyXG5cclxuICAvLyBcdTgxRUFcdTUyQThcdTc1MUZcdTYyMTAgZnJvbnRtYXR0ZXIgXHU2M0QyXHU0RUY2XHVGRjBDXHU1RkM1XHU5ODdCXHU2NTNFXHU1NzI4XHU3QjJDXHU0RTAwXHU0RjREXHJcbiAgaWYgKGF1dG9Gcm9udG1hdHRlcikge1xyXG4gICAgY29uc3Qge1xyXG4gICAgICBwYXR0ZXJuLFxyXG4gICAgICBnbG9iT3B0aW9ucyA9IHt9LFxyXG4gICAgICB0cmFuc2Zvcm0sXHJcbiAgICAgIHBlcm1hbGlua1ByZWZpeCA9IFwicGFnZXNcIixcclxuICAgICAgY2F0ZWdvcmllcyA9IHRydWUsXHJcbiAgICB9ID0gYXV0b0Zyb250bWF0dGVyT3B0aW9uO1xyXG5cclxuICAgIC8vIFx1OUVEOFx1OEJBNFx1NjI2Qlx1NjNDRlx1NTE2OFx1OTBFOCBNRCBcdTY1ODdcdTRFRjZcclxuICAgIGlmICghcGF0dGVybikgYXV0b0Zyb250bWF0dGVyT3B0aW9uLnBhdHRlcm4gPSBcIioqLyoubWRcIjtcclxuXHJcbiAgICBhdXRvRnJvbnRtYXR0ZXJPcHRpb24uZ2xvYk9wdGlvbnMgPSB7XHJcbiAgICAgIC4uLmF1dG9Gcm9udG1hdHRlck9wdGlvbi5nbG9iT3B0aW9ucyxcclxuICAgICAgaWdub3JlOiBbLi4uaWdub3JlRGlyLmF1dG9Gcm9udG1hdHRlciwgLi4uKGdsb2JPcHRpb25zLmlnbm9yZSB8fCBbXSldLFxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBcdTgxRUFcdTVCOUFcdTRFNDkgZnJvbnRtYXR0ZXIgXHU1MTg1XHU1QkI5XHVGRjBDXHU2REZCXHU1MkEwXHU2QzM4XHU0RTQ1XHU5NEZFXHU2M0E1XHU1NDhDXHU1MjA2XHU3QzdCXHJcbiAgICBhdXRvRnJvbnRtYXR0ZXJPcHRpb24udHJhbnNmb3JtID0gKGZyb250bWF0dGVyLCBmaWxlSW5mbykgPT4ge1xyXG4gICAgICBsZXQgdHJhbnNmb3JtUmVzdWx0ID0gdHJhbnNmb3JtPy4oZnJvbnRtYXR0ZXIsIGZpbGVJbmZvKSB8fCB7fTtcclxuXHJcbiAgICAgIGlmIChwZXJtYWxpbmsgJiYgIWZyb250bWF0dGVyLnBlcm1hbGluaykge1xyXG4gICAgICAgIHRyYW5zZm9ybVJlc3VsdCA9IHsgLi4udHJhbnNmb3JtUmVzdWx0LCAuLi5jcmVhdGVQZXJtYWxpbmsocGVybWFsaW5rUHJlZml4KSB9O1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChjYXRlZ29yaWVzICYmICFmcm9udG1hdHRlci5jYXRlZ29yaWVzKSB7XHJcbiAgICAgICAgdHJhbnNmb3JtUmVzdWx0ID0geyAuLi50cmFuc2Zvcm1SZXN1bHQsIC4uLmNyZWF0ZUNhdGVnb3J5KGZpbGVJbmZvLCBbXCJAZnJhZ21lbnRcIl0pIH07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0cmFuc2Zvcm1SZXN1bHQpLmxlbmd0aCA/IHsgLi4uZnJvbnRtYXR0ZXIsIC4uLnRyYW5zZm9ybVJlc3VsdCB9IDogdW5kZWZpbmVkO1xyXG4gICAgfTtcclxuXHJcbiAgICBwbHVnaW5zLnB1c2goQXV0b0Zyb250bWF0dGVyKGF1dG9Gcm9udG1hdHRlck9wdGlvbikpO1xyXG4gIH1cclxuXHJcbiAgLy8gXHU4MUVBXHU1MkE4XHU2REZCXHU1MkEwXHU0RkE3XHU4RkI5XHU2ODBGXHU2M0QyXHU0RUY2XHJcbiAgaWYgKHNpZGViYXIpIHtcclxuICAgIHNpZGViYXJPcHRpb24uaWdub3JlTGlzdCA9IFsuLi4oc2lkZWJhck9wdGlvbj8uaWdub3JlTGlzdCB8fCBbXSksIC4uLmlnbm9yZURpci5zaWRlYmFyXTtcclxuICAgIHBsdWdpbnMucHVzaChTaWRlYmFyKHNpZGViYXJPcHRpb24pKTtcclxuICB9XHJcbiAgLy8gXHU4MUVBXHU1MkE4XHU3NTFGXHU2MjEwXHU2QzM4XHU0RTQ1XHU5NEZFXHU2M0E1XHU2M0QyXHU0RUY2XHJcbiAgaWYgKHBlcm1hbGluaykge1xyXG4gICAgcGx1Z2lucy5wdXNoKC4uLlBlcm1hbGluayh7IHBlcm1hbGlua09wdGlvbjogcGVybWFsaW5rT3B0aW9uLCBub3RGb3VuZE9wdGlvbjogcGVybWFsaW5rT3B0aW9uIH0pKTtcclxuICB9XHJcbiAgLy8gXHU4MUVBXHU1MkE4XHU3RUQ5IE1EIFx1NkRGQlx1NTJBMFx1NEUwMFx1N0VBN1x1NjgwN1x1OTg5OFx1NjNEMlx1NEVGNlxyXG4gIGlmIChtZEgxKSB7XHJcbiAgICBjb25zdCBzZWxmQmVmb3JlSW5qZWN0ID0gbWRIMU9wdGlvbi5iZWZvcmVJbmplY3Q7XHJcbiAgICBtZEgxT3B0aW9uLmJlZm9yZUluamVjdCA9IChmcm9udG1hdHRlciwgaWQsIHRpdGxlKSA9PiB7XHJcbiAgICAgIGlmIChmcm9udG1hdHRlci5sYXlvdXQgPT09IFwiY2F0YWxvZ3VlUGFnZVwiIHx8IGZyb250bWF0dGVyLmNhdGFsb2d1ZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICBpZiAoZnJvbnRtYXR0ZXIubGF5b3V0ID09PSBcImFyY2hpdmVzUGFnZVwiIHx8IGZyb250bWF0dGVyLmFyY2hpdmVzUGFnZSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgcmV0dXJuIHNlbGZCZWZvcmVJbmplY3Q/Lihmcm9udG1hdHRlciwgaWQsIHRpdGxlKTtcclxuICAgIH07XHJcbiAgICBtZEgxT3B0aW9uLmlnbm9yZUxpc3QgPSBbLi4uKG1kSDFPcHRpb24/Lmlnbm9yZUxpc3QgfHwgW10pLCAuLi5pZ25vcmVEaXIubWRIMV07XHJcblxyXG4gICAgcGx1Z2lucy5wdXNoKE1kSDEobWRIMU9wdGlvbikpO1xyXG4gIH1cclxuICAvLyBcdTY1ODdcdTY4NjNcdTUxODVcdTVCQjlcdTUyMDZcdTY3OTBcdTYzRDJcdTRFRjZcclxuICBpZiAoZG9jQW5hbHlzaXMpIHtcclxuICAgIGRvY0FuYWx5c2lzT3B0aW9uLmlnbm9yZUxpc3QgPSBbLi4uKHNpZGViYXJPcHRpb24/Lmlnbm9yZUxpc3QgfHwgW10pLCAuLi5pZ25vcmVEaXIuZG9jQW5hbHlzaXNdO1xyXG4gICAgcGx1Z2lucy5wdXNoKERvY0FuYWx5c2lzKGRvY0FuYWx5c2lzT3B0aW9uKSk7XHJcbiAgfVxyXG5cclxuICAvLyBcdTRFM0JcdTk4OThcdTVGM0FcdTUxODVcdTdGNkVcdTYzRDJcdTRFRjZcclxuICBpZiAoY29uZmlnLnRlZWtUaGVtZSAhPT0gZmFsc2UpIHtcclxuICAgIC8vIFx1NzZFRVx1NUY1NVx1OTg3NVx1NjNEMlx1NEVGNlxyXG4gICAgcGx1Z2lucy5wdXNoKENhdGFsb2d1ZShjYXRhbG9ndWVPcHRpb24pKTtcclxuXHJcbiAgICBjb25zdCBmaWxlQ29udGVudExvYWRlck9wdGlvbnM6IEZpbGVDb250ZW50TG9hZGVyT3B0aW9uczxUa0NvbnRlbnREYXRhLCBQb3N0RGF0YT4gPSB7XHJcbiAgICAgIHBhdHRlcm46IFtcIioqLyoubWRcIl0sXHJcbiAgICAgIC8vIFx1NjMwN1x1NUI5QVx1NjQ1OFx1NUY1NVx1NjgzQ1x1NUYwRlxyXG4gICAgICBleGNlcnB0OiBcIjwhLS0gbW9yZSAtLT5cIixcclxuICAgICAgaW5jbHVkZVNyYzogdHJ1ZSxcclxuICAgICAgdHJhbnNmb3JtRGF0YSxcclxuICAgICAgdHJhbnNmb3JtUmF3LFxyXG4gICAgICB0aGVtZUNvbmZpZ0tleTogXCJwb3N0c1wiLFxyXG4gICAgICBnbG9iT3B0aW9uczoge1xyXG4gICAgICAgIGlnbm9yZTogWy4uLmlnbm9yZURpci5maWxlQ29udGVudExvYWRlciwgLi4uZmlsZUNvbnRlbnRMb2FkZXJJZ25vcmVdLFxyXG4gICAgICB9LFxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBQb3N0IFx1NjU3MFx1NjM2RVx1NTkwNFx1NzQwNlx1NjNEMlx1NEVGNlxyXG4gICAgcGx1Z2lucy5wdXNoKEZpbGVDb250ZW50TG9hZGVyPFRrQ29udGVudERhdGEsIFBvc3REYXRhPihmaWxlQ29udGVudExvYWRlck9wdGlvbnMpKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGhlYWQ6IEhlYWRDb25maWdbXSA9IFtdO1xyXG5cclxuICBpZiAodGVla0NvbmZpZy5kb2NBbmFseXNpcz8uc3RhdGlzdGljcz8ucHJvdmlkZXIgPT09IFwiYnVzdWFuemlcIikge1xyXG4gICAgLy8gXHU0RTBEXHU4NDlDXHU1QjUwIEFQSSBcdTdFREZcdThCQTFcdTk3MDBcdTg5ODFcclxuICAgIGhlYWQucHVzaChbXCJtZXRhXCIsIHsgbmFtZTogXCJyZWZlcnJlclwiLCBjb250ZW50OiBcIm5vLXJlZmVycmVyLXdoZW4tZG93bmdyYWRlXCIgfV0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIC8vIFx1NEY3Rlx1NzUyOFx1NkMzOFx1NEU0NVx1OTRGRVx1NjNBNVx1NjNEMlx1NEVGNlx1OTcwMFx1ODk4MVx1NUZGRFx1NzU2NVx1NkI3Qlx1OTRGRVx1NjNEMFx1OTE5MlxyXG4gICAgaWdub3JlRGVhZExpbmtzOiB0cnVlLFxyXG4gICAgbWV0YUNodW5rOiB0cnVlLFxyXG4gICAgaGVhZCxcclxuICAgIHZpdGU6IHtcclxuICAgICAgcGx1Z2luczogcGx1Z2lucyxcclxuICAgICAgc3NyOiB7IG5vRXh0ZXJuYWw6IFtcInZpdGVwcmVzcy10aGVtZS10ZWVrXCJdIH0sXHJcbiAgICAgIC8vIFx1ODlFM1x1NTFCM1x1OTg3OVx1NzZFRVx1NTQyRlx1NTJBOFx1NTQwRVx1N0VDOFx1N0FFRlx1NjI1M1x1NTM3MCBTY3NzIFx1NzY4NFx1NUU5Rlx1NUYwM1x1OEI2Nlx1NTQ0QVx1RkYxQVRoZSBsZWdhY3kgSlMgQVBJIGlzIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBEYXJ0IFNhc3MgMi4wLjAuXHJcbiAgICAgIGNzczogeyBwcmVwcm9jZXNzb3JPcHRpb25zOiB7IHNjc3M6IHsgYXBpOiBcIm1vZGVyblwiIH0gfSB9LFxyXG4gICAgfSxcclxuICAgIG1hcmtkb3duOiB7XHJcbiAgICAgIGNvbmZpZzogbWQgPT4ge1xyXG4gICAgICAgIFt0b2RvUGx1Z2luLCBzaGFyZUNhcmRQbHVnaW4sIGltZ0NhcmRQbHVnaW4sIG5hdkNhcmRQbHVnaW4sIHZpZGVvUGx1Z2luXS5mb3JFYWNoKHBsdWdpbiA9PiBtZC51c2UocGx1Z2luKSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHsgY29udGFpbmVyID0ge30sIGRlbW8sIGNvbmZpZyB9ID0gbWFya2Rvd247XHJcbiAgICAgICAgbWQudXNlKGRlbW9QbHVnaW4sIGRlbW8pLnVzZShjb250YWluZXJQbHVnaW4sIGNvbnRhaW5lci5sYWJlbCk7XHJcbiAgICAgICAgLy8gXHU1MjFCXHU1RUZBXHU3NTI4XHU2MjM3XHU5MTREXHU3RjZFXHU3Njg0XHU4MUVBXHU1QjlBXHU0RTQ5XHU1QkI5XHU1NjY4XHJcbiAgICAgICAgY3JlYXRlQ29udGFpbmVyc1RoZW5Vc2UobWQsIGNvbnRhaW5lci5jb25maWc/LigpIHx8IFtdKTtcclxuXHJcbiAgICAgICAgLy8gXHU3NTI4XHU2MjM3XHU4MUVBXHU1QjlBXHU0RTQ5IG1hcmtkb3duIFx1NjNEMlx1NEVGNlxyXG4gICAgICAgIGNvbmZpZz8uKG1kKTtcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB0aGVtZUNvbmZpZzogdGVla0NvbmZpZyxcclxuICB9O1xyXG59O1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkU6XFxcXFx1OTg3OVx1NzZFRVx1NTMzQVxcXFxWU0NvZGVQcm9qZWN0c1xcXFxNeVByb2plY3RzXFxcXHZpdGVwcmVzcy10aGVtZS10ZWVrXFxcXHBhY2thZ2VzXFxcXGNvbmZpZ1xcXFxwb3N0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFxcdTk4NzlcdTc2RUVcdTUzM0FcXFxcVlNDb2RlUHJvamVjdHNcXFxcTXlQcm9qZWN0c1xcXFx2aXRlcHJlc3MtdGhlbWUtdGVla1xcXFxwYWNrYWdlc1xcXFxjb25maWdcXFxccG9zdFxcXFxpbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovJUU5JUExJUI5JUU3JTlCJUFFJUU1JThDJUJBL1ZTQ29kZVByb2plY3RzL015UHJvamVjdHMvdml0ZXByZXNzLXRoZW1lLXRlZWsvcGFja2FnZXMvY29uZmlnL3Bvc3QvaW5kZXgudHNcIjtpbXBvcnQgdHlwZSB7IEZpbGVDb250ZW50TG9hZGVyRGF0YSB9IGZyb20gXCJ2aXRlcHJlc3MtcGx1Z2luLWZpbGUtY29udGVudC1sb2FkZXJcIjtcclxuaW1wb3J0IHR5cGUgeyBUa0NvbnRlbnREYXRhLCBQb3N0RGF0YSB9IGZyb20gXCIuL3R5cGVzXCI7XHJcbmltcG9ydCB0eXBlIHsgUmVxdWlyZWRLZXlQYXJ0aWFsT3RoZXIgfSBmcm9tIFwiQHRlZWsvaGVscGVyXCI7XHJcbmltcG9ydCB7IFNpdGVDb25maWcgfSBmcm9tIFwidml0ZXByZXNzXCI7XHJcbmltcG9ydCB7IGdldFRpdGxlRnJvbU1kIH0gZnJvbSBcInZpdGVwcmVzcy1wbHVnaW4tc2lkZWJhci1yZXNvbHZlXCI7XHJcbmltcG9ydCB7IGJhc2VuYW1lLCBqb2luIH0gZnJvbSBcIm5vZGU6cGF0aFwiO1xyXG5pbXBvcnQgeyBzdGF0U3luYyB9IGZyb20gXCJub2RlOmZzXCI7XHJcbmltcG9ydCB7IGZvcm1hdERhdGUgfSBmcm9tIFwiQHRlZWsvaGVscGVyXCI7XHJcbmltcG9ydCB7XHJcbiAgZmlsdGVyUG9zdHMsXHJcbiAgZ2V0U29ydFBvc3RzQnlEYXRlQW5kU3RpY2t5LFxyXG4gIGdldFNvcnRQb3N0c0J5RGF0ZSxcclxuICBnZXRHcm91cFBvc3RzLFxyXG4gIGdldEdyb3VwQ2FyZHMsXHJcbiAgZ3JvdXBCeVllYXIsXHJcbiAgZ3JvdXBCeVllYXJNb250aCxcclxufSBmcm9tIFwiLi9oZWxwZXJcIjtcclxuaW1wb3J0IG1hdHRlciBmcm9tIFwiZ3JheS1tYXR0ZXJcIjtcclxuXHJcbi8vICEgXHU4QkU1XHU2NTg3XHU0RUY2XHU1M0VBXHU1NzI4IG5vZGUgXHU3M0FGXHU1ODgzXHU4RkQwXHU4ODRDXHVGRjBDXHU2NUUwXHU2Q0Q1XHU3NkY0XHU2M0E1XHU1NzI4IENsaWVudFx1RkYwOFx1NkQ0Rlx1ODlDOFx1NTY2OFx1RkYwOVx1NzNBRlx1NTg4M1x1OEZEMFx1ODg0Q1xyXG5cclxuLyoqXHJcbiAqIFx1OEY2Q1x1NjM2Mlx1NEUzQVx1NjU4N1x1N0FFMFx1NjU3MFx1NjM2RVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IHRyYW5zZm9ybURhdGEgPSAoZGF0YTogRmlsZUNvbnRlbnRMb2FkZXJEYXRhKTogVGtDb250ZW50RGF0YSA9PiB7XHJcbiAgY29uc3Qgc2l0ZUNvbmZpZzogU2l0ZUNvbmZpZyA9IChnbG9iYWxUaGlzIGFzIGFueSkuVklURVBSRVNTX0NPTkZJRztcclxuICBjb25zdCB7IHRoZW1lQ29uZmlnIH0gPSBzaXRlQ29uZmlnLnVzZXJDb25maWc7XHJcbiAgY29uc3QgeyBmcm9udG1hdHRlciwgdXJsLCBleGNlcnB0IH0gPSBkYXRhO1xyXG5cclxuICBpZiAoZnJvbnRtYXR0ZXIuZGF0ZSkgZnJvbnRtYXR0ZXIuZGF0ZSA9IGZvcm1hdERhdGUoZnJvbnRtYXR0ZXIuZGF0ZSk7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICB1cmw6IHVybCxcclxuICAgIGZyb250bWF0dGVyOiBmcm9udG1hdHRlcixcclxuICAgIGF1dGhvcjogdGhlbWVDb25maWcuYXV0aG9yLFxyXG4gICAgdGl0bGU6IGdldFRpdGxlKGRhdGEpLFxyXG4gICAgZGF0ZTogZ2V0RGF0ZShkYXRhLCBzaXRlQ29uZmlnLnNyY0RpciksXHJcbiAgICBleGNlcnB0LFxyXG4gICAgY2FwdHVyZTogZ2V0Q2FwdHVyZVRleHQoZGF0YSksXHJcbiAgfTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBcdThGNkNcdTYzNjJcdTRFM0FcdTU0MDRcdTRFMkFcdTY1ODdcdTdBRTBcdTRFMERcdTU0MENcdTdDN0JcdTU3OEJcdTc2ODRcdTY1NzBcdTYzNkVcclxuICovXHJcbmV4cG9ydCBjb25zdCB0cmFuc2Zvcm1SYXcgPSAocG9zdHM6IFRrQ29udGVudERhdGFbXSk6IFBvc3REYXRhID0+IHtcclxuICBjb25zdCBzaXRlQ29uZmlnOiBTaXRlQ29uZmlnID0gKGdsb2JhbFRoaXMgYXMgYW55KS5WSVRFUFJFU1NfQ09ORklHO1xyXG4gIGNvbnN0IHsgbG9jYWxlcyA9IHt9IH0gPSBzaXRlQ29uZmlnLnVzZXJDb25maWc7XHJcblxyXG4gIGNvbnN0IHBvc3RzRGF0YSA9IHJlc29sdmVQb3N0cyhwb3N0cyk7XHJcblxyXG4gIGNvbnN0IGxvY2FsZXNLZXlzID0gT2JqZWN0LmtleXMobG9jYWxlcyk7XHJcbiAgLy8gXHU2Q0ExXHU2NzA5XHU5MTREXHU3RjZFXHU1NkZEXHU5NjQ1XHU1MzE2XHVGRjBDXHU1MjE5XHU4RkQ0XHU1NkRFXHU2MjQwXHU2NzA5IHBvc3RzIFx1NjU3MFx1NjM2RVxyXG4gIGlmICghbG9jYWxlc0tleXMubGVuZ3RoKSByZXR1cm4gcG9zdHNEYXRhO1xyXG5cclxuICAvLyBcdTU2RkRcdTk2NDVcdTUzMTZcdTU5MDRcdTc0MDZcdUZGMENcdThCQTFcdTdCOTdcdTZCQ0ZcdTRFMkFcdThCRURcdThBMDBcdTc2RUVcdTVGNTVcdTRFMEJcdTc2ODQgcG9zdHMgXHU2NTcwXHU2MzZFXHJcbiAgY29uc3QgcG9zdHNMb2NhbGU6IFJlY29yZDxzdHJpbmcsIFBvc3REYXRhPiA9IHt9O1xyXG4gIGxvY2FsZXNLZXlzXHJcbiAgICAuZmlsdGVyKGxvY2FsZXNLZXkgPT4gbG9jYWxlc0tleSAhPT0gXCJyb290XCIpXHJcbiAgICAuZm9yRWFjaChsb2NhbGVzS2V5ID0+IHtcclxuICAgICAgY29uc3QgbG9jYWxlUG9zdHMgPSBwb3N0cy5maWx0ZXIocG9zdCA9PiBwb3N0LnVybC5zdGFydHNXaXRoKGAvJHtsb2NhbGVzS2V5fWApKTtcclxuICAgICAgcG9zdHNMb2NhbGVbbG9jYWxlc0tleV0gPSByZXNvbHZlUG9zdHMobG9jYWxlUG9zdHMpO1xyXG4gICAgfSk7XHJcblxyXG4gIC8vIHJvb3QgXHU1OTA0XHU3NDA2XHJcbiAgY29uc3Qgcm9vdFBvc3RzID0gcG9zdHMuZmlsdGVyKHBvc3QgPT4gIWxvY2FsZXNLZXlzLnNvbWUobG9jYWxlc0tleSA9PiBwb3N0LnVybC5zdGFydHNXaXRoKGAvJHtsb2NhbGVzS2V5fWApKSk7XHJcbiAgcG9zdHNMb2NhbGVbXCJyb290XCJdID0gcmVzb2x2ZVBvc3RzKHJvb3RQb3N0cyk7XHJcblxyXG4gIHJldHVybiB7IC4uLnBvc3RzRGF0YSwgbG9jYWxlczogcG9zdHNMb2NhbGUgfTtcclxufTtcclxuXHJcbmNvbnN0IHJlc29sdmVQb3N0cyA9IChwb3N0czogVGtDb250ZW50RGF0YVtdKTogUG9zdERhdGEgPT4ge1xyXG4gIGNvbnN0IG9yaWdpblBvc3RzID0gZmlsdGVyUG9zdHMocG9zdHMpO1xyXG4gIGNvbnN0IHNvcnRQb3N0c0J5RGF0ZUFuZFN0aWNreSA9IGdldFNvcnRQb3N0c0J5RGF0ZUFuZFN0aWNreShvcmlnaW5Qb3N0cyk7XHJcbiAgY29uc3Qgc29ydFBvc3RzQnlEYXRlID0gZ2V0U29ydFBvc3RzQnlEYXRlKG9yaWdpblBvc3RzKTtcclxuICBjb25zdCBncm91cFBvc3RzQnlZZWFyID0gZ3JvdXBCeVllYXIoc29ydFBvc3RzQnlEYXRlKTtcclxuICBjb25zdCBncm91cFBvc3RzQnlZZWFyTW9udGggPSBncm91cEJ5WWVhck1vbnRoKHNvcnRQb3N0c0J5RGF0ZSk7XHJcbiAgY29uc3QgZ3JvdXBQb3N0cyA9IGdldEdyb3VwUG9zdHMoc29ydFBvc3RzQnlEYXRlQW5kU3RpY2t5KTtcclxuICBjb25zdCBncm91cENhcmRzID0gZ2V0R3JvdXBDYXJkcyhncm91cFBvc3RzKTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIG9yaWdpblBvc3RzLFxyXG4gICAgc29ydFBvc3RzQnlEYXRlQW5kU3RpY2t5LFxyXG4gICAgc29ydFBvc3RzQnlEYXRlLFxyXG4gICAgZ3JvdXBQb3N0c0J5WWVhcixcclxuICAgIGdyb3VwUG9zdHNCeVllYXJNb250aCxcclxuICAgIGdyb3VwUG9zdHMsXHJcbiAgICBncm91cENhcmRzLFxyXG4gIH07XHJcbn07XHJcblxyXG4vKipcclxuICogXHU4M0I3XHU1M0Q2XHU2NTg3XHU3QUUwXHU2ODA3XHU5ODk4XHVGRjBDXHU4M0I3XHU1M0Q2XHU5ODdBXHU1RThGXHVGRjFBZnJvbnRtYXR0ZXIudGl0bGUgPiBtZCBcdTY1ODdcdTRFRjZcdTVGMDBcdTU5MzRcdTc2ODRcdTRFMDBcdTdFQTdcdTY4MDdcdTk4OTggPiBcdTY1ODdcdTRFRjZcdTU0MERcclxuICpcclxuICogQHBhcmFtIHBvc3QgXHU2NTg3XHU3QUUwXHU2NTcwXHU2MzZFXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGl0bGUocG9zdDogUmVxdWlyZWRLZXlQYXJ0aWFsT3RoZXI8VGtDb250ZW50RGF0YSwgXCJmcm9udG1hdHRlclwiIHwgXCJ1cmxcIj4pIHtcclxuICBpZiAocG9zdC5mcm9udG1hdHRlci50aXRsZSkgcmV0dXJuIHBvc3QuZnJvbnRtYXR0ZXIudGl0bGU7XHJcblxyXG4gIGNvbnN0IHsgY29udGVudCA9IFwiXCIgfSA9IG1hdHRlcihwb3N0LnNyYyB8fCBcIlwiLCB7fSk7XHJcbiAgY29uc3Qgc3BsaXROYW1lID0gYmFzZW5hbWUocG9zdC51cmwpLnNwbGl0KFwiLlwiKTtcclxuICAvLyBcdTU5ODJcdTY3OUNcdTc2RUVcdTVGNTVcdTRFMEJcdTY3MDkgaW5kZXgubWQgXHU0RTE0XHU2Q0ExXHU2NzA5XHU0RTAwXHU3RUE3XHU2ODA3XHU5ODk4XHVGRjBDXHU1MjE5XHU0RjdGXHU3NTI4XHU3NkVFXHU1RjU1XHU1NDBEXHU0RjVDXHU0RTNBXHU2NTg3XHU3QUUwXHU2ODA3XHU5ODk4XHJcbiAgY29uc3QgbmFtZSA9IHNwbGl0TmFtZS5sZW5ndGggPiAxID8gc3BsaXROYW1lWzFdIDogc3BsaXROYW1lWzBdO1xyXG4gIHJldHVybiBnZXRUaXRsZUZyb21NZChjb250ZW50KSB8fCBuYW1lIHx8IFwiXCI7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBcdTgzQjdcdTUzRDZcdTY1ODdcdTdBRTBcdTY1RjZcdTk1RjRcdUZGMENcdTgzQjdcdTUzRDZcdTk4N0FcdTVFOEZcdUZGMUFmcm9udG1hdHRlci5kYXRlID4gXHU2NTg3XHU0RUY2XHU1MjFCXHU1RUZBXHU2NUY2XHU5NUY0ID4gXHU1RjUzXHU1MjREXHU2NUY2XHU5NUY0XHJcbiAqXHJcbiAqIEBwYXJhbSBwb3N0IFx1NjU4N1x1N0FFMFx1NjU3MFx1NjM2RVxyXG4gKiBAcGFyYW0gc3JjRGlyIFx1OTg3OVx1NzZFRVx1N0VERFx1NUJGOVx1OERFRlx1NUY4NFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldERhdGUocG9zdDogUmVxdWlyZWRLZXlQYXJ0aWFsT3RoZXI8VGtDb250ZW50RGF0YSwgXCJmcm9udG1hdHRlclwiIHwgXCJ1cmxcIj4sIHNyY0Rpcjogc3RyaW5nKSB7XHJcbiAgY29uc3QgeyBmcm9udG1hdHRlciwgdXJsIH0gPSBwb3N0O1xyXG5cclxuICBpZiAoZnJvbnRtYXR0ZXIuZGF0ZSkgcmV0dXJuIGZyb250bWF0dGVyLmRhdGU7XHJcblxyXG4gIC8vIFx1NTk4Mlx1Njc5Q1x1NzZFRVx1NUY1NVx1NEUwQlx1OTc2Mlx1NjcwOSBpbmRleC5tZFx1RkYwQ1x1NTIxOSB1cmwgXHU0RTBEXHU2NjJGXHU3NkVFXHU1RjU1XHU1NDBEL2luZGV4XHVGRjBDXHU4MDBDXHU2NjJGXHU3NkVFXHU1RjU1XHU1NDBEL1x1RkYwQ1x1NTZFMFx1NkI2NFx1OTAxQVx1OEZDN1x1NTQwRVx1OTc2Mlx1NzY4NCAvIFx1Njc2NVx1ODg2NSBpbmRleC5tZFxyXG4gIGNvbnN0IGZpbGVQYXRoID0gam9pbihzcmNEaXIsIGAke3VybC5lbmRzV2l0aChcIi9cIikgPyBgJHt1cmx9L2luZGV4YCA6IHVybC5yZXBsYWNlKC9cXC5odG1sJC8sIFwiXCIpfS5tZGApO1xyXG4gIGNvbnN0IHN0YXQgPSBzdGF0U3luYyhmaWxlUGF0aCk7XHJcbiAgcmV0dXJuIGZvcm1hdERhdGUoc3RhdC5iaXJ0aHRpbWUgfHwgc3RhdC5hdGltZSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBcdTYyMkFcdTUzRDYgbWFya2Rvd24gXHU2NTg3XHU0RUY2XHU1MjREIGNvdW50IFx1NjU3MFx1NzY4NFx1NTE4NVx1NUJCOVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGdldENhcHR1cmVUZXh0ID0gKHBvc3Q6IFRrQ29udGVudERhdGEsIGNvdW50ID0gNDAwKSA9PiB7XHJcbiAgY29uc3QgeyBjb250ZW50ID0gXCJcIiB9ID0gbWF0dGVyKHBvc3Quc3JjIHx8IFwiXCIsIHt9KTtcclxuICByZXR1cm4gKFxyXG4gICAgY29udGVudFxyXG4gICAgICAvLyBcdTk5OTZcdTRFMkFcdTY4MDdcdTk4OThcclxuICAgICAgPy5yZXBsYWNlKC9eIytcXHMrLiovLCBcIlwiKVxyXG4gICAgICAvLyBcdTk2NjRcdTUzQkJcdTY4MDdcdTk4OThcclxuICAgICAgPy5yZXBsYWNlKC8jL2csIFwiXCIpXHJcbiAgICAgIC8vIFx1OTY2NFx1NTNCQlx1NTZGRVx1NzI0N1xyXG4gICAgICA/LnJlcGxhY2UoLyFcXFsuKj9cXF1cXCguKj9cXCkvZywgXCJcIilcclxuICAgICAgLy8gXHU5NjY0XHU1M0JCXHU5NEZFXHU2M0E1XHJcbiAgICAgID8ucmVwbGFjZSgvXFxbKC4qPylcXF1cXCguKj9cXCkvZywgXCIkMVwiKVxyXG4gICAgICAvLyBcdTk2NjRcdTUzQkJcdTUyQTBcdTdDOTdcclxuICAgICAgPy5yZXBsYWNlKC9cXCpcXCooLio/KVxcKlxcKi9nLCBcIiQxXCIpXHJcbiAgICAgIC8vIFx1OTY2NFx1NTNCQiBbW1RPQ11dXHJcbiAgICAgID8ucmVwbGFjZSgvXFxbXFxbVE9DXFxdXFxdL2csIFwiXCIpXHJcbiAgICAgIC8vIFx1NTNCQlx1OTY2NCA6OjogXHU1M0NBXHU1MTc2XHU1NDBFXHU5NzYyXHU3Njg0XHU1MTg1XHU1QkI5XHJcbiAgICAgID8ucmVwbGFjZSgvOjo6Lio/KFxcbnwkKS9nLCBcIlwiKVxyXG4gICAgICA/LnJlcGxhY2UoLzwhLS0gbW9yZSAtLT4vZywgXCJcIilcclxuICAgICAgPy5zcGxpdChcIlxcblwiKVxyXG4gICAgICA/LmZpbHRlcih2ID0+ICEhdilcclxuICAgICAgPy5qb2luKFwiXFxuXCIpXHJcbiAgICAgID8ucmVwbGFjZSgvPiguKikvLCBcIlwiKVxyXG4gICAgICA/LnJlcGxhY2UoLzwvZywgXCImbHQ7XCIpXHJcbiAgICAgIC5yZXBsYWNlKC8+L2csIFwiJmd0O1wiKVxyXG4gICAgICA/LnRyaW0oKVxyXG4gICAgICA/LnNsaWNlKDAsIGNvdW50KVxyXG4gICk7XHJcbn07XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRTpcXFxcXHU5ODc5XHU3NkVFXHU1MzNBXFxcXFZTQ29kZVByb2plY3RzXFxcXE15UHJvamVjdHNcXFxcdml0ZXByZXNzLXRoZW1lLXRlZWtcXFxccGFja2FnZXNcXFxcY29uZmlnXFxcXHBvc3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXFx1OTg3OVx1NzZFRVx1NTMzQVxcXFxWU0NvZGVQcm9qZWN0c1xcXFxNeVByb2plY3RzXFxcXHZpdGVwcmVzcy10aGVtZS10ZWVrXFxcXHBhY2thZ2VzXFxcXGNvbmZpZ1xcXFxwb3N0XFxcXGhlbHBlci50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovJUU5JUExJUI5JUU3JTlCJUFFJUU1JThDJUJBL1ZTQ29kZVByb2plY3RzL015UHJvamVjdHMvdml0ZXByZXNzLXRoZW1lLXRlZWsvcGFja2FnZXMvY29uZmlnL3Bvc3QvaGVscGVyLnRzXCI7aW1wb3J0IHR5cGUgeyBHcm91cENhcmRJdGVtLCBUa0NvbnRlbnREYXRhLCBQb3N0RGF0YSB9IGZyb20gXCIuL3R5cGVzXCI7XHJcblxyXG4vKipcclxuICogUG9zdCBcdTdBN0FcdTY1NzBcdTYzNkVcdUZGMENcdTY1QjlcdTRGQkZcdTVCOUFcdTRFNDlcdTdBN0FcdTVCRjlcdThDNjFcclxuICovXHJcbmV4cG9ydCBjb25zdCBlbXB0eVBvc3Q6IFBvc3REYXRhID0ge1xyXG4gIG9yaWdpblBvc3RzOiBbXSxcclxuICBzb3J0UG9zdHNCeURhdGVBbmRTdGlja3k6IFtdLFxyXG4gIHNvcnRQb3N0c0J5RGF0ZTogW10sXHJcbiAgZ3JvdXBQb3N0c0J5WWVhcjoge30sXHJcbiAgZ3JvdXBQb3N0c0J5WWVhck1vbnRoOiB7fSxcclxuICBncm91cFBvc3RzOiB7IGNhdGVnb3JpZXM6IHt9LCB0YWdzOiB7fSB9LFxyXG4gIGdyb3VwQ2FyZHM6IHsgY2F0ZWdvcmllczogW10sIHRhZ3M6IFtdIH0sXHJcbiAgbG9jYWxlczoge30sXHJcbn07XHJcblxyXG4vKipcclxuICogXHU4RkM3XHU2RUU0XHU5NzVFXHU2NTg3XHU3QUUwXHU5ODc1XHJcbiAqIEBwYXJhbSBwb3N0cyBcdTYyNDBcdTY3MDlcdTY1ODdcdTdBRTBcdTY1NzBcdTYzNkVcclxuICovXHJcbmV4cG9ydCBjb25zdCBmaWx0ZXJQb3N0cyA9IChwb3N0czogVGtDb250ZW50RGF0YVtdKTogVGtDb250ZW50RGF0YVtdID0+IHtcclxuICByZXR1cm4gcG9zdHMuZmlsdGVyKCh7IGZyb250bWF0dGVyOiB7IGFydGljbGUsIGxheW91dCB9IH0pID0+IGFydGljbGUgIT09IGZhbHNlICYmIGxheW91dCAhPT0gXCJob21lXCIpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFx1NjMwOVx1N0Y2RVx1OTg3Nlx1NTQ4Q1x1NjVGNlx1OTVGNFx1NjM5Mlx1NUU4RlxyXG4gKiBAcGFyYW0gcG9zdHMgXHU4RkM3XHU2RUU0XHU5NzVFXHU2NTg3XHU3QUUwXHU5ODc1XHU0RTRCXHU1NDBFXHU3Njg0XHU2NTg3XHU3QUUwXHU2NTcwXHU2MzZFXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgZ2V0U29ydFBvc3RzQnlEYXRlQW5kU3RpY2t5ID0gKHBvc3RzOiBUa0NvbnRlbnREYXRhW10pOiBUa0NvbnRlbnREYXRhW10gPT4ge1xyXG4gIC8vIHNvcnQgXHU0RjFBXHU2NTM5XHU1M0Q4XHU1MzlGXHU2NTcwXHU3RUM0XHVGRjBDXHU1NkUwXHU2QjY0XHU3ODZFXHU0RkREXHU1M0MyXHU2NTcwXHU0RTBEXHU4OEFCXHU0RkVFXHU2NTM5XHVGRjBDXHU1OTBEXHU2NzQyXHU0RTAwXHU0RUZEXHJcbiAgY29uc3QgcCA9IFsuLi5wb3N0c107XHJcbiAgcmV0dXJuIHAuc29ydCgocHJldiwgbmV4dCkgPT4ge1xyXG4gICAgLy8gXHU1MTQ4XHU2ODM5XHU2MzZFIHN0aWNreSBcdTYzOTJcdTVFOEZcdUZGMENzdGlja3kgXHU1MDNDXHU4RDhBXHU1OTI3XHU4RDhBXHU5NzYwXHU1MjREXHVGRjBDXHU1OTgyXHU2NzlDIHN0aWNreSBcdTc2RjhcdTU0MENcdUZGMENcdTUyMTlcdTYzMDlcdTY1RjZcdTk1RjRcdTYzOTJcdTVFOEZcclxuICAgIGNvbnN0IHByZXZTdGlja3kgPSBwcmV2LmZyb250bWF0dGVyLnN0aWNreTtcclxuICAgIGNvbnN0IG5leHRTdGlja3kgPSBuZXh0LmZyb250bWF0dGVyLnN0aWNreTtcclxuXHJcbiAgICBpZiAocHJldlN0aWNreSAmJiBuZXh0U3RpY2t5KSByZXR1cm4gcHJldlN0aWNreSA9PT0gbmV4dFN0aWNreSA/IGNvbXBhcmVEYXRlKHByZXYsIG5leHQpIDogcHJldlN0aWNreSAtIG5leHRTdGlja3k7XHJcbiAgICBpZiAocHJldlN0aWNreSkgcmV0dXJuIC0xO1xyXG4gICAgaWYgKG5leHRTdGlja3kpIHJldHVybiAxO1xyXG5cclxuICAgIHJldHVybiBjb21wYXJlRGF0ZShwcmV2LCBuZXh0KTtcclxuICB9KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBcdTYzMDlcdTY1RjZcdTk1RjRcdTYzOTJcdTVFOEZcclxuICogQHBhcmFtIHBvc3RzIFx1OEZDN1x1NkVFNFx1OTc1RVx1NjU4N1x1N0FFMFx1OTg3NVx1NEU0Qlx1NTQwRVx1NzY4NFx1NjU4N1x1N0FFMFx1NjU3MFx1NjM2RVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGdldFNvcnRQb3N0c0J5RGF0ZSA9IChwb3N0czogVGtDb250ZW50RGF0YVtdKTogVGtDb250ZW50RGF0YVtdID0+IHtcclxuICAvLyBzb3J0IFx1NEYxQVx1NjUzOVx1NTNEOFx1NTM5Rlx1NjU3MFx1N0VDNFx1RkYwQ1x1NTZFMFx1NkI2NFx1Nzg2RVx1NEZERFx1NTNDMlx1NjU3MFx1NEUwRFx1ODhBQlx1NEZFRVx1NjUzOVx1RkYwQ1x1NTkwRFx1Njc0Mlx1NEUwMFx1NEVGRFxyXG4gIGNvbnN0IHAgPSBbLi4ucG9zdHNdO1xyXG4gIHJldHVybiBwLnNvcnQoKHByZXYsIG5leHQpID0+IGNvbXBhcmVEYXRlKHByZXYsIG5leHQpKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBcdTYzMDlcdTUyMDZcdTdDN0JcdTU0OENcdTY4MDdcdTdCN0VcdTUyMDZcdTdFQzRcclxuICogQHBhcmFtICBwb3N0cyBcdTYzMDlcdTY1RjZcdTk1RjRcdTYzOTJcdTVFOEZcdTRFNEJcdTU0MEVcdTc2ODRcdTY1ODdcdTdBRTBcdTY1NzBcdTYzNkVcclxuICovXHJcbmV4cG9ydCBjb25zdCBnZXRHcm91cFBvc3RzID0gKHBvc3RzOiBUa0NvbnRlbnREYXRhW10pOiBQb3N0RGF0YVtcImdyb3VwUG9zdHNcIl0gPT4ge1xyXG4gIGNvbnN0IGNhdGVnb3JpZXNPYmo6IFJlY29yZDxzdHJpbmcsIFRrQ29udGVudERhdGFbXT4gPSB7fTtcclxuICBjb25zdCB0YWdzT2JqOiBSZWNvcmQ8c3RyaW5nLCBUa0NvbnRlbnREYXRhW10+ID0ge307XHJcblxyXG4gIHBvc3RzLmZvckVhY2gocG9zdCA9PiB7XHJcbiAgICBjb25zdCB7IGNhdGVnb3JpZXMsIHRhZ3MgfSA9IHBvc3QuZnJvbnRtYXR0ZXIgYXMgeyBjYXRlZ29yaWVzOiBzdHJpbmdbXTsgdGFnczogc3RyaW5nW107IFtrZXk6IHN0cmluZ106IGFueSB9O1xyXG5cclxuICAgIFtjYXRlZ29yaWVzIHx8IFtdXS5mbGF0KCkuZm9yRWFjaChjYXRlZ29yeSA9PiB7XHJcbiAgICAgIGlmIChjYXRlZ29yeSkge1xyXG4gICAgICAgIGlmICghY2F0ZWdvcmllc09ialtjYXRlZ29yeV0pIGNhdGVnb3JpZXNPYmpbY2F0ZWdvcnldID0gW107XHJcbiAgICAgICAgY2F0ZWdvcmllc09ialtjYXRlZ29yeV0ucHVzaChwb3N0KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgW3RhZ3MgfHwgW11dLmZsYXQoKS5mb3JFYWNoKHRhZyA9PiB7XHJcbiAgICAgIGlmICh0YWcpIHtcclxuICAgICAgICBpZiAoIXRhZ3NPYmpbdGFnXSkgdGFnc09ialt0YWddID0gW107XHJcbiAgICAgICAgdGFnc09ialt0YWddLnB1c2gocG9zdCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgY2F0ZWdvcmllczogY2F0ZWdvcmllc09iaixcclxuICAgIHRhZ3M6IHRhZ3NPYmosXHJcbiAgfTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBcdTgzQjdcdTUzRDZcdTYyNDBcdTY3MDlcdTUyMDZcdTdDN0JcdTU0OENcdTY4MDdcdTdCN0VcclxuICogQHBhcmFtICBncm91cFBvc3RzIFx1NjMwOVx1NTIwNlx1N0M3Qlx1NTQ4Q1x1NjgwN1x1N0I3RVx1NTIwNlx1N0VDNFx1NEU0Qlx1NTQwRVx1NzY4NFx1NjU4N1x1N0FFMFx1NjU3MFx1NjM2RVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGdldEdyb3VwQ2FyZHMgPSAoZ3JvdXBQb3N0czogUG9zdERhdGFbXCJncm91cFBvc3RzXCJdKTogUG9zdERhdGFbXCJncm91cENhcmRzXCJdID0+IHtcclxuICBjb25zdCBjYXRlZ29yaWVzQXJyOiBHcm91cENhcmRJdGVtW10gPSBbXTtcclxuICBjb25zdCB0YWdzQXJyOiBHcm91cENhcmRJdGVtW10gPSBbXTtcclxuXHJcbiAgZm9yIChjb25zdCBrZXkgaW4gZ3JvdXBQb3N0cy5jYXRlZ29yaWVzKSBjYXRlZ29yaWVzQXJyLnB1c2goeyBuYW1lOiBrZXksIGxlbmd0aDogZ3JvdXBQb3N0cy5jYXRlZ29yaWVzW2tleV0ubGVuZ3RoIH0pO1xyXG5cclxuICBmb3IgKGNvbnN0IGtleSBpbiBncm91cFBvc3RzLnRhZ3MpIHRhZ3NBcnIucHVzaCh7IG5hbWU6IGtleSwgbGVuZ3RoOiBncm91cFBvc3RzLnRhZ3Nba2V5XS5sZW5ndGggfSk7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBjYXRlZ29yaWVzOiBjYXRlZ29yaWVzQXJyLFxyXG4gICAgdGFnczogdGFnc0FycixcclxuICB9O1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFx1ODNCN1x1NTNENlx1NjU4N1x1N0FFMFx1NjVGNlx1OTVGNFx1NjIzM1xyXG4gKiBAcGFyYW0gcG9zdCBcdTY1ODdcdTdBRTBcdTY1NzBcdTYzNkVcclxuICovXHJcbmV4cG9ydCBjb25zdCBnZXRQb3N0c1RpbWUgPSAocG9zdDogVGtDb250ZW50RGF0YSk6IG51bWJlciA9PiB7XHJcbiAgY29uc3QgZGF0ZVN0ciA9IHBvc3QuZGF0ZTtcclxuICBjb25zdCBkYXRlID0gZGF0ZVN0ciA/IG5ldyBEYXRlKGRhdGVTdHIpIDogbmV3IERhdGUoKTtcclxuICBpZiAoKGRhdGUgYXMgdW5rbm93biBhcyBzdHJpbmcpID09PSBcIkludmFsaWQgRGF0ZVwiICYmIGRhdGVTdHIpIHtcclxuICAgIHJldHVybiBuZXcgRGF0ZShkYXRlU3RyLnJlcGxhY2UoLy0vZywgXCIvXCIpKS5nZXRUaW1lKCk7XHJcbiAgfVxyXG4gIHJldHVybiBkYXRlLmdldFRpbWUoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBcdTY1ODdcdTdBRTBcdTY1RjZcdTk1RjRcdTYzOTJcdTVFOEZcclxuICogQHBhcmFtIHByZXYgXHU2NTg3XHU3QUUwIDFcclxuICogQHBhcmFtIG5leHQgXHU2NTg3XHU3QUUwIDJcclxuICovXHJcbmV4cG9ydCBjb25zdCBjb21wYXJlRGF0ZSA9IChwcmV2OiBUa0NvbnRlbnREYXRhLCBuZXh0OiBUa0NvbnRlbnREYXRhKSA9PiB7XHJcbiAgcmV0dXJuIGdldFBvc3RzVGltZShuZXh0KSAtIGdldFBvc3RzVGltZShwcmV2KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBcdTY4MzlcdTYzNkVcdTVFNzRcdTRFRkRcdTUyMDZcdTdFQzRcdUZGMENrZXkgXHU0RTNBXHU1RTc0XHU0RUZEXHVGRjBDdmFsdWUgXHU0RTNBXHU4QkU1XHU1RTc0XHU0RUZEXHU3Njg0XHU2NTg3XHU3QUUwXHU1MjE3XHU4ODY4XHVGRjBDXHU1OTgyIHsgMjAyNTogW3t9LCB7fV0sIDIwMjQ6IFt7fSwge31dIH1cclxuICogQHBhcmFtIHBvc3RzIFx1NjU4N1x1N0FFMFx1NTIxN1x1ODg2OFxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGdyb3VwQnlZZWFyID0gKHBvc3RzOiBUa0NvbnRlbnREYXRhW10pID0+IHtcclxuICByZXR1cm4gcG9zdHMucmVkdWNlKFxyXG4gICAgKHByZSwgY3VyKSA9PiB7XHJcbiAgICAgIC8vIFx1NTJBMFx1NEUyQVx1N0E3QVx1NjgzQ1x1OEY2Q1x1NEUzQVx1NUI1N1x1N0IyNlx1NEUzMlx1RkYwQ1x1OTA3Rlx1NTE0RFx1NzUxRlx1NEVBN1x1NzY4NFx1NUJGOVx1OEM2MVx1ODFFQVx1NTJBOFx1NjgzOVx1NjM2RVx1NjU3MFx1NUI1N1x1NjM5Mlx1NUU4Rlx1RkYwOFx1NUI1N1x1N0IyNlx1NEUzMlx1NjU3MFx1NUI1N1x1NEU1Rlx1NEYxQVx1ODFFQVx1NUI5QVx1NEU0OVx1NjM5Mlx1NUU4Rlx1RkYwQ1x1NTZFMFx1NkI2NFx1NTJBMFx1NEUyQVx1N0E3QVx1NjgzQ1x1RkYwOVxyXG4gICAgICBjb25zdCB5ZWFyID0gbmV3IERhdGUoY3VyLmRhdGUgfHwgY3VyLmZyb250bWF0dGVyLmRhdGUpLmdldEZ1bGxZZWFyKCkgKyBcIiBcIjtcclxuICAgICAgaWYgKCFwcmVbeWVhcl0pIHByZVt5ZWFyXSA9IFtdO1xyXG5cclxuICAgICAgcHJlW3llYXJdLnB1c2goY3VyKTtcclxuICAgICAgcmV0dXJuIHByZTtcclxuICAgIH0sXHJcbiAgICB7fSBhcyBQb3N0RGF0YVtcImdyb3VwUG9zdHNCeVllYXJcIl1cclxuICApO1xyXG59O1xyXG4vKipcclxuICogXHU2ODM5XHU2MzZFXHU1RTc0XHU0RUZEXHU1NDhDXHU2NzA4XHU0RUZEXHU1MjA2XHU3RUM0XHVGRjBDa2V5IFx1NEUzQVx1NUU3NFx1NEVGRFx1RkYwQ3ZhbHVlIFx1NEUzQVx1OEJFNVx1NUU3NFx1NEVGRFx1NzY4NFx1NjcwOFx1NEVGRFx1NTIwNlx1N0VDNFx1RkYwQ1x1NTk4Mlx1RkYxQXsgMjAyNTogeyAwMTogW3t9LCB7fV0sIDAyOiBbe30sIHt9XSB9LCAyMDI0OiB7IDAxOiBbXSwgMDI6IFt7fSwge31dIH0gfVxyXG4gKiBAcGFyYW0gcG9zdHMgXHU2NTg3XHU3QUUwXHU1MjE3XHU4ODY4XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgZ3JvdXBCeVllYXJNb250aCA9IChwb3N0czogVGtDb250ZW50RGF0YVtdKSA9PiB7XHJcbiAgcmV0dXJuIHBvc3RzLnJlZHVjZShcclxuICAgIChwcmUsIGN1cikgPT4ge1xyXG4gICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoY3VyLmRhdGUgfHwgY3VyLmZyb250bWF0dGVyLmRhdGUpO1xyXG4gICAgICAvLyBcdTUyQTBcdTRFMkFcdTdBN0FcdTY4M0NcdThGNkNcdTVCNTdcdTdCMjZcdTRFMzJcdUZGMENcdTkwN0ZcdTUxNERcdTc1MUZcdTYyMTBcdTc2ODRcdTVCRjlcdThDNjFcdTgxRUFcdTUyQThcdTY4MzlcdTYzNkVcdTY1NzBcdTVCNTdcdTYzOTJcdTVFOEZcdUZGMDhcdTVCNTdcdTdCMjZcdTRFMzJcdTY1NzBcdTVCNTdcdTRFNUZcdTRGMUFcdTgxRUFcdTVCOUFcdTRFNDlcdTYzOTJcdTVFOEZcdUZGMENcdTU2RTBcdTZCNjRcdTUyQTBcdTRFMkFcdTdBN0FcdTY4M0NcdUZGMDlcclxuICAgICAgY29uc3QgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKSArIFwiIFwiO1xyXG4gICAgICBjb25zdCBtb250aCA9IFN0cmluZyhkYXRlLmdldE1vbnRoKCkgKyAxKS5wYWRTdGFydCgyLCBcIjBcIik7XHJcbiAgICAgIGlmICghcHJlW3llYXJdKSBwcmVbeWVhcl0gPSB7fTtcclxuICAgICAgaWYgKCFwcmVbeWVhcl1bbW9udGhdKSBwcmVbeWVhcl1bbW9udGhdID0gW107XHJcblxyXG4gICAgICBwcmVbeWVhcl1bbW9udGhdLnB1c2goY3VyKTtcclxuICAgICAgcmV0dXJuIHByZTtcclxuICAgIH0sXHJcbiAgICB7fSBhcyBQb3N0RGF0YVtcImdyb3VwUG9zdHNCeVllYXJNb250aFwiXVxyXG4gICk7XHJcbn07XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRTpcXFxcXHU5ODc5XHU3NkVFXHU1MzNBXFxcXFZTQ29kZVByb2plY3RzXFxcXE15UHJvamVjdHNcXFxcdml0ZXByZXNzLXRoZW1lLXRlZWtcXFxccGFja2FnZXNcXFxcbWFya2Rvd25cXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcXHU5ODc5XHU3NkVFXHU1MzNBXFxcXFZTQ29kZVByb2plY3RzXFxcXE15UHJvamVjdHNcXFxcdml0ZXByZXNzLXRoZW1lLXRlZWtcXFxccGFja2FnZXNcXFxcbWFya2Rvd25cXFxccGx1Z2luc1xcXFx0b2RvLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi8lRTklQTElQjklRTclOUIlQUUlRTUlOEMlQkEvVlNDb2RlUHJvamVjdHMvTXlQcm9qZWN0cy92aXRlcHJlc3MtdGhlbWUtdGVlay9wYWNrYWdlcy9tYXJrZG93bi9wbHVnaW5zL3RvZG8udHNcIjtpbXBvcnQgdHlwZSBNYXJrZG93bkl0IGZyb20gXCJtYXJrZG93bi1pdFwiO1xyXG5cclxuY29uc3QgdG9kb1VuY2hlY2sgPSBcIlsgXSBcIjtcclxuY29uc3QgdG9kb0NoZWNrID0gXCJbeF0gXCI7XHJcblxyXG4vKipcclxuICogbWFya2Rvd24gVE9ETyBcdTUyMTdcdTg4NjhcdTYzRDJcdTRFRjZcclxuICpcclxuICogXHU0RjdGXHU3NTI4XHVGRjFBXHJcbiAqIC0gWyBdIFx1NTQwM1x1OTk2RFxyXG4gKiAtIFsgXSBcdTc3NjFcdTg5QzlcclxuICogLSBbeF0gXHU2MjUzXHU4QzQ2XHU4QzQ2XHJcbiAqXHJcbiAqIC0gXHU1M0VGXHU0RUU1XHU2MzYyXHU2MjEwIDEuIFx1NjIxNiAqIFx1NjIxNiArIFx1N0I0OVx1NTIxN1x1ODg2OFx1NzY4NFx1NjgwN1x1OEJCMFxyXG4gKi9cclxuY29uc3QgdG9kb1BsdWdpbiA9IChtZDogTWFya2Rvd25JdCkgPT4ge1xyXG4gIG1kLnJlbmRlcmVyLnJ1bGVzLmxpc3RfaXRlbV9vcGVuID0gKHRva2VucywgaWR4LCBvcHRpb25zLCBfOiBhbnksIHNlbGYpID0+IHtcclxuICAgIGZvciAobGV0IGkgPSBpZHggKyAxOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IHRva2VuID0gdG9rZW5zW2ldO1xyXG4gICAgICAvLyBcdTU5ODJcdTY3OUNcdTY3NjVcdTUyMzAgPC9saT4gXHU2ODA3XHU3QjdFXHVGRjBDXHU1MjE5XHU3RUQzXHU2NzVGXHU1RkFBXHU3M0FGXHJcbiAgICAgIGlmICh0b2tlbi50eXBlID09PSBcImxpc3RfaXRlbV9jbG9zZVwiKSBicmVhaztcclxuXHJcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSB0b2tlbi5jb250ZW50O1xyXG5cclxuICAgICAgaWYgKGNvbnRlbnQ/LnN0YXJ0c1dpdGgodG9kb1VuY2hlY2spIHx8IGNvbnRlbnQ/LnN0YXJ0c1dpdGgodG9kb0NoZWNrKSkge1xyXG4gICAgICAgIGNvbnN0IGlzQ2hlY2tlZCA9IGNvbnRlbnQuc3RhcnRzV2l0aCh0b2RvQ2hlY2spO1xyXG4gICAgICAgIGNvbnN0IGNoZWNrYm94ID0gYDxpbnB1dCBjbGFzcz1cInRvZG8tY2hlY2tib3hcIiB0eXBlPVwiY2hlY2tib3hcIiAke2lzQ2hlY2tlZCA/IFwiY2hlY2tlZFwiIDogXCJcIn0gZGlzYWJsZWQgLz5gO1xyXG5cclxuICAgICAgICAvLyBcdTUzOUZcdTUxODVcdTVCQjlcdTc5RkJcdTk2NjQgXCJbIF0gXCIgXHU2MjE2IFwiW3hdIFwiXHJcbiAgICAgICAgY29uc3QgdGV4dCA9IGNvbnRlbnQuc2xpY2UoNCk7XHJcbiAgICAgICAgdG9rZW4uY29udGVudCA9IHRleHQ7XHJcbiAgICAgICAgaWYgKHRva2VuLmNoaWxkcmVuKSB0b2tlbi5jaGlsZHJlblswXS5jb250ZW50ID0gdGV4dDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGA8bGkgY2xhc3M9XCJ0b2RvXCI+JHtjaGVja2JveH1gO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBcdTU5ODJcdTY3OUNcdTRFMERcdTY2MkYgVE9ETyBcdTk4NzlcdUZGMENcdThGRDRcdTU2REVcdTlFRDhcdThCQTRcdTc2ODRcdTZFMzJcdTY3RDNcdTdFRDNcdTY3OUNcclxuICAgIHJldHVybiBzZWxmLnJlbmRlclRva2VuKHRva2VucywgaWR4LCBvcHRpb25zKTtcclxuICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgdG9kb1BsdWdpbjtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxcdTk4NzlcdTc2RUVcdTUzM0FcXFxcVlNDb2RlUHJvamVjdHNcXFxcTXlQcm9qZWN0c1xcXFx2aXRlcHJlc3MtdGhlbWUtdGVla1xcXFxwYWNrYWdlc1xcXFxtYXJrZG93blxcXFxoZWxwZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXFx1OTg3OVx1NzZFRVx1NTMzQVxcXFxWU0NvZGVQcm9qZWN0c1xcXFxNeVByb2plY3RzXFxcXHZpdGVwcmVzcy10aGVtZS10ZWVrXFxcXHBhY2thZ2VzXFxcXG1hcmtkb3duXFxcXGhlbHBlclxcXFxzaW1wbGVDb250YWluZXIudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6LyVFOSVBMSVCOSVFNyU5QiVBRSVFNSU4QyVCQS9WU0NvZGVQcm9qZWN0cy9NeVByb2plY3RzL3ZpdGVwcmVzcy10aGVtZS10ZWVrL3BhY2thZ2VzL21hcmtkb3duL2hlbHBlci9zaW1wbGVDb250YWluZXIudHNcIjtpbXBvcnQgdHlwZSBNYXJrZG93bkl0IGZyb20gXCJtYXJrZG93bi1pdFwiO1xyXG5pbXBvcnQgdHlwZSB7IFRva2VuIH0gZnJvbSBcIm1hcmtkb3duLWl0L2Rpc3QvaW5kZXguY2pzLmpzXCI7XHJcbmltcG9ydCBjb250YWluZXIgZnJvbSBcIm1hcmtkb3duLWl0LWNvbnRhaW5lclwiO1xyXG5cclxuZXhwb3J0IHR5cGUgQ29udGFpbmVyQXJncyA9IFt0eXBlb2YgY29udGFpbmVyLCBzdHJpbmcsIHsgcmVuZGVyOiAodG9rZW5zOiBUb2tlbltdLCBpZHg6IG51bWJlcikgPT4gc3RyaW5nIH1dO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDb250YWluZXJPcHRpb24ge1xyXG4gIC8qKlxyXG4gICAqIFx1NUJCOVx1NTY2OFx1N0M3Qlx1NTc4QlxyXG4gICAqL1xyXG4gIHR5cGU6IHN0cmluZztcclxuICAvKipcclxuICAgKiBcdTY2MkZcdTU0MjZcdTRGN0ZcdTc1MjhcdTY4MDdcdTk4OThcclxuICAgKi9cclxuICB1c2VUaXRsZT86IGJvb2xlYW47XHJcbiAgLyoqXHJcbiAgICogXHU5RUQ4XHU4QkE0XHU2ODA3XHU5ODk4XHJcbiAgICovXHJcbiAgZGVmYXVsdFRpdGxlPzogc3RyaW5nO1xyXG4gIC8qKlxyXG4gICAqIFx1NUJCOVx1NTY2OFx1N0M3Qlx1NTQwRFxyXG4gICAqL1xyXG4gIGNsYXNzTmFtZT86IHN0cmluZztcclxufVxyXG5cclxuLyoqXHJcbiAqIFx1NTIxQlx1NUVGQVx1NEUwMFx1NEUyQVx1ODFFQVx1NUI5QVx1NEU0OVx1NzY4NFx1NUJCOVx1NTY2OFx1RkYwQ1x1NUU3Nlx1NEY3Rlx1NzUyOFxyXG4gKlxyXG4gKiBAcGFyYW0gbWQgbWFya2Rvd24taXQgXHU1QjlFXHU0RjhCXHJcbiAqIEBwYXJhbSBvcHRpb24gXHU1QkI5XHU1NjY4XHU5MTREXHU3RjZFXHU5ODc5XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgY3JlYXRlQ29udGFpbmVyVGhlblVzZSA9IChtZDogTWFya2Rvd25JdCwgb3B0aW9uOiBDb250YWluZXJPcHRpb24pID0+IHtcclxuICBtZC51c2UoLi4uY3JlYXRlQ29udGFpbmVyVGhlbkdldChtZCwgb3B0aW9uKSk7XHJcbn07XHJcblxyXG4vKipcclxuICogXHU1MjFCXHU1RUZBXHU0RTAwXHU0RTJBXHU4MUVBXHU1QjlBXHU0RTQ5XHU3Njg0XHU1QkI5XHU1NjY4XHVGRjBDXHU1RTc2XHU4RkQ0XHU1NkRFXHJcbiAqXHJcbiAqIEBwYXJhbSBtZCBtYXJrZG93bi1pdCBcdTVCOUVcdTRGOEJcclxuICogQHBhcmFtIG9wdGlvbiBcdTVCQjlcdTU2NjhcdTkxNERcdTdGNkVcdTk4NzlcclxuICovXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVDb250YWluZXJUaGVuR2V0ID0gKG1kOiBNYXJrZG93bkl0LCBvcHRpb246IENvbnRhaW5lck9wdGlvbik6IENvbnRhaW5lckFyZ3MgPT4ge1xyXG4gIGNvbnN0IHsgdHlwZSwgdXNlVGl0bGUsIGRlZmF1bHRUaXRsZSwgY2xhc3NOYW1lIH0gPSBvcHRpb247XHJcbiAgcmV0dXJuIFtcclxuICAgIGNvbnRhaW5lcixcclxuICAgIHR5cGUsXHJcbiAgICB7XHJcbiAgICAgIHJlbmRlcih0b2tlbnM6IFRva2VuW10sIGlkeDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgdG9rZW4gPSB0b2tlbnNbaWR4XTtcclxuICAgICAgICBjb25zdCBpbmZvID0gdG9rZW4uaW5mby50cmltKCkuc2xpY2UodHlwZS5sZW5ndGgpLnRyaW0oKTtcclxuXHJcbiAgICAgICAgaWYgKHRva2VuLm5lc3RpbmcgPT09IDEpIHtcclxuICAgICAgICAgIGNvbnN0IHRpdGxlID0gdXNlVGl0bGUgPyBtZC5yZW5kZXJJbmxpbmUoaW5mbyB8fCBkZWZhdWx0VGl0bGUgfHwgXCJcIikgOiBcIlwiO1xyXG4gICAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwiJHt0eXBlfSAke2NsYXNzTmFtZX1cIj4ke3VzZVRpdGxlID8gYDxwIGNsYXNzPVwidGl0bGUgJHt0eXBlfS10aXRsZSAke2NsYXNzTmFtZSA/IGAke2NsYXNzTmFtZX0tdGl0bGVgIDogXCJcIn1cIj4ke3RpdGxlfTwvcD5gIDogXCJcIn1cXG5gO1xyXG4gICAgICAgIH0gZWxzZSByZXR1cm4gYDwvZGl2PlxcbmA7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIF07XHJcbn07XHJcblxyXG4vKipcclxuICogXHU1MjFCXHU1RUZBXHU1OTFBXHU0RTJBXHU4MUVBXHU1QjlBXHU0RTQ5XHU3Njg0XHU1QkI5XHU1NjY4XHVGRjBDXHU1RTc2XHU0RjdGXHU3NTI4XHJcbiAqXHJcbiAqIEBwYXJhbSBtZCBtYXJrZG93bi1pdCBcdTVCOUVcdTRGOEJcclxuICogQHBhcmFtIG9wdGlvbnMgXHU1QkI5XHU1NjY4XHU5MTREXHU3RjZFXHU5ODc5XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgY3JlYXRlQ29udGFpbmVyc1RoZW5Vc2UgPSAobWQ6IE1hcmtkb3duSXQsIG9wdGlvbnM6IENvbnRhaW5lck9wdGlvbltdKSA9PiB7XHJcbiAgb3B0aW9ucy5mb3JFYWNoKG9wdGlvbiA9PiB7XHJcbiAgICBtZC51c2UoLi4uY3JlYXRlQ29udGFpbmVyVGhlbkdldChtZCwgb3B0aW9uKSk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vKipcclxuICogXHU1MjFCXHU1RUZBXHU1OTFBXHU0RTJBXHU4MUVBXHU1QjlBXHU0RTQ5XHU3Njg0XHU1QkI5XHU1NjY4XHVGRjBDXHU1RTc2XHU4RkQ0XHU1NkRFXHJcbiAqXHJcbiAqIEBwYXJhbSBtZCBtYXJrZG93bi1pdCBcdTVCOUVcdTRGOEJcclxuICogQHBhcmFtIG9wdGlvbnMgXHU1QkI5XHU1NjY4XHU5MTREXHU3RjZFXHU5ODc5XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgY3JlYXRlQ29udGFpbmVyc1RoZW5HZXQgPSAobWQ6IE1hcmtkb3duSXQsIG9wdGlvbnM6IENvbnRhaW5lck9wdGlvbltdKSA9PiB7XHJcbiAgY29uc3QgY29udGFpbmVyczogQ29udGFpbmVyQXJnc1tdID0gW107XHJcblxyXG4gIG9wdGlvbnMuZm9yRWFjaChvcHRpb24gPT4ge1xyXG4gICAgY29udGFpbmVycy5wdXNoKGNyZWF0ZUNvbnRhaW5lclRoZW5HZXQobWQsIG9wdGlvbikpO1xyXG4gIH0pO1xyXG5cclxuICByZXR1cm4gY29udGFpbmVycztcclxufTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxcdTk4NzlcdTc2RUVcdTUzM0FcXFxcVlNDb2RlUHJvamVjdHNcXFxcTXlQcm9qZWN0c1xcXFx2aXRlcHJlc3MtdGhlbWUtdGVla1xcXFxwYWNrYWdlc1xcXFxtYXJrZG93blxcXFxoZWxwZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXFx1OTg3OVx1NzZFRVx1NTMzQVxcXFxWU0NvZGVQcm9qZWN0c1xcXFxNeVByb2plY3RzXFxcXHZpdGVwcmVzcy10aGVtZS10ZWVrXFxcXHBhY2thZ2VzXFxcXG1hcmtkb3duXFxcXGhlbHBlclxcXFxjYXJkQ29udGFpbmVyLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi8lRTklQTElQjklRTclOUIlQUUlRTUlOEMlQkEvVlNDb2RlUHJvamVjdHMvTXlQcm9qZWN0cy92aXRlcHJlc3MtdGhlbWUtdGVlay9wYWNrYWdlcy9tYXJrZG93bi9oZWxwZXIvY2FyZENvbnRhaW5lci50c1wiO2ltcG9ydCB0eXBlIE1hcmtkb3duSXQgZnJvbSBcIm1hcmtkb3duLWl0XCI7XHJcbmltcG9ydCB0eXBlIHsgVG9rZW4gfSBmcm9tIFwibWFya2Rvd24taXRcIjtcclxuaW1wb3J0IGNvbnRhaW5lciBmcm9tIFwibWFya2Rvd24taXQtY29udGFpbmVyXCI7XHJcbmltcG9ydCB5YW1sIGZyb20gXCJqcy15YW1sXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENhcmRDb250YWluZXJPcHRpb248RCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4sIEMgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+PiB7XHJcbiAgLyoqXHJcbiAgICogXHU1QkI5XHU1NjY4XHU3QzdCXHU1NzhCXHJcbiAgICovXHJcbiAgdHlwZTogc3RyaW5nO1xyXG4gIC8qKlxyXG4gICAqIFx1NUJCOVx1NTY2OFx1N0M3Qlx1NTQwRFxyXG4gICAqL1xyXG4gIGNsYXNzTmFtZT86IHN0cmluZztcclxuICAvKipcclxuICAgKiBcdTZFMzJcdTY3RDMgSFRNTCBcdTUyNERcdTdBRUZcdTc2ODRcdTU2REVcdThDMDNcdUZGMENcdThGRDRcdTU2REUgZmFsc2UgXHU1MjE5XHU0RTBEXHU2RTMyXHU2N0QzXHU1QkI5XHU1NjY4XHVGRjBDXHU4RkQ0XHU1NkRFIHRydWUgXHU1MjE5XHU3RUU3XHU3RUVEXHU2RTMyXHU2N0QzXHU1QkI5XHU1NjY4XHJcbiAgICovXHJcbiAgYmVmb3JlSHRtbFJlbmRlcj86IChcclxuICAgIHByb3BzOiB7IGRhdGE6IERbXTsgY29uZmlnOiBDIH0sXHJcbiAgICBpbmZvOiBzdHJpbmcsXHJcbiAgICB0b2tlbnM6IFRva2VuW10sXHJcbiAgICBpZHg6IG51bWJlclxyXG4gICkgPT4gYm9vbGVhbiB8IHVuZGVmaW5lZDtcclxuICAvKipcclxuICAgKiBcdTZFMzJcdTY3RDMgSFRNTCBcdTc2ODRcdTU2REVcdThDMDNcclxuICAgKi9cclxuICBodG1sUmVuZGVyOiAocHJvcHM6IHsgZGF0YTogRFtdOyBjb25maWc6IEMgfSwgaW5mbzogc3RyaW5nLCB0b2tlbnM6IFRva2VuW10sIGlkeDogbnVtYmVyKSA9PiBzdHJpbmc7XHJcbiAgLyoqXHJcbiAgICogXHU2RTMyXHU2N0QzIEhUTUwgXHU1NDBFXHU3Njg0XHU1NkRFXHU4QzAzXHJcbiAgICovXHJcbiAgYWZ0ZXJIdG1sUmVuZGVyPzogKHByb3BzOiB7IGRhdGE6IERbXTsgY29uZmlnOiBDIH0sIGluZm86IHN0cmluZywgdG9rZW5zOiBUb2tlbltdLCBpZHg6IG51bWJlcikgPT4gdm9pZDtcclxuICAvKipcclxuICAgKiBIVE1MIFx1OEY2Q1x1NjM2Mlx1NTZERVx1OEMwM1x1RkYwQ1x1OTAxQVx1OEZDN1x1OEJFNVx1NTFGRFx1NjU3MFx1NEZFRVx1NjUzOVx1NjcwMFx1N0VDOFx1NzUxRlx1NjIxMFx1NzY4NCBIVE1MXHJcbiAgICovXHJcbiAgdHJhbnNmb3JtSHRtbD86IChodG1sOiBzdHJpbmcpID0+IHN0cmluZztcclxufVxyXG5cclxuLyoqXHJcbiAqIFx1NTIxQlx1NUVGQVx1NTkxQVx1NEUyQVx1NTM2MVx1NzI0N1x1NUJCOVx1NTY2OFxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGNyZWF0ZUNhcmRDb250YWluZXJzID0gPEQgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBhbnk+LCBDIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55Pj4oXHJcbiAgbWQ6IE1hcmtkb3duSXQsXHJcbiAgb3B0aW9uOiBDYXJkQ29udGFpbmVyT3B0aW9uPEMsIEQ+W11cclxuKSA9PiB7XHJcbiAgb3B0aW9uLmZvckVhY2goaXRlbSA9PiBjcmVhdGVDYXJkQ29udGFpbmVyKG1kLCBpdGVtKSk7XHJcbn07XHJcblxyXG4vKipcclxuICogXHU1MjFCXHU1RUZBXHU1MzU1XHU0RTJBXHU1MzYxXHU3MjQ3XHU1QkI5XHU1NjY4XHJcbiAqL1xyXG5leHBvcnQgY29uc3QgY3JlYXRlQ2FyZENvbnRhaW5lciA9IDxEIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55PiwgQyBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4+KFxyXG4gIG1kOiBNYXJrZG93bkl0LFxyXG4gIG9wdGlvbjogQ2FyZENvbnRhaW5lck9wdGlvbjxELCBDPlxyXG4pID0+IHtcclxuICBjb25zdCB7IHR5cGUsIGNsYXNzTmFtZSwgYmVmb3JlSHRtbFJlbmRlciwgaHRtbFJlbmRlciwgYWZ0ZXJIdG1sUmVuZGVyLCB0cmFuc2Zvcm1IdG1sIH0gPSBvcHRpb247XHJcblxyXG4gIC8vIFx1NkNFOFx1NTE4Q1x1NUJCOVx1NTY2OFxyXG4gIG1kLnVzZShjb250YWluZXIsIHR5cGUsIHt9KTtcclxuXHJcbiAgLy8gXHU2Q0U4XHU1MThDXHU2MjEwXHU1MjlGXHU1NDBFXHVGRjBDXHU1QzMxXHU0RjFBXHU3NkQxXHU1NDJDXHU1MjMwIGNvbnRhaW5lcl94eF9vcGVuXHVGRjBDXHU1MTc2XHU0RTJEIHh4IFx1NEUzQVx1NkNFOFx1NTE4Q1x1NzY4NFx1NUJCOVx1NTY2OFx1NTQwRFxyXG4gIG1kLnJlbmRlcmVyLnJ1bGVzW2Bjb250YWluZXJfJHt0eXBlfV9vcGVuYF0gPSAodG9rZW5zLCBpZHgpID0+IHtcclxuICAgIGNvbnN0IGNvbnRhaW5lclRva2VuID0gdG9rZW5zW2lkeF07XHJcbiAgICBsZXQgaHRtbCA9IGA8ZGl2IGNsYXNzPVwiJHtjbGFzc05hbWUgfHwgYCR7dHlwZX0tY29udGFpbmVyYH1cIj5gO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSBpZHg7IGkgPCB0b2tlbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3QgdG9rZW4gPSB0b2tlbnNbaV07XHJcblxyXG4gICAgICAvLyBcdTU5ODJcdTY3OUNcdTY3NjVcdTUyMzAgJHt0eXBlfSBcdTc2ODRcdTdFRDNcdTY3NUZcdTY4MDdcdTdCN0VcdUZGMENcdTUyMTlcdThERjNcdTUxRkFcdTVGQUFcdTczQUZcclxuICAgICAgaWYgKHRva2VuLnR5cGUgPT09IGBjb250YWluZXJfJHt0eXBlfV9jbG9zZWApIGJyZWFrO1xyXG4gICAgICBpZiAoIVtcInlhbWxcIiwgXCJ5bWxcIl0uaW5jbHVkZXModG9rZW4uaW5mbykpIGNvbnRpbnVlO1xyXG5cclxuICAgICAgLy8gXHU4OUUzXHU2NzkwIHlhbWwgXHU1MTg1XHU1QkI5XHJcbiAgICAgIGNvbnN0IHlhbWxDb250ZW50ID0geWFtbC5sb2FkKHRva2VuLmNvbnRlbnQudHJpbSgpKSBhcyB7IGNvbmZpZzogQzsgZGF0YTogRFtdIH0gfCBEW107XHJcblxyXG4gICAgICBsZXQgZGF0YSA9IFtdIGFzIERbXTtcclxuICAgICAgbGV0IGNvbmZpZyA9IHt9IGFzIEM7XHJcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHlhbWxDb250ZW50KSkgZGF0YSA9IHlhbWxDb250ZW50O1xyXG4gICAgICBlbHNlIHtcclxuICAgICAgICBkYXRhID0geWFtbENvbnRlbnQuZGF0YSB8fCBbXTtcclxuICAgICAgICBjb25maWcgPSB5YW1sQ29udGVudC5jb25maWcgfHwge307XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIFx1ODNCN1x1NTNENlx1NUJCOVx1NTY2OFx1NTQwRFx1NTQwRVx1OTc2Mlx1NzY4NFx1NTE4NVx1NUJCOVxyXG4gICAgICBjb25zdCBpbmZvID0gY29udGFpbmVyVG9rZW4uaW5mby50cmltKCkuc2xpY2UodHlwZS5sZW5ndGgpLnRyaW0oKTtcclxuXHJcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGJlZm9yZUh0bWxSZW5kZXI/Lih7IGRhdGEsIGNvbmZpZyB9LCBpbmZvLCB0b2tlbnMsIGkpO1xyXG4gICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkgY29udGludWU7XHJcblxyXG4gICAgICAvLyBcdTgzQjdcdTUzRDYgSFRNTFxyXG4gICAgICBodG1sICs9IGh0bWxSZW5kZXIoeyBkYXRhLCBjb25maWcgfSwgaW5mbywgdG9rZW5zLCBpKTtcclxuICAgICAgYWZ0ZXJIdG1sUmVuZGVyPy4oeyBkYXRhLCBjb25maWcgfSwgaW5mbywgdG9rZW5zLCBpKTtcclxuICAgIH1cclxuICAgIGh0bWwgPSB0cmFuc2Zvcm1IdG1sPy4oaHRtbCkgPz8gaHRtbDtcclxuXHJcbiAgICAvLyBcdThGRDRcdTU2REVcdTRFMERcdTgwRkRcdTY3MDkgPC9kaXY+IFx1N0VEM1x1NUMzRVxyXG4gICAgcmV0dXJuIGh0bWw7XHJcbiAgfTtcclxufTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxcdTk4NzlcdTc2RUVcdTUzM0FcXFxcVlNDb2RlUHJvamVjdHNcXFxcTXlQcm9qZWN0c1xcXFx2aXRlcHJlc3MtdGhlbWUtdGVla1xcXFxwYWNrYWdlc1xcXFxtYXJrZG93blxcXFxwbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFxcdTk4NzlcdTc2RUVcdTUzM0FcXFxcVlNDb2RlUHJvamVjdHNcXFxcTXlQcm9qZWN0c1xcXFx2aXRlcHJlc3MtdGhlbWUtdGVla1xcXFxwYWNrYWdlc1xcXFxtYXJrZG93blxcXFxwbHVnaW5zXFxcXGNvbnRhaW5lci50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovJUU5JUExJUI5JUU3JTlCJUFFJUU1JThDJUJBL1ZTQ29kZVByb2plY3RzL015UHJvamVjdHMvdml0ZXByZXNzLXRoZW1lLXRlZWsvcGFja2FnZXMvbWFya2Rvd24vcGx1Z2lucy9jb250YWluZXIudHNcIjtpbXBvcnQgdHlwZSBNYXJrZG93bkl0IGZyb20gXCJtYXJrZG93bi1pdFwiO1xyXG5pbXBvcnQgdHlwZSB7IENvbnRhaW5lckxhYmVsIH0gZnJvbSBcIi4uL3R5cGVzXCI7XHJcbmltcG9ydCB7IGNyZWF0ZUNvbnRhaW5lcnNUaGVuVXNlIH0gZnJvbSBcIi4uL2hlbHBlclwiO1xyXG5cclxuLyoqXHJcbiAqIFx1NTIxQlx1NUVGQSBUZWVrIFx1NTE4NVx1N0Y2RVx1NzY4NCBtYXJrZG93bi1pdC1jb250YWluZXIgXHU2M0QyXHU0RUY2XHJcbiAqIEBwYXJhbSBtZCBtYXJrZG93bi1pdCBcdTVCOUVcdTRGOEJcclxuICovXHJcbmNvbnN0IGNvbnRhaW5lclBsdWdpbiA9IChtZDogTWFya2Rvd25JdCwgY29udGFpbmVyTGFiZWw/OiBDb250YWluZXJMYWJlbCkgPT4ge1xyXG4gIGNvbnN0IG1hcmtkb3duQ29udGFpbmVyID0gW1xyXG4gICAgeyB0eXBlOiBcImNlbnRlclwiLCB1c2VUaXRsZTogZmFsc2UsIGNsYXNzTmFtZTogYHRrLWNlbnRlci1jb250YWluZXJgIH0sXHJcbiAgICB7IHR5cGU6IFwicmlnaHRcIiwgdXNlVGl0bGU6IGZhbHNlLCBjbGFzc05hbWU6IGB0ay1yaWdodC1jb250YWluZXJgIH0sXHJcbiAgICB7IHR5cGU6IFwibm90ZVwiLCB1c2VUaXRsZTogdHJ1ZSwgZGVmYXVsdFRpdGxlOiBjb250YWluZXJMYWJlbD8ubm90ZUxhYmVsIHx8IFwiTk9URVwiLCBjbGFzc05hbWU6IGBjdXN0b20tYmxvY2tgIH0sXHJcbiAgXTtcclxuXHJcbiAgY3JlYXRlQ29udGFpbmVyc1RoZW5Vc2UobWQsIG1hcmtkb3duQ29udGFpbmVyKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNvbnRhaW5lclBsdWdpbjtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxcdTk4NzlcdTc2RUVcdTUzM0FcXFxcVlNDb2RlUHJvamVjdHNcXFxcTXlQcm9qZWN0c1xcXFx2aXRlcHJlc3MtdGhlbWUtdGVla1xcXFxwYWNrYWdlc1xcXFxtYXJrZG93blxcXFxwbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFxcdTk4NzlcdTc2RUVcdTUzM0FcXFxcVlNDb2RlUHJvamVjdHNcXFxcTXlQcm9qZWN0c1xcXFx2aXRlcHJlc3MtdGhlbWUtdGVla1xcXFxwYWNrYWdlc1xcXFxtYXJrZG93blxcXFxwbHVnaW5zXFxcXHNoYXJlQ2FyZC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovJUU5JUExJUI5JUU3JTlCJUFFJUU1JThDJUJBL1ZTQ29kZVByb2plY3RzL015UHJvamVjdHMvdml0ZXByZXNzLXRoZW1lLXRlZWsvcGFja2FnZXMvbWFya2Rvd24vcGx1Z2lucy9zaGFyZUNhcmQudHNcIjtpbXBvcnQgdHlwZSBNYXJrZG93bkl0IGZyb20gXCJtYXJrZG93bi1pdFwiO1xyXG5pbXBvcnQgdHlwZSB7IFNoYXJlQ2FyZCB9IGZyb20gXCIuLi90eXBlc1wiO1xyXG5pbXBvcnQgdHlwZSB7IFNpdGVDb25maWcgfSBmcm9tIFwidml0ZXByZXNzXCI7XHJcbmltcG9ydCB7IHdpdGhCYXNlIH0gZnJvbSBcIkB0ZWVrL2hlbHBlclwiO1xyXG5pbXBvcnQgeyBjcmVhdGVDYXJkQ29udGFpbmVyIH0gZnJvbSBcIi4uL2hlbHBlclwiO1xyXG5cclxuY29uc3Qgcm9vdENsYXNzID0gXCJzaGFyZS1jYXJkXCI7XHJcblxyXG4vKipcclxuICogXHU3NTFGXHU2MjEwXHU1MjA2XHU0RUFCXHU1MzYxXHU3MjQ3XHU1QkI5XHU1NjY4XHJcbiAqXHJcbiAqIEBwYXJhbSBtZCBNYXJrZG93bkl0IFx1NUI5RVx1NEY4QlxyXG4gKi9cclxuY29uc3Qgc2hhcmVDYXJkUGx1Z2luID0gKG1kOiBNYXJrZG93bkl0KSA9PiB7XHJcbiAgY29uc3Qgc2l0ZUNvbmZpZzogU2l0ZUNvbmZpZyA9IChnbG9iYWxUaGlzIGFzIGFueSkuVklURVBSRVNTX0NPTkZJRztcclxuICBjb25zdCB7IGJhc2UgPSBcIi9cIiB9ID0gc2l0ZUNvbmZpZy51c2VyQ29uZmlnO1xyXG5cclxuICBjcmVhdGVDYXJkQ29udGFpbmVyPFNoYXJlQ2FyZC5JdGVtLCBTaGFyZUNhcmQuQ29uZmlnPihtZCwge1xyXG4gICAgdHlwZTogXCJzaGFyZUNhcmRcIixcclxuICAgIGNsYXNzTmFtZTogYGNvbnRhaW5lciAke3Jvb3RDbGFzc30tY29udGFpbmVyYCxcclxuICAgIGh0bWxSZW5kZXI6IChwcm9wcywgaW5mbykgPT4gcmVuZGVyU2hhcmVDYXJkKHByb3BzLCBpbmZvLCBiYXNlKSxcclxuICAgIGFmdGVySHRtbFJlbmRlcjogKHByb3BzLCBfLCB0b2tlbnMsIGlkeCkgPT4ge1xyXG4gICAgICAvLyBcdTUyMjBcdTk2NjQgeWFtbCBcdTRFRTNcdTc4MDFcdTU3NTdcclxuICAgICAgaWYgKHByb3BzLmNvbmZpZy5zaG93Q29kZSAhPT0gdHJ1ZSkge1xyXG4gICAgICAgIHRva2Vuc1tpZHhdLnR5cGUgPSBcIlwiO1xyXG4gICAgICAgIHRva2Vuc1tpZHhdLnRhZyA9IFwiXCI7XHJcbiAgICAgICAgdG9rZW5zW2lkeF0uaGlkZGVuID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBcdTgzQjdcdTUzRDZcdTUyMDZcdTRFQUJcdTUzNjFcdTcyNDcgSFRNTCBcdTY4MDdcdTdCN0VcclxuICpcclxuICogQHBhcmFtIG5hdkNhcmQgXHU1MjA2XHU0RUFCXHU1MzYxXHU3MjQ3XHU2NTcwXHU2MzZFXHJcbiAqIEBwYXJhbSBiYXNlIFx1NjgzOVx1OERFRlx1NUY4NFxyXG4gKi9cclxuY29uc3QgcmVuZGVyU2hhcmVDYXJkID0gKFxyXG4gIHNoYXJlQ2FyZDogeyBkYXRhOiBTaGFyZUNhcmQuSXRlbVtdOyBjb25maWc6IFNoYXJlQ2FyZC5Db25maWcgfSxcclxuICBpbmZvOiBzdHJpbmcsXHJcbiAgYmFzZTogc3RyaW5nXHJcbikgPT4ge1xyXG4gIGNvbnN0IHsgZGF0YSA9IFtdLCBjb25maWcgPSB7fSB9ID0gc2hhcmVDYXJkO1xyXG4gIGlmICghZGF0YS5sZW5ndGgpIHJldHVybiBcIlwiO1xyXG5cclxuICBjb25zdCB7IGNhcmROdW06IGRlZmF1bHROdW0gPSAyLCBjYXJkR2FwID0gMjAsIHRhcmdldCA9IFwiX2JsYW5rXCIgfSA9IGNvbmZpZztcclxuICBsZXQgY2FyZE51bSA9IGluZm8gJiYgdHlwZW9mIGluZm8gIT09IFwic3RyaW5nXCIgPyBOdW1iZXIoaW5mbykgOiBkZWZhdWx0TnVtO1xyXG5cclxuICBpZiAoY2FyZE51bSA+IDQgfHwgY2FyZE51bSA8IDEpIGNhcmROdW0gPSBkZWZhdWx0TnVtO1xyXG4gIGNvbnN0IGluZGV4ID0gaW5mbyA9PT0gXCJhdXRvXCIgPyBcImF1dG9cIiA6IGNhcmROdW07XHJcblxyXG4gIHJldHVybiBgXHJcbiAgICA8ZGl2XHJcbiAgICAgICAgY2xhc3M9XCIke3Jvb3RDbGFzc30gaW5kZXgtJHtpbmRleH1cIlxyXG4gICAgICAgIHN0eWxlPVwiLS1yb3ctZ2FwOiAke2NhcmRHYXB9cHg7IC0tY29sdW1uLWdhcDogJHtjYXJkR2FwfXB4OyAtLWNvbHVtbi1taW4td2lkdGg6IGNhbGMoMTAwJSAvICR7Y2FyZE51bX0gLSAke2NhcmRHYXAgKiAoY2FyZE51bSAtIDEpfXB4KTtcIlxyXG4gICAgPlxyXG4gICAgICAke2RhdGFcclxuICAgICAgICAubWFwKFxyXG4gICAgICAgICAgY2FyZCA9PiBgXHJcbiAgICAgICAgICAgIDwke2NhcmQubGluayA/IFwiYVwiIDogXCJzcGFuXCJ9XHJcbiAgICAgICAgICAgICAgaHJlZj1cIiR7d2l0aEJhc2UoYmFzZSwgY2FyZC5saW5rKX1cIiB0YXJnZXQ9JHt0YXJnZXR9XHJcbiAgICAgICAgICAgICAgY2xhc3M9XCIke3Jvb3RDbGFzc31fX2l0ZW0gJHtjYXJkTnVtID8gYHJvdy0ke2NhcmROdW19YCA6IFwiXCJ9XCJcclxuICAgICAgICAgICAgICBzdHlsZT1cIi0taXRlbS1iZy1jb2xvcjogJHtjYXJkLmJnQ29sb3IgfHwgXCJ2YXIoLS12cC1jLWdyYXktMSlcIn07IC0taXRlbS10ZXh0LWNvbG9yOiAke2NhcmQudGV4dENvbG9yIHx8IFwidmFyKC0tdnAtYy10ZXh0LTEpXCJ9O1wiXHJcbiAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgJHtjYXJkLmF2YXRhciA/IGA8aW1nIHNyYz1cIiR7d2l0aEJhc2UoYmFzZSwgY2FyZC5hdmF0YXIpfVwiIGFsdD1cIiR7Y2FyZC5uYW1lfVwiPmAgOiBcIlwifVxyXG4gICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8cCBjbGFzcz1cIm5hbWVcIj4ke2NhcmQubmFtZX08L3A+XHJcbiAgICAgICAgICAgICAgICA8cCBjbGFzcz1cImRlc2NcIj4ke2NhcmQuZGVzY308L3A+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvJHtjYXJkLmxpbmsgPyBcImFcIiA6IFwic3BhblwifT5cclxuICAgICAgICAgIGBcclxuICAgICAgICApXHJcbiAgICAgICAgLmpvaW4oXCJcIil9XHJcbiAgICA8L2Rpdj5cclxuICBgO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgc2hhcmVDYXJkUGx1Z2luO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkU6XFxcXFx1OTg3OVx1NzZFRVx1NTMzQVxcXFxWU0NvZGVQcm9qZWN0c1xcXFxNeVByb2plY3RzXFxcXHZpdGVwcmVzcy10aGVtZS10ZWVrXFxcXHBhY2thZ2VzXFxcXG1hcmtkb3duXFxcXHBsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXFx1OTg3OVx1NzZFRVx1NTMzQVxcXFxWU0NvZGVQcm9qZWN0c1xcXFxNeVByb2plY3RzXFxcXHZpdGVwcmVzcy10aGVtZS10ZWVrXFxcXHBhY2thZ2VzXFxcXG1hcmtkb3duXFxcXHBsdWdpbnNcXFxcaW1nQ2FyZC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovJUU5JUExJUI5JUU3JTlCJUFFJUU1JThDJUJBL1ZTQ29kZVByb2plY3RzL015UHJvamVjdHMvdml0ZXByZXNzLXRoZW1lLXRlZWsvcGFja2FnZXMvbWFya2Rvd24vcGx1Z2lucy9pbWdDYXJkLnRzXCI7aW1wb3J0IHR5cGUgTWFya2Rvd25JdCBmcm9tIFwibWFya2Rvd24taXRcIjtcclxuaW1wb3J0IHR5cGUgeyBJbWdDYXJkIH0gZnJvbSBcIi4uL3R5cGVzXCI7XHJcbmltcG9ydCB0eXBlIHsgU2l0ZUNvbmZpZyB9IGZyb20gXCJ2aXRlcHJlc3NcIjtcclxuaW1wb3J0IHsgd2l0aEJhc2UgfSBmcm9tIFwiQHRlZWsvaGVscGVyXCI7XHJcbmltcG9ydCB7IGNyZWF0ZUNhcmRDb250YWluZXIgfSBmcm9tIFwiLi4vaGVscGVyXCI7XHJcblxyXG5jb25zdCByb290Q2xhc3MgPSBcImltZy1jYXJkXCI7XHJcblxyXG4vKipcclxuICogXHU3NTFGXHU2MjEwXHU1NkZFXHU3MjQ3XHU1MzYxXHU3MjQ3XHU1QkI5XHU1NjY4XHJcbiAqXHJcbiAqIEBwYXJhbSBtZCBNYXJrZG93bkl0IFx1NUI5RVx1NEY4QlxyXG4gKiBAcGFyYW0gYmFzZSBcdTY4MzlcdThERUZcdTVGODRcclxuICovXHJcbmNvbnN0IGltZ0NhcmRQbHVnaW4gPSAobWQ6IE1hcmtkb3duSXQpID0+IHtcclxuICBjb25zdCBzaXRlQ29uZmlnOiBTaXRlQ29uZmlnID0gKGdsb2JhbFRoaXMgYXMgYW55KS5WSVRFUFJFU1NfQ09ORklHO1xyXG4gIGNvbnN0IHsgYmFzZSA9IFwiL1wiIH0gPSBzaXRlQ29uZmlnLnVzZXJDb25maWc7XHJcblxyXG4gIGNyZWF0ZUNhcmRDb250YWluZXI8SW1nQ2FyZC5JdGVtLCBJbWdDYXJkLkNvbmZpZz4obWQsIHtcclxuICAgIHR5cGU6IFwiaW1nQ2FyZFwiLFxyXG4gICAgY2xhc3NOYW1lOiBgY29udGFpbmVyICR7cm9vdENsYXNzfS1jb250YWluZXJgLFxyXG4gICAgaHRtbFJlbmRlcjogKHByb3BzLCBpbmZvKSA9PiByZW5kZXJJbWdDYXJkKHByb3BzLCBpbmZvLCBiYXNlKSxcclxuICAgIGFmdGVySHRtbFJlbmRlcjogKHByb3BzLCBfLCB0b2tlbnMsIGlkeCkgPT4ge1xyXG4gICAgICAvLyBcdTUyMjBcdTk2NjQgeWFtbCBcdTRFRTNcdTc4MDFcdTU3NTdcclxuICAgICAgaWYgKHByb3BzLmNvbmZpZy5zaG93Q29kZSAhPT0gdHJ1ZSkge1xyXG4gICAgICAgIHRva2Vuc1tpZHhdLnR5cGUgPSBcIlwiO1xyXG4gICAgICAgIHRva2Vuc1tpZHhdLnRhZyA9IFwiXCI7XHJcbiAgICAgICAgdG9rZW5zW2lkeF0uaGlkZGVuID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICB9KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBcdTgzQjdcdTUzRDZcdTU2RkVcdTcyNDdcdTUzNjFcdTcyNDcgSFRNTCBcdTY4MDdcdTdCN0VcclxuICpcclxuICogQHBhcmFtIGltZ0NhcmQgXHU1NkZFXHU3MjQ3XHU1MzYxXHU3MjQ3XHU2NTcwXHU2MzZFXHJcbiAqIEBwYXJhbSBiYXNlIFx1NjgzOVx1OERFRlx1NUY4NFxyXG4gKi9cclxuY29uc3QgcmVuZGVySW1nQ2FyZCA9IChpbWdDYXJkOiB7IGRhdGE6IEltZ0NhcmQuSXRlbVtdOyBjb25maWc6IEltZ0NhcmQuQ29uZmlnIH0sIGluZm86IHN0cmluZywgYmFzZTogc3RyaW5nKSA9PiB7XHJcbiAgY29uc3QgeyBkYXRhID0gW10sIGNvbmZpZyA9IHt9IH0gPSBpbWdDYXJkO1xyXG4gIGlmICghZGF0YS5sZW5ndGgpIHJldHVybiBcIlwiO1xyXG5cclxuICBjb25zdCB7XHJcbiAgICBjYXJkTnVtOiBkZWZhdWx0TnVtID0gMixcclxuICAgIGNhcmRHYXAgPSAyMCxcclxuICAgIGxpbmVDbGFtcCA9IDIsXHJcbiAgICB0YXJnZXQgPSBcIl9ibGFua1wiLFxyXG4gICAgb2JqZWN0Rml0ID0gXCJjb3ZlclwiLFxyXG4gICAgaW1nSGVpZ2h0ID0gXCJhdXRvXCIsXHJcbiAgfSA9IGNvbmZpZztcclxuICBsZXQgY2FyZE51bSA9IGluZm8gJiYgdHlwZW9mIGluZm8gIT09IFwic3RyaW5nXCIgPyBOdW1iZXIoaW5mbykgOiBkZWZhdWx0TnVtO1xyXG5cclxuICBpZiAoY2FyZE51bSA+IDQgfHwgY2FyZE51bSA8IDEpIGNhcmROdW0gPSBkZWZhdWx0TnVtO1xyXG4gIGNvbnN0IGluZGV4ID0gaW5mbyA9PT0gXCJhdXRvXCIgPyBcImF1dG9cIiA6IGNhcmROdW07XHJcblxyXG4gIHJldHVybiBgXHJcbiAgICA8ZGl2XHJcbiAgICAgIGNsYXNzPVwiJHtyb290Q2xhc3N9IGluZGV4LSR7aW5kZXh9XCJcclxuICAgICAgc3R5bGU9XCItLXJvdy1nYXA6ICR7Y2FyZEdhcH1weDsgLS1jb2x1bW4tZ2FwOiAke2NhcmRHYXB9cHg7IC0tY29sdW1uLW1pbi13aWR0aDogY2FsYygxMDAlIC8gJHtjYXJkTnVtfSAtICR7Y2FyZEdhcCAqIChjYXJkTnVtIC0gMSl9cHgpO1wiXHJcbiAgICA+XHJcbiAgICAgICR7ZGF0YVxyXG4gICAgICAgIC5tYXAoXHJcbiAgICAgICAgICBjYXJkID0+IGBcclxuICAgICAgICAgICAgPCR7Y2FyZC5saW5rID8gXCJhXCIgOiBcInNwYW5cIn1cclxuICAgICAgICAgICAgICBocmVmPVwiJHt3aXRoQmFzZShiYXNlLCBjYXJkLmxpbmspfVwiXHJcbiAgICAgICAgICAgICAgdGFyZ2V0PVwiJHt0YXJnZXR9XCJcclxuICAgICAgICAgICAgICBjbGFzcz1cIiR7cm9vdENsYXNzfV9faXRlbSAke2NhcmROdW0gPyBgcm93LSR7Y2FyZE51bX1gIDogXCJcIn1cIlxyXG4gICAgICAgICAgICAgIHN0eWxlPVwiLS1pbWctaGVpZ2h0OiAke2ltZ0hlaWdodH07IC0taW1nLW9iamVjdC1maXQ6ICR7b2JqZWN0Rml0fTsgLS1kZXNjLWxpbmUtY2xhbXA6ICR7bGluZUNsYW1wfVwiXHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiJHtyb290Q2xhc3N9X19pdGVtX19pbWdcIj5cclxuICAgICAgICAgICAgICAgIDxpbWcgc3JjPVwiJHt3aXRoQmFzZShiYXNlLCBjYXJkLmltZyl9XCI+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIiR7cm9vdENsYXNzfV9faXRlbV9faW5mb1wiPlxyXG4gICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cIm5hbWVcIj4ke2NhcmQubmFtZX08L3A+XHJcbiAgICAgICAgICAgICAgICAgICR7Y2FyZC5kZXNjID8gYDxwIGNsYXNzPVwiZGVzY1wiPiR7Y2FyZC5kZXNjfTwvcD5gIDogXCJcIn1cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAke1xyXG4gICAgICAgICAgICAgICAgY2FyZC5hdmF0YXIgfHwgY2FyZC5hdXRob3JcclxuICAgICAgICAgICAgICAgICAgPyBgPGRpdiBjbGFzcz1cIiR7cm9vdENsYXNzfV9faXRlbV9fZm9vdGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAke2NhcmQuYXZhdGFyID8gYDxpbWcgc3JjPVwiJHt3aXRoQmFzZShiYXNlLCBjYXJkLmF2YXRhcil9XCI+YCA6IFwiXCJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAke2NhcmQuYXV0aG9yID8gYDxzcGFuPiR7Y2FyZC5hdXRob3J9PC9zcGFuPmAgOiBcIlwifVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PmBcclxuICAgICAgICAgICAgICAgICAgOiBcIlwiXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICA8LyR7Y2FyZC5saW5rID8gXCJhXCIgOiBcInNwYW5cIn0+XHJcbiAgICAgICAgICBgXHJcbiAgICAgICAgKVxyXG4gICAgICAgIC5qb2luKFwiXCIpfVxyXG4gICAgPC9kaXY+XHJcbiAgYDtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGltZ0NhcmRQbHVnaW47XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRTpcXFxcXHU5ODc5XHU3NkVFXHU1MzNBXFxcXFZTQ29kZVByb2plY3RzXFxcXE15UHJvamVjdHNcXFxcdml0ZXByZXNzLXRoZW1lLXRlZWtcXFxccGFja2FnZXNcXFxcbWFya2Rvd25cXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcXHU5ODc5XHU3NkVFXHU1MzNBXFxcXFZTQ29kZVByb2plY3RzXFxcXE15UHJvamVjdHNcXFxcdml0ZXByZXNzLXRoZW1lLXRlZWtcXFxccGFja2FnZXNcXFxcbWFya2Rvd25cXFxccGx1Z2luc1xcXFxuYXZDYXJkLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi8lRTklQTElQjklRTclOUIlQUUlRTUlOEMlQkEvVlNDb2RlUHJvamVjdHMvTXlQcm9qZWN0cy92aXRlcHJlc3MtdGhlbWUtdGVlay9wYWNrYWdlcy9tYXJrZG93bi9wbHVnaW5zL25hdkNhcmQudHNcIjtpbXBvcnQgdHlwZSBNYXJrZG93bkl0IGZyb20gXCJtYXJrZG93bi1pdFwiO1xyXG5pbXBvcnQgdHlwZSB7IE5hdkNhcmQgfSBmcm9tIFwiLi4vdHlwZXNcIjtcclxuaW1wb3J0IHR5cGUgeyBTaXRlQ29uZmlnIH0gZnJvbSBcInZpdGVwcmVzc1wiO1xyXG5pbXBvcnQgeyB3aXRoQmFzZSB9IGZyb20gXCJAdGVlay9oZWxwZXJcIjtcclxuaW1wb3J0IHsgY3JlYXRlQ2FyZENvbnRhaW5lciB9IGZyb20gXCIuLi9oZWxwZXJcIjtcclxuXHJcbmNvbnN0IHJvb3RDbGFzcyA9IFwibmF2LWNhcmRcIjtcclxuXHJcbi8qKlxyXG4gKiBcdTc1MUZcdTYyMTBcdTVCRkNcdTgyMkFcdTUzNjFcdTcyNDdcdTVCQjlcdTU2NjhcclxuICpcclxuICogQHBhcmFtIG1kIE1hcmtkb3duSXQgXHU1QjlFXHU0RjhCXHJcbiAqL1xyXG5jb25zdCBuYXZDYXJkUGx1Z2luID0gKG1kOiBNYXJrZG93bkl0KSA9PiB7XHJcbiAgY29uc3Qgc2l0ZUNvbmZpZzogU2l0ZUNvbmZpZyA9IChnbG9iYWxUaGlzIGFzIGFueSkuVklURVBSRVNTX0NPTkZJRztcclxuICBjb25zdCB7IGJhc2UgPSBcIi9cIiB9ID0gc2l0ZUNvbmZpZy51c2VyQ29uZmlnO1xyXG5cclxuICBjcmVhdGVDYXJkQ29udGFpbmVyPE5hdkNhcmQuSXRlbSwgTmF2Q2FyZC5Db25maWc+KG1kLCB7XHJcbiAgICB0eXBlOiBcIm5hdkNhcmRcIixcclxuICAgIGNsYXNzTmFtZTogYGNvbnRhaW5lciAke3Jvb3RDbGFzc30tY29udGFpbmVyYCxcclxuICAgIGh0bWxSZW5kZXI6IChwcm9wcywgaW5mbykgPT4gZ2V0TmF2Q2FyZEh0bWwocHJvcHMsIGluZm8sIGJhc2UpLFxyXG4gICAgYWZ0ZXJIdG1sUmVuZGVyOiAocHJvcHMsIF8sIHRva2VucywgaWR4KSA9PiB7XHJcbiAgICAgIC8vIFx1NTIyMFx1OTY2NCB5YW1sIFx1NEVFM1x1NzgwMVx1NTc1N1xyXG4gICAgICBpZiAocHJvcHMuY29uZmlnLnNob3dDb2RlICE9PSB0cnVlKSB7XHJcbiAgICAgICAgdG9rZW5zW2lkeF0udHlwZSA9IFwiXCI7XHJcbiAgICAgICAgdG9rZW5zW2lkeF0udGFnID0gXCJcIjtcclxuICAgICAgICB0b2tlbnNbaWR4XS5oaWRkZW4gPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFx1ODNCN1x1NTNENlx1NUJGQ1x1ODIyQVx1NTM2MVx1NzI0NyBIVE1MIFx1NjgwN1x1N0I3RVxyXG4gKlxyXG4gKiBAcGFyYW0gbmF2Q2FyZCBcdTVCRkNcdTgyMkFcdTUzNjFcdTcyNDdcdTY1NzBcdTYzNkVcclxuICogQHBhcmFtIGJhc2UgXHU2ODM5XHU4REVGXHU1Rjg0XHJcbiAqL1xyXG5jb25zdCBnZXROYXZDYXJkSHRtbCA9IChuYXZDYXJkOiB7IGRhdGE6IE5hdkNhcmQuSXRlbVtdOyBjb25maWc6IE5hdkNhcmQuQ29uZmlnIH0sIGluZm86IHN0cmluZywgYmFzZTogc3RyaW5nKSA9PiB7XHJcbiAgY29uc3QgeyBkYXRhID0gW10sIGNvbmZpZyA9IHt9IH0gPSBuYXZDYXJkO1xyXG4gIGlmICghZGF0YS5sZW5ndGgpIHJldHVybiBcIlwiO1xyXG5cclxuICBjb25zdCB7IGNhcmROdW06IGRlZmF1bHROdW0gPSAyLCBjYXJkR2FwID0gMjAsIGxpbmVDbGFtcCA9IDIsIHRhcmdldCA9IFwiX2JsYW5rXCIgfSA9IGNvbmZpZztcclxuICBsZXQgY2FyZE51bSA9IGluZm8gJiYgdHlwZW9mIGluZm8gIT09IFwic3RyaW5nXCIgPyBOdW1iZXIoaW5mbykgOiBkZWZhdWx0TnVtO1xyXG5cclxuICBpZiAoY2FyZE51bSA+IDQgfHwgY2FyZE51bSA8IDEpIGNhcmROdW0gPSBkZWZhdWx0TnVtO1xyXG4gIGNvbnN0IGluZGV4ID0gaW5mbyA9PT0gXCJhdXRvXCIgPyBcImF1dG9cIiA6IGNhcmROdW07XHJcblxyXG4gIHJldHVybiBgXHJcbiAgICA8ZGl2XHJcbiAgICAgIGNsYXNzPVwiJHtyb290Q2xhc3N9IGluZGV4LSR7aW5kZXh9XCJcclxuICAgICAgc3R5bGU9XCItLXJvdy1nYXA6ICR7Y2FyZEdhcH1weDsgLS1jb2x1bW4tZ2FwOiAke2NhcmRHYXB9cHg7IC0tY29sdW1uLW1pbi13aWR0aDogY2FsYygxMDAlIC8gJHtjYXJkTnVtfSAtICR7Y2FyZEdhcCAqIChjYXJkTnVtIC0gMSl9cHgpO1wiXHJcbiAgICA+XHJcbiAgICAgICR7ZGF0YVxyXG4gICAgICAgIC5tYXAoXHJcbiAgICAgICAgICBjYXJkID0+IGBcclxuICAgICAgICAgICAgPCR7Y2FyZC5saW5rID8gXCJhXCIgOiBcInNwYW5cIn1cclxuICAgICAgICAgICAgICBocmVmPVwiJHtjYXJkLmxpbmt9XCIgdGFyZ2V0PVwiJHt0YXJnZXR9XCJcclxuICAgICAgICAgICAgICBjbGFzcz1cIiR7cm9vdENsYXNzfV9faXRlbVwiXHJcbiAgICAgICAgICAgICAgc3R5bGU9XCItLWRlc2MtbGluZS1jbGFtcDogJHtsaW5lQ2xhbXB9XCJcclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCIke3Jvb3RDbGFzc31fX2l0ZW1fX2luZm9cIj5cclxuICAgICAgICAgICAgICAgICR7Y2FyZC5pbWcgPyBgPGltZyBzcmM9XCIke3dpdGhCYXNlKGJhc2UsIGNhcmQuaW1nKX1cIj5gIDogXCJcIn1cclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibmFtZVwiPiR7Y2FyZC5uYW1lfTwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgPHAgY2xhc3M9XCJkZXNjXCI+JHtjYXJkLmRlc2N9PC9wPlxyXG4gICAgICAgICAgICAgICR7Y2FyZC5iYWRnZSA/IGA8c3BhbiBjbGFzcz1cIlZQQmFkZ2UgJHtjYXJkLmJhZGdlVHlwZSB8fCBcImluZm9cIn0gYmFkZ2VcIj4ke2NhcmQuYmFkZ2V9PC9zcGFuPmAgOiBcIlwifVxyXG4gICAgICAgICAgICA8LyR7Y2FyZC5saW5rID8gXCJhXCIgOiBcInNwYW5cIn0+XHJcbiAgICAgICAgYFxyXG4gICAgICAgIClcclxuICAgICAgICAuam9pbihcIlwiKX1cclxuICAgICAgPC9kaXY+YDtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5hdkNhcmRQbHVnaW47XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRTpcXFxcXHU5ODc5XHU3NkVFXHU1MzNBXFxcXFZTQ29kZVByb2plY3RzXFxcXE15UHJvamVjdHNcXFxcdml0ZXByZXNzLXRoZW1lLXRlZWtcXFxccGFja2FnZXNcXFxcbWFya2Rvd25cXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcXHU5ODc5XHU3NkVFXHU1MzNBXFxcXFZTQ29kZVByb2plY3RzXFxcXE15UHJvamVjdHNcXFxcdml0ZXByZXNzLXRoZW1lLXRlZWtcXFxccGFja2FnZXNcXFxcbWFya2Rvd25cXFxccGx1Z2luc1xcXFxkZW1vLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi8lRTklQTElQjklRTclOUIlQUUlRTUlOEMlQkEvVlNDb2RlUHJvamVjdHMvTXlQcm9qZWN0cy92aXRlcHJlc3MtdGhlbWUtdGVlay9wYWNrYWdlcy9tYXJrZG93bi9wbHVnaW5zL2RlbW8udHNcIjtpbXBvcnQgdHlwZSBNYXJrZG93bkl0IGZyb20gXCJtYXJrZG93bi1pdFwiO1xyXG5pbXBvcnQgdHlwZSB7IFJlbmRlcmVyLCBUb2tlbiB9IGZyb20gXCJtYXJrZG93bi1pdFwiO1xyXG5pbXBvcnQgdHlwZSB7IFNpdGVDb25maWcgfSBmcm9tIFwidml0ZXByZXNzXCI7XHJcbmltcG9ydCB0eXBlIHsgRGVtbyB9IGZyb20gXCJAdGVlay9jb25maWdcIjtcclxuaW1wb3J0IHsgcmVhZEZpbGVTeW5jIH0gZnJvbSBcImZzXCI7XHJcbmltcG9ydCB7IGpvaW4sIHJlc29sdmUsIHBvc2l4IH0gZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IGNvbnRhaW5lciBmcm9tIFwibWFya2Rvd24taXQtY29udGFpbmVyXCI7XHJcblxyXG5pbnRlcmZhY2UgQ29udGFpbmVyT3B0cyB7XHJcbiAgbWFya2VyPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xyXG4gIHZhbGlkYXRlPyhwYXJhbXM6IHN0cmluZyk6IGJvb2xlYW47XHJcbiAgcmVuZGVyPyh0b2tlbnM6IFRva2VuW10sIGluZGV4OiBudW1iZXIsIG9wdGlvbnM6IGFueSwgZW52OiBhbnksIHNlbGY6IFJlbmRlcmVyKTogc3RyaW5nO1xyXG59XHJcblxyXG5jb25zdCBkZW1vUGx1Z2luID0gKG1kOiBNYXJrZG93bkl0LCBvcHRpb246IERlbW8gPSB7fSkgPT4ge1xyXG4gIGNvbnN0IHNpdGVDb25maWc6IFNpdGVDb25maWcgPSAoZ2xvYmFsVGhpcyBhcyBhbnkpLlZJVEVQUkVTU19DT05GSUc7XHJcbiAgY29uc3Qgc3JjRGlyID0gc2l0ZUNvbmZpZy5zcmNEaXI7XHJcbiAgY29uc3QgcGF0aCA9IFwiZXhhbXBsZXNcIjtcclxuICBjb25zdCBkZW1vUGF0aCA9IGpvaW4oc3JjRGlyLCBwYXRoKTtcclxuXHJcbiAgY29uc3Qgb3B0aW9uczogQ29udGFpbmVyT3B0cyA9IHtcclxuICAgIHZhbGlkYXRlKHBhcmFtcykge1xyXG4gICAgICByZXR1cm4gISFwYXJhbXMudHJpbSgpLm1hdGNoKC9eZGVtb1xccyooLiopJC8pO1xyXG4gICAgfSxcclxuXHJcbiAgICByZW5kZXIodG9rZW5zLCBpZHgpIHtcclxuICAgICAgY29uc3QgZGVzYyA9IHRva2Vuc1tpZHhdLmluZm8udHJpbSgpLm1hdGNoKC9eZGVtb1xccyooLiopJC8pO1xyXG5cclxuICAgICAgaWYgKHRva2Vuc1tpZHhdLm5lc3RpbmcgPT09IDEgLyogXHU2ODA3XHU3QjdFXHU2MjUzXHU1RjAwICovKSB7XHJcbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSBkZXNjICYmIGRlc2MubGVuZ3RoID4gMSA/IGRlc2NbMV0gOiBcIlwiO1xyXG4gICAgICAgIGNvbnN0IHNvdXJjZUZpbGVUb2tlbiA9IHRva2Vuc1tpZHggKyAyXTtcclxuICAgICAgICBsZXQgc291cmNlID0gXCJcIjtcclxuICAgICAgICBjb25zdCBjb250YWluZXJDb250ZW50ID0gc291cmNlRmlsZVRva2VuLmNoaWxkcmVuPy5bMF0uY29udGVudCA/PyBcIlwiO1xyXG4gICAgICAgIC8vIFx1Nzg2RVx1NEZERFx1NjU4N1x1NEVGNlx1OERFRlx1NUY4NFx1NUUyNiAudnVlXHJcbiAgICAgICAgY29uc3Qgc291cmNlRmlsZSA9IGNvbnRhaW5lckNvbnRlbnQgPyBgJHtjb250YWluZXJDb250ZW50LnJlcGxhY2UoLy52dWUkLywgXCJcIil9LnZ1ZWAgOiBcIlwiO1xyXG5cclxuICAgICAgICBpZiAoc291cmNlRmlsZSAmJiBzb3VyY2VGaWxlVG9rZW4udHlwZSA9PT0gXCJpbmxpbmVcIikge1xyXG4gICAgICAgICAgc291cmNlID0gcmVhZEZpbGVTeW5jKHJlc29sdmUoZGVtb1BhdGgsIHNvdXJjZUZpbGUpLCBcInV0Zi04XCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXNvdXJjZSkgdGhyb3cgbmV3IEVycm9yKGBJbmNvcnJlY3Qgc291cmNlIGZpbGUgcGF0aDogJHtzb3VyY2VGaWxlfWApO1xyXG5cclxuICAgICAgICByZXR1cm4gYDxUa0RlbW9Db2RlIHNvdXJjZT1cIiR7ZW5jb2RlVVJJQ29tcG9uZW50KFxyXG4gICAgICAgICAgbWQucmVuZGVyKGBcXGBcXGBcXGAgdnVlXFxuJHtzb3VyY2V9XFxgXFxgXFxgYClcclxuICAgICAgICApfVwiIHBhdGg9XCIke3Bvc2l4LmpvaW4ocGF0aCwgc291cmNlRmlsZSl9XCIgcmF3LXNvdXJjZT1cIiR7ZW5jb2RlVVJJQ29tcG9uZW50KFxyXG4gICAgICAgICAgc291cmNlXHJcbiAgICAgICAgKX1cIiBkZXNjcmlwdGlvbj1cIiR7ZW5jb2RlVVJJQ29tcG9uZW50KG1kLnJlbmRlcihkZXNjcmlwdGlvbikpfVwiIGRlbW89XCIke2VuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShvcHRpb24pKX1cIj5gO1xyXG4gICAgICB9IGVsc2UgcmV0dXJuIFwiPC9Ua0RlbW9Db2RlPlwiO1xyXG4gICAgfSxcclxuICB9O1xyXG5cclxuICBtZC51c2UoY29udGFpbmVyLCBcImRlbW9cIiwgb3B0aW9ucyk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZW1vUGx1Z2luO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkU6XFxcXFx1OTg3OVx1NzZFRVx1NTMzQVxcXFxWU0NvZGVQcm9qZWN0c1xcXFxNeVByb2plY3RzXFxcXHZpdGVwcmVzcy10aGVtZS10ZWVrXFxcXHBhY2thZ2VzXFxcXG1hcmtkb3duXFxcXHBsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXFx1OTg3OVx1NzZFRVx1NTMzQVxcXFxWU0NvZGVQcm9qZWN0c1xcXFxNeVByb2plY3RzXFxcXHZpdGVwcmVzcy10aGVtZS10ZWVrXFxcXHBhY2thZ2VzXFxcXG1hcmtkb3duXFxcXHBsdWdpbnNcXFxcdmlkZW8udHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6LyVFOSVBMSVCOSVFNyU5QiVBRSVFNSU4QyVCQS9WU0NvZGVQcm9qZWN0cy9NeVByb2plY3RzL3ZpdGVwcmVzcy10aGVtZS10ZWVrL3BhY2thZ2VzL21hcmtkb3duL3BsdWdpbnMvdmlkZW8udHNcIjtpbXBvcnQgdHlwZSBNYXJrZG93bkl0IGZyb20gXCJtYXJrZG93bi1pdFwiO1xyXG5pbXBvcnQgY29udGFpbmVyIGZyb20gXCJtYXJrZG93bi1pdC1jb250YWluZXJcIjtcclxuXHJcbmNvbnN0IHR5cGUgPSBcInZpZGVvXCI7XHJcblxyXG5jb25zdCB2aWRlb1BsdWdpbiA9IChtZDogTWFya2Rvd25JdCkgPT4ge1xyXG4gIG1kLnVzZShjb250YWluZXIsIHR5cGUsIHt9KTtcclxuXHJcbiAgbWQucmVuZGVyZXIucnVsZXNbYGNvbnRhaW5lcl8ke3R5cGV9X29wZW5gXSA9ICh0b2tlbnMsIGlkeCkgPT4ge1xyXG4gICAgY29uc3QgY29udGFpbmVyVG9rZW4gPSB0b2tlbnNbaWR4XTtcclxuICAgIGNvbnN0IGluZm8gPSBjb250YWluZXJUb2tlbi5pbmZvLnRyaW0oKS5zbGljZSh0eXBlLmxlbmd0aCkudHJpbSgpO1xyXG5cclxuICAgIGNvbnN0IGNvbnRlbnRUb2tlbiA9IHRva2Vuc1tpZHggKyAyXTtcclxuICAgIGNvbnN0IGNvbnRlbnQgPSBjb250ZW50VG9rZW4uY29udGVudC50cmltKCkgfHwgXCJcIjtcclxuICAgIGNvbnN0IHZpZGVvID0gaW5mbyA/IHZpZGVvTWFwW2luZm9dIDogeyBzcmM6ICgpID0+IGNvbnRlbnQsIHRpdGxlOiBcIkN1c3RvbSB2aWRlbyBwbGF5ZXJcIiB9O1xyXG5cclxuICAgIC8vIFx1OTY5MFx1ODVDRlx1NkU5MFx1NTE4NVx1NUJCOVxyXG4gICAgY29udGVudFRva2VuLnR5cGUgPSBcIlwiO1xyXG4gICAgY29udGVudFRva2VuLnRhZyA9IFwiXCI7XHJcbiAgICBjb250ZW50VG9rZW4uaGlkZGVuID0gdHJ1ZTtcclxuXHJcbiAgICByZXR1cm4gYDxkaXYgY2xhc3M9XCIke2Ake3R5cGV9LWNvbnRhaW5lcmB9XCI+XHJcbiAgICAgIDxpZnJhbWVcclxuICAgICAgICBjbGFzcz1cInZpZGVvLWlmcmFtZVwiXHJcbiAgICAgICAgbG9hZGluZz1cImxhenlcIlxyXG4gICAgICAgIHNyYz1cIiR7dmlkZW8uc3JjKGNvbnRlbnQpfVwiXHJcbiAgICAgICAgdGl0bGU9XCIke3ZpZGVvLnRpdGxlfVwiXHJcbiAgICAgICAgYWxsb3c9XCJhY2NlbGVyb21ldGVyOyBjbGlwYm9hcmQtd3JpdGU7IGVuY3J5cHRlZC1tZWRpYTsgZ3lyb3Njb3BlOyBwaWN0dXJlLWluLXBpY3R1cmU7IHdlYi1zaGFyZTsgZnVsbHNjcmVlbjtcIlxyXG4gICAgICAgIGFsbG93ZnVsbHNjcmVlbj1cInRydWVcIlxyXG4gICAgICAvPlxyXG4gICAgYDtcclxuICB9O1xyXG59O1xyXG5cclxuY29uc3QgdmlkZW9NYXA6IFJlY29yZDxzdHJpbmcsIHsgc3JjOiAoaWQ6IHN0cmluZykgPT4gc3RyaW5nOyB0aXRsZTogc3RyaW5nIH0+ID0ge1xyXG4gIGJpbGliaWxpOiB7XHJcbiAgICBzcmM6IChpZDogc3RyaW5nKSA9PiBgaHR0cHM6Ly9wbGF5ZXIuYmlsaWJpbGkuY29tL3BsYXllci5odG1sP2J2aWQ9JHtpZH0mYXV0b3BsYXk9MGAsXHJcbiAgICB0aXRsZTogXCJCaWxpYmlsaSB2aWRlbyBwbGF5ZXJcIixcclxuICB9LFxyXG4gIHRlbmNlbnQ6IHtcclxuICAgIHNyYzogKGlkOiBzdHJpbmcpID0+IGBodHRwczovL3YucXEuY29tL3R4cC9pZnJhbWUvcGxheWVyLmh0bWw/dmlkPSR7aWR9YCxcclxuICAgIHRpdGxlOiBcIlRlbmNlbnQgVmlkZW8gcGxheWVyXCIsXHJcbiAgfSxcclxuICB5b3VrdToge1xyXG4gICAgc3JjOiAoaWQ6IHN0cmluZykgPT4gYGh0dHBzOi8vcGxheWVyLnlvdWt1LmNvbS9lbWJlZC8ke2lkfWAsXHJcbiAgICB0aXRsZTogXCJZb3VrdSB2aWRlbyBwbGF5ZXJcIixcclxuICB9LFxyXG4gIHlvdXR1YmU6IHtcclxuICAgIHNyYzogKGlkOiBzdHJpbmcpID0+IGBodHRwczovL3d3dy55b3V0dWJlLW5vY29va2llLmNvbS9lbWJlZC8ke2lkfWAsXHJcbiAgICB0aXRsZTogXCJZb3VUdWJlIHZpZGVvIHBsYXllclwiLFxyXG4gIH0sXHJcbiAgdmltZW86IHtcclxuICAgIHNyYzogKGlkOiBzdHJpbmcpID0+IGBodHRwczovL3BsYXllci52aW1lby5jb20vdmlkZW8vJHtpZH1gLFxyXG4gICAgdGl0bGU6IFwiVmltZW8gdmlkZW8gcGxheWVyXCIsXHJcbiAgfSxcclxuICB4aWd1YToge1xyXG4gICAgc3JjOiAoaWQ6IHN0cmluZykgPT4gYGh0dHBzOi8vd3d3Lml4aWd1YS5jb20vaWZyYW1lLyR7aWR9YCxcclxuICAgIHRpdGxlOiBcIlhpR3VhIHZpZGVvIHBsYXllclwiLFxyXG4gIH0sXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCB2aWRlb1BsdWdpbjtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxcdTk4NzlcdTc2RUVcdTUzM0FcXFxcVlNDb2RlUHJvamVjdHNcXFxcTXlQcm9qZWN0c1xcXFx2aXRlcHJlc3MtdGhlbWUtdGVla1xcXFxwYWNrYWdlc1xcXFxjb25maWdcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXFx1OTg3OVx1NzZFRVx1NTMzQVxcXFxWU0NvZGVQcm9qZWN0c1xcXFxNeVByb2plY3RzXFxcXHZpdGVwcmVzcy10aGVtZS10ZWVrXFxcXHBhY2thZ2VzXFxcXGNvbmZpZ1xcXFxhZGRGcm9udG1hdHRlci50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovJUU5JUExJUI5JUU3JTlCJUFFJUU1JThDJUJBL1ZTQ29kZVByb2plY3RzL015UHJvamVjdHMvdml0ZXByZXNzLXRoZW1lLXRlZWsvcGFja2FnZXMvY29uZmlnL2FkZEZyb250bWF0dGVyLnRzXCI7aW1wb3J0IHR5cGUgeyBTaXRlQ29uZmlnIH0gZnJvbSBcInZpdGVwcmVzc1wiO1xyXG5pbXBvcnQgdHlwZSB7IEZpbGVJbmZvIH0gZnJvbSBcInZpdGVwcmVzcy1wbHVnaW4tYXV0by1mcm9udG1hdHRlclwiO1xyXG5cclxuLyoqXHJcbiAqIFx1NTIxQlx1NUVGQSBwZXJtYWxpbmsgXHU2QzM4XHU0RTQ1XHU5NEZFXHU2M0E1XHJcbiAqXHJcbiAqIEBwYXJhbSBwZXJtYWxpbmtQcmVmaXggcGVybWFsaW5rIFx1NTI0RFx1N0YwMFxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGNyZWF0ZVBlcm1hbGluayA9IChwZXJtYWxpbmtQcmVmaXggPSBcIlwiKSA9PiB7XHJcbiAgbGV0IGZpbmFsUGVybWFsaW5rUHJlZml4ID0gcGVybWFsaW5rUHJlZml4O1xyXG4gIGlmICghZmluYWxQZXJtYWxpbmtQcmVmaXguc3RhcnRzV2l0aChcIi9cIikpIGZpbmFsUGVybWFsaW5rUHJlZml4ID0gXCIvXCIgKyBmaW5hbFBlcm1hbGlua1ByZWZpeDtcclxuICBpZiAoIWZpbmFsUGVybWFsaW5rUHJlZml4LmVuZHNXaXRoKFwiL1wiKSkgZmluYWxQZXJtYWxpbmtQcmVmaXggPSBmaW5hbFBlcm1hbGlua1ByZWZpeCArIFwiL1wiO1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgcGVybWFsaW5rOiBgJHtmaW5hbFBlcm1hbGlua1ByZWZpeH0keyhNYXRoLnJhbmRvbSgpICsgTWF0aC5yYW5kb20oKSkudG9TdHJpbmcoMTYpLnNsaWNlKDIsIDgpfWAsXHJcbiAgfTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBcdTUyMUJcdTVFRkEgY2F0ZWdvcmllcyBcdTUyMDZcdTdDN0JcdTUyMTdcdTg4NjhcclxuICpcclxuICogQHBhcmFtIGZpbGVJbmZvIFx1NjU4N1x1NEVGNlx1NEZFMVx1NjA2RlxyXG4gKiBAcGFyYW0gaWdub3JlIFx1OTcwMFx1ODk4MVx1NUZGRFx1NzU2NVx1NzY4NFx1NjU4N1x1NEVGNlx1NTQwRFx1NjIxNlx1NzZFRVx1NUY1NVx1NTQwRFxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGNyZWF0ZUNhdGVnb3J5ID0gKGZpbGVJbmZvOiBGaWxlSW5mbywgaWdub3JlOiBzdHJpbmdbXSA9IFtdKSA9PiB7XHJcbiAgY29uc3Qgc2l0ZUNvbmZpZzogU2l0ZUNvbmZpZyA9IChnbG9iYWxUaGlzIGFzIGFueSkuVklURVBSRVNTX0NPTkZJRztcclxuICBjb25zdCB7IGxvY2FsZXMgPSB7fSB9ID0gc2l0ZUNvbmZpZy51c2VyQ29uZmlnO1xyXG5cclxuICBjb25zdCByZWxhdGl2ZVBhdGhBcnIgPSBmaWxlSW5mby5yZWxhdGl2ZVBhdGguc3BsaXQoXCIvXCIpO1xyXG5cclxuICBjb25zdCBjYXRlZ29yaWVzOiBzdHJpbmdbXSA9IFtdO1xyXG4gIHJlbGF0aXZlUGF0aEFyci5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xyXG4gICAgLy8gXHU1M0JCXHU5NjY0XHUzMDBDXHU1RThGXHU1M0Y3Llx1MzAwRFx1NzY4NFx1NTI0RFx1N0YwMFx1RkYwQ1x1NUU3Nlx1ODNCN1x1NTNENlx1NjU4N1x1NEVGNlx1NTQwRFxyXG4gICAgY29uc3QgZmlsZW5hbWUgPSBpdGVtLnJlcGxhY2UoL15cXGQrXFwuLywgXCJcIikuc3BsaXQoXCIuXCIpPy5bMF0gfHwgXCJcIjtcclxuXHJcbiAgICAvLyBcdTUxN0NcdTVCQjlcdTU2RkRcdTk2NDVcdTUzMTZcdTUyOUZcdTgwRkRcdUZGMENcdTU5ODJcdTY3OUNcdTkxNERcdTdGNkVcdTU5MUFcdThCRURcdThBMDBcdUZGMENcdTUyMTlcdTRFMERcdTZERkJcdTUyQTBcdTU5MUFcdThCRURcdThBMDBcdTY4MzlcdTc2RUVcdTVGNTVcdTU0MERcclxuICAgIGlmIChpbmRleCAhPT0gcmVsYXRpdmVQYXRoQXJyLmxlbmd0aCAtIDEgJiYgIWxvY2FsZXNbZmlsZW5hbWVdICYmICFpZ25vcmUuaW5jbHVkZXMoZmlsZW5hbWUpKVxyXG4gICAgICBjYXRlZ29yaWVzLnB1c2goZmlsZW5hbWUpO1xyXG4gIH0pO1xyXG5cclxuICAvLyBbXCJcIl0gXHU4ODY4XHU3OTNBXHU2REZCXHU1MkEwXHU0RTAwXHU0RTJBXHU0RTNBXHU3QTdBXHU3Njg0IGNhdGVnb3JpZXNcclxuICByZXR1cm4geyBjYXRlZ29yaWVzOiBjYXRlZ29yaWVzLmxlbmd0aCA/IGNhdGVnb3JpZXMgOiBbXCJcIl0gfTtcclxufTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxcdTk4NzlcdTc2RUVcdTUzM0FcXFxcVlNDb2RlUHJvamVjdHNcXFxcTXlQcm9qZWN0c1xcXFx2aXRlcHJlc3MtdGhlbWUtdGVla1xcXFxwYWNrYWdlc1xcXFx0ZWVrXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFxcdTk4NzlcdTc2RUVcdTUzM0FcXFxcVlNDb2RlUHJvamVjdHNcXFxcTXlQcm9qZWN0c1xcXFx2aXRlcHJlc3MtdGhlbWUtdGVla1xcXFxwYWNrYWdlc1xcXFx0ZWVrXFxcXHZlcnNpb24udHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6LyVFOSVBMSVCOSVFNyU5QiVBRSVFNSU4QyVCQS9WU0NvZGVQcm9qZWN0cy9NeVByb2plY3RzL3ZpdGVwcmVzcy10aGVtZS10ZWVrL3BhY2thZ2VzL3RlZWsvdmVyc2lvbi50c1wiO2V4cG9ydCBjb25zdCB2ZXJzaW9uID0gXCIxLjAuMlwiO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTZaLFNBQVMsb0JBQW9COzs7QUNHMWIsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sZUFBZTtBQUN0QixPQUFPLFVBQVU7QUFDakIsT0FBTyxlQUFlO0FBQ3RCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sdUJBQXFEO0FBQzVELE9BQU8scUJBQXFCOzs7QUNMNUIsU0FBUyxzQkFBc0I7QUFDL0IsU0FBUyxVQUFVLFlBQVk7QUFDL0IsU0FBUyxnQkFBZ0I7QUFDekIsU0FBUyxrQkFBa0I7OztBQ2FwQixJQUFNLGNBQWMsQ0FBQyxVQUE0QztBQUN0RSxTQUFPLE1BQU0sT0FBTyxDQUFDLEVBQUUsYUFBYSxFQUFFLFNBQVMsT0FBTyxFQUFFLE1BQU0sWUFBWSxTQUFTLFdBQVcsTUFBTTtBQUN0RztBQU1PLElBQU0sOEJBQThCLENBQUMsVUFBNEM7QUFFdEYsUUFBTSxJQUFJLENBQUMsR0FBRyxLQUFLO0FBQ25CLFNBQU8sRUFBRSxLQUFLLENBQUMsTUFBTSxTQUFTO0FBRTVCLFVBQU0sYUFBYSxLQUFLLFlBQVk7QUFDcEMsVUFBTSxhQUFhLEtBQUssWUFBWTtBQUVwQyxRQUFJLGNBQWMsV0FBWSxRQUFPLGVBQWUsYUFBYSxZQUFZLE1BQU0sSUFBSSxJQUFJLGFBQWE7QUFDeEcsUUFBSSxXQUFZLFFBQU87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QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNILEVBQUUsTUFBTSxnQkFBTSxNQUFNLElBQUk7QUFBQSxNQUN4QixFQUFFLE1BQU0sZ0JBQU0sTUFBTSxnQkFBZ0IsYUFBYSxvQkFBVTtBQUFBLE1BQzNELEVBQUUsTUFBTSxnQkFBTSxNQUFNLHFCQUFxQixhQUFhLG9CQUFVO0FBQUEsTUFDaEUsRUFBRSxNQUFNLGdCQUFNLE1BQU0sa0JBQWtCLGFBQWEsZ0NBQVk7QUFBQSxNQUMvRCxFQUFFLE1BQU0sNEJBQVEsTUFBTSxhQUFhLGFBQWEsZ0NBQVk7QUFBQSxNQUM1RCxFQUFFLE1BQU0sZ0JBQU0sTUFBTSxRQUFRO0FBQUEsTUFDNUI7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLE9BQU87QUFBQSxVQUNMLEVBQUUsTUFBTSxjQUFjLE1BQU0sd0JBQXdCO0FBQUEsVUFDcEQsRUFBRSxNQUFNLFVBQVUsTUFBTSxvQkFBb0I7QUFBQSxVQUM1QyxFQUFFLE1BQU0sU0FBUyxNQUFNLG1CQUFtQjtBQUFBLFVBQzFDLEVBQUUsTUFBTSxxQ0FBaUIsTUFBTSw2QkFBNkI7QUFBQSxRQUM5RDtBQUFBLE1BQ0Y7QUFBQSxNQUNBO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixPQUFPO0FBQUEsVUFDTCxFQUFFLE1BQU0sNEJBQVEsTUFBTSxpRUFBaUU7QUFBQSxVQUN2RixFQUFFLE1BQU0sNEJBQVEsTUFBTSw4RUFBOEU7QUFBQSxRQUN0RztBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxhQUFhLENBQUMsRUFBRSxNQUFNLFVBQVUsTUFBTSx3REFBd0QsQ0FBQztBQUFBLElBRS9GLFFBQVE7QUFBQSxNQUNOLFVBQVU7QUFBQSxJQUNaO0FBQUEsSUFDQSxVQUFVO0FBQUEsTUFDUixNQUFNO0FBQUEsTUFDTixTQUFTO0FBQUEsSUFDWDtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogWyJ0eXBlIiwgImNvbnRhaW5lciIsICJ0eXBlIiwgImNvbnRhaW5lciIsICJ3aXRoQmFzZSIsICJyb290Q2xhc3MiLCAid2l0aEJhc2UiLCAid2l0aEJhc2UiLCAicm9vdENsYXNzIiwgIndpdGhCYXNlIiwgImpvaW4iLCAiY29udGFpbmVyIiwgImpvaW4iLCAiZGVzY3JpcHRpb24iLCAiY29udGFpbmVyIiwgImNvbnRhaW5lciIsICJjb250YWluZXIiLCAidGVla0NvbmZpZyIsICJjb250YWluZXIiLCAiY29uZmlnIl0KfQo=
