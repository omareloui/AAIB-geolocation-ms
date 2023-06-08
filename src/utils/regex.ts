export function sanitizeForRegex(str: string): string {
  return str.replace(/[\\?+*\-.]/g, (v) => `\\${v}`);
}
