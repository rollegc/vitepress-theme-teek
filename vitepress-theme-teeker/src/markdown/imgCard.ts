import MarkdownIt from "markdown-it";
import container from "markdown-it-container";
import yaml from "js-yaml";
import { withBase } from "../helper/util";

const imgCardName = "imgCard";

/**
 * 生成图片卡片列表的 Markdown 插件
 * @param md MarkdownIt 实例
 * @param base 根路径
 */
const imgCardPlugin = (md: MarkdownIt, base = "") => {
  // 注册容器
  md.use(container, imgCardName, {});

  md.renderer.rules[`container_${imgCardName}_open`] = (tokens, idx, options, _: any, self) => {
    const token = tokens[idx];
    // 不是 ${imgCardName} 标签，则返回原内容
    if (token.markup !== ":::") return self.renderToken(tokens, idx, options);

    let html = `<div class="img-card-container">`;

    for (let i = idx; i < tokens.length; i++) {
      const contentToken = tokens[i];

      // 循环到 ${imgCardName} 的结束标签，则跳出
      if (contentToken.type === `container_${imgCardName}_close`) break;
      // 只要 yaml 代码块
      if (!["yaml", "yml"].includes(contentToken.info)) continue;

      // 获取卡片数量
      const cardNum = token.info.trim().slice(imgCardName.length).trim();
      // 解析 yaml 内容
      const yamlContent = yaml.load(contentToken.content.trim()) as any[];

      html += renderImgCard(yamlContent, Number(cardNum || 3), base);

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
 * 渲染图片卡片列表
 * @param cards 图片卡片数组
 */
function renderImgCard(cards: any[], cardNum: number, base: string): string {
  if (!cards.length) return "";
  if (!cardNum || cardNum > 4 || cardNum < 1) cardNum = 3;

  return `
    <div class="img-card">
      ${cards
        .map(
          card => `
            <div class="img-card__item ${cardNum ? `row-${cardNum}` : ""}">
              <a href="${withBase(base, card.link)}" target="${card.target || "_blank"}">
                <div class="img-card__item__img" style="height: ${card.imgHeight}">
                  <img src="${withBase(base, card.img)}" class="no-zoom" style="object-fit: ${card.objectFit}">
                </div>
                <div class="img-card__item__info">
                    <p class="name">${card.name}</p>
                    ${card.desc ? `<p class="desc" style="-webkit-line-clamp: ${card.lineClamp}">${card.desc}</p>` : ""}
                </div>

                ${
                  card.avatar || card.author
                    ? `<div class="img-card__item__footer">
                        ${card.avatar ? `<img src="${withBase(base, card.avatar)}" class="no-zoom">` : ""}
                        ${card.author ? `<span>${card.author}</span>` : ""}
                      </div>`
                    : ""
                }
              </a>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

export default imgCardPlugin;
