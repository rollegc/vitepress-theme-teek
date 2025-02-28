import MarkdownIt from "markdown-it";
import yaml from "js-yaml";
import { withBase } from "../../helper/util";
import container from "markdown-it-container";
import { ShareCard, ShareCardConfig, ShareCardItem } from "../types";

const shareCardName = "shareCard";
const rootClass = "share-card";

/**
 * 生成分享卡片容器
 *
 * @param md MarkdownIt 实例
 * @param base 根路径
 */
const shareCardPlugin = (md: MarkdownIt, base = "") => {
  // 注册容器
  md.use(container, shareCardName, {});

  // 注册成功后，就会监听到 container_xx_open，其中 xx 为注册的容器名
  md.renderer.rules[`container_${shareCardName}_open`] = (tokens, idx, options, _: any, self) => {
    const token = tokens[idx];
    // 如果不是 ${navCardName} 开头，则返回原内容
    if (!token.info.trim().startsWith(shareCardName)) return self.renderToken(tokens, idx, options);

    let html = `<div class="${rootClass}-container">`;

    for (let i = idx; i < tokens.length; i++) {
      const contentToken = tokens[i];

      // 循环到 ${shareCardName} 的结束标签，则跳出
      if (contentToken.type === `container_${shareCardName}_close`) break;
      if (!["yaml", "yml"].includes(contentToken.info)) continue;

      // 解析 yaml 内容
      const yamlContent = yaml.load(contentToken.content.trim()) as ShareCard | ShareCardItem[];

      let data: ShareCardItem[] = [];
      let config: ShareCardConfig = {};
      if (Array.isArray(yamlContent)) data = yamlContent;
      else {
        data = yamlContent.data || [];
        config = yamlContent.config || {};
      }

      // 获取容器名后面的卡片数量
      const cardNum = token.info.trim().slice(shareCardName.length).trim();
      config.cardNum = config.cardNum || Number(cardNum || 3);

      html += renderShareCard({ config, data }, base);

      // 删除 yaml 代码块
      if (config.showCode !== true) {
        contentToken.type = "";
        contentToken.tag = "";
        contentToken.hidden = true;
      }
    }

    // 返回不能有 </div> 结尾
    return html;
  };
};

/**
 * 获取分享卡片 HTML 标签
 *
 * @param navCard 分享卡片数据
 * @param base 根路径
 */
const renderShareCard = (shareCard: ShareCard, base: string) => {
  const { data = [], config = {} } = shareCard;
  if (!data.length) return "";

  const { cardGap = 20, target = "_blank" } = config;
  let { cardNum = 3 } = config;
  if (!cardNum || cardNum > 4 || cardNum < 1) cardNum = 3;

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
