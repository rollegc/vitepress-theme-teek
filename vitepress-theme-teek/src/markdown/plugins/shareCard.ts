import type MarkdownIt from "markdown-it";
import { withBase } from "../../helper/util";
import type { ShareCard } from "../types";
import type { SiteConfig } from "vitepress";
import { createCardContainer } from "../helper";

const rootClass = "share-card";

/**
 * 生成分享卡片容器
 *
 * @param md MarkdownIt 实例
 */
const shareCardPlugin = (md: MarkdownIt) => {
  const siteConfig: SiteConfig = (globalThis as any).VITEPRESS_CONFIG;
  const { base = "/" } = siteConfig.userConfig;

  createCardContainer<ShareCard.Item, ShareCard.Config>(md, {
    type: "shareCard",
    className: `${rootClass}-container`,
    htmlRender: (props, info) => renderShareCard(props, info, base),
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
 * 获取分享卡片 HTML 标签
 *
 * @param navCard 分享卡片数据
 * @param base 根路径
 */
const renderShareCard = (
  shareCard: { data: ShareCard.Item[]; config: ShareCard.Config },
  info: string,
  base: string
) => {
  const { data = [], config = {} } = shareCard;
  if (!data.length) return "";

  const { cardNum: cn = 2, cardGap = 20, target = "_blank" } = config;
  let cardNum = info ? Number(info) : cn;
  if (!cardNum || cardNum > 4 || cardNum < 1) cardNum = 2;

  return `
    <div
        class="${rootClass} index-${cardNum}"
        style="--row-gap: ${cardGap}px; --column-gap: ${cardGap}px; --column-min-width: calc(100% / ${cardNum} - ${cardGap * (cardNum - 1)}px);"
    >
      ${data
        .map(
          card => `
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
        )
        .join("")}
    </div>
  `;
};

export default shareCardPlugin;
