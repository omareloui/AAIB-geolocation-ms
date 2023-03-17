export function capitalize(str: string) {
  return str.toLowerCase().replace(/\b\w/g, (v) => v.toUpperCase());
}
