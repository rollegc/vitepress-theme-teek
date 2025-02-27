import MarkdownIt from "markdown-it";
import yaml from "js-yaml";
import { withBase } from "../helper/util";
import container from "markdown-it-container";

const shareCardName = "shareCard";

/**
 * 生成卡片列表的 Markdown 插件
 */
const shareCardPlugin = (md: MarkdownIt, base = "") => {
  // 注册容器
  md.use(container, shareCardName, {});

  md.renderer.rules[`container_${shareCardName}_open`] = (tokens, idx, options, _: any, self) => {
    const token = tokens[idx];
    // 不是 ${shareCardName} 标签，则返回原内容
    if (token.markup !== ":::") return self.renderToken(tokens, idx, options);

    let html = `<div class="share-card-container">`;

    for (let i = idx; i < tokens.length; i++) {
      const contentToken = tokens[i];

      // 循环到 ${shareCardName} 的结束标签，则跳出
      if (contentToken.type === `container_${shareCardName}_close`) break;
      // 只要 yaml 代码块
      if (!["yaml", "yml"].includes(contentToken.info)) continue;

      // 获取卡片数量
      const cardNum = token.info.trim().slice(shareCardName.length).trim();
      // 解析 yaml 内容
      const yamlContent = yaml.load(contentToken.content.trim()) as any[];

      html += renderShareCard(yamlContent, Number(cardNum || 3), base);

      // 删除 yaml 代码块
      contentToken.type = "";
      contentToken.tag = "";
      contentToken.hidden = true;
    }

    // 返回不能有 </div>
    return html;
  };
};

/**
 * 渲染卡片列表
 *
 * @param cards 卡片数组
 */
const renderShareCard = (cards: any[], cardNum: number, base: string) => {
  if (!cards.length) return "";
  if (!cardNum || cardNum > 4 || cardNum < 1) cardNum = 3;

  return `
    <div class="share-card">
      ${cards
        .map(
          card => `
            <${card.link ? "a" : "span"}
              href="${withBase(base, card.link)}" target=${card.target || "_blank"}
              class="share-card__item ${cardNum ? `row-${cardNum}` : ""}"
              style="
                ${card.bgColor ? `background-color: ${card.bgColor};--bgColor:${card.bgColor};` : "--bgColor: var(--vp-c-gray-1);"}
                ${card.textColor ? `color: ${card.textColor};` : ""}
              "
             >
              ${card.avatar ? `<img src="${withBase(base, card.avatar)}" alt="${card.name}" class="card-avatar">` : ""}
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
