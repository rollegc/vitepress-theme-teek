import MarkdownIt from "markdown-it";

const todoUncheck = "[ ] ";
const todoCheck = "[x] ";

/**
 * markdown 'TODO' 列表插件
 *
 * 使用：
 * - [ ] 吃饭
 * - [ ] 睡觉
 * - [x] 打豆豆
 *
 * - 可以换成 * 或者 +
 */
const todoPlugin = (md: MarkdownIt) => {
  md.renderer.rules.list_item_open = function (tokens, idx, options, _: any, self) {
    const token = tokens[idx];
    const inlineToken = tokens[idx + 2];
    const content = inlineToken.children?.[0].content;

    // 检查是否是列表项（以 -、* 或 + 开头）
    const isListItem = token.markup === "-" || token.markup === "*" || token.markup === "+";

    // 检查是否是 TODO 项
    if (isListItem &&  (content?.startsWith(todoUncheck) || content?.startsWith(todoCheck))) {
      const isChecked = content.startsWith(todoCheck);
      const checkbox = `<input class="todo-checkbox" type="checkbox" ${isChecked ? "checked" : ""} disabled />`;

      const text = content.slice(4); // 移除 "[ ] " 或 "[x] "
      inlineToken.content = text;
      inlineToken.children![0].content = text;

      return `<li class="todo">${checkbox}`;
    }

    // 如果不是 TODO 项，返回默认的渲染结果
    return self.renderToken(tokens, idx, options);
  };
};

export default todoPlugin;
