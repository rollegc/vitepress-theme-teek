import type MarkdownIt from "markdown-it";
import { withBase } from "../../helper/util";
import type { NavCard } from "../types";
import type { SiteConfig } from "vitepress";
import { createCardContainer } from "../helper";

const rootClass = "nav-card";
const defaultCardNum = 2;

/**
 * 生成导航卡片容器
 *
 * @param md MarkdownIt 实例
 */
const navCardPlugin = (md: MarkdownIt) => {
  const siteConfig: SiteConfig = (globalThis as any).VITEPRESS_CONFIG;
  const { base = "/" } = siteConfig.userConfig;

  createCardContainer<NavCard.Item, NavCard.Config>(md, {
    type: "navCard",
    className: `${rootClass}-container`,
    htmlRender: (props, info) => getNavCardHtml(props, info, base),
    afterHtmlRender: (props, _, tokens, idx) => {
      // 删除 yaml 代码块
      if (props.config.showCode !== true) {
        tokens[idx].type = "";
        tokens[idx].tag = "";
        tokens[idx].hidden = true;
      }
    },
  });
};

/**
 * 获取导航卡片 HTML 标签
 *
 * @param navCard 导航卡片数据
 * @param base 根路径
 */
const getNavCardHtml = (navCard: { data: NavCard.Item[]; config: NavCard.Config }, info: string, base: string) => {
  const { data = [], config = {} } = navCard;
  if (!data.length) return "";

  const { cardNum: cn = 2, cardGap = 20, lineClamp = 2, target = "_blank" } = config;
  let cardNum = info ? Number(info) : cn;
  if (!cardNum || cardNum > 4 || cardNum < 1) cardNum = defaultCardNum;

  return `
    <div
      class="${rootClass} index-${cardNum}"
      style="--row-gap: ${cardGap}px; --column-gap: ${cardGap}px; --column-min-width: calc(100% / ${cardNum} - ${cardGap * (cardNum - 1)}px);"
    >
      ${data
        .map(
          card => `
            <${card.link ? "a" : "span"}
              href="${card.link}" target="${target}"
              class="${rootClass}__item"
              style="--desc-line-clamp: ${lineClamp}"
            >
              <div class="${rootClass}__item__info">
                ${card.img ? `<img src="${withBase(base, card.img)}">` : ""}
                <span class="name">${card.name}</span>
              </div>

              <p class="desc">${card.desc}</p>
              ${card.badge ? `<span class="VPBadge ${card.badgeType || "info"} badge">${card.badge}</span>` : ""}
            </${card.link ? "a" : "span"}>
        `
        )
        .join("")}
      </div>`;
};

export default navCardPlugin;
