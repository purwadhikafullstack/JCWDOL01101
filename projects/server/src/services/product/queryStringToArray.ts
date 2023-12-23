export function queryStringToArray(str: string) {
  const trimeedStr = str.trim();
  if (trimeedStr.length === 0) {
    return [];
  }
  return trimeedStr.split(',').map(Number).filter(Number.isInteger);
}
