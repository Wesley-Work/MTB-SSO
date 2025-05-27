/**
 * 判断时间，如果在5点至10点，则返回早上，如果10点至13点则返回中午，如果为13点至17点则返回下午，如果是17点至次日5点则返回晚上，需要具体到分钟判断
 */
export function judgmentTime(): string {
  const date = new Date();
  const hour = date.getHours();

  if (hour >= 17 || hour < 5) {
    return '晚上';
  } else if (hour >= 5 && hour < 10) {
    return '早上';
  } else if (hour >= 10 && hour < 13) {
    return '中午';
  } else if (hour >= 13 && hour < 17) {
    return '下午';
  }

  return '晚上';
}
