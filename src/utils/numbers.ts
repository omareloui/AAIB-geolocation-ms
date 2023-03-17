export function getNumber(
  input: string | number,
  options: { isFloat: boolean } = { isFloat: false },
): number | undefined {
  const parseFunc = options.isFloat ? parseFloat : parseInt;
  const num = parseFunc(input.toString(), 10);

  if (Number.isNaN(num)) return undefined;

  return num;
}
