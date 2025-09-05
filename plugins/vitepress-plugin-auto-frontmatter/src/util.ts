export function formatDate(d: any, fmt = "yyyy-MM-dd hh:mm:ss", enableHandleTimezone = true) {
  // 1. 统一转换为 Date 对象（处理各种输入类型）
  let date: Date;

  if (d instanceof Date) {
    // 处理已有 Date 实例，按需进行时区转换
    date = enableHandleTimezone ? new Date(d.getTime() + d.getTimezoneOffset() * 60000) : new Date(d); // 复制实例避免修改原对象
  } else {
    // 解析字符串/数字为时间戳
    const timestamp = typeof d === "string" ? Date.parse(d.replace(/Z$/i, "")) : Number(d); // 处理数字/时间戳

    // 无效时间戳时返回当前本地时间字符串
    if (isNaN(timestamp)) {
      date = new Date();
    } else {
      date = new Date(timestamp);
    }
  }

  // 2. 预计算日期组件（减少 getXXX() 调用次数）
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const quarter = Math.floor((month + 2) / 3); // 简化季度计算
  const ms = date.getMilliseconds();

  // 3. 处理年份格式化
  if (/(y+)/.test(fmt)) {
    const yearStr = String(year);
    fmt = fmt.replace(RegExp.$1, yearStr.slice(-RegExp.$1.length)); // 更简洁的截取方式
  }

  // 4. 定义格式替换映射（避免循环中创建正则，提升性能）
  const replacements: Record<string, (length: number) => string> = {
    "M+": len => pad(month, len),
    "d+": len => pad(day, len),
    "h+": len => pad(hours, len),
    "m+": len => pad(minutes, len),
    "s+": len => pad(seconds, len),
    "q+": len => pad(quarter, len),
    S: () => String(ms),
  };

  // 5. 替换所有格式符
  for (const key in replacements) {
    const match = fmt.match(new RegExp(`(${key})`));
    if (match) {
      fmt = fmt.replace(match[1], replacements[key](match[1].length));
    }
  }

  return fmt;
}

/**
 * 数字补零工具函数
 * @param num 待处理数字
 * @param length 目标长度
 * @returns 补零后的字符串
 */
function pad(num: number, length: number): string {
  return length === 1 ? String(num) : num.toString().padStart(length, "0"); // 原生方法更高效
}
