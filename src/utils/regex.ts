export function sanatizeForRegex(str: string): string {
  return str.replace(/[\\?+*\-.]/g, (v) => `\\${v}`);
}
