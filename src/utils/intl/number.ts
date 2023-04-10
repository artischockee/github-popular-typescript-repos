export function getNumberFormatInstance(locales?: string | string[]) {
  return new Intl.NumberFormat(locales, { style: "decimal" });
}

export function getFormattedNumber(
  rawNumber: number | bigint,
  locales?: string | string[]
): string;
export function getFormattedNumber(
  rawNumber: number | bigint,
  numberFormat: Intl.NumberFormat
): string;
export function getFormattedNumber(
  rawNumber: number | bigint,
  localesOrNumberFormat?: string | string[] | Intl.NumberFormat
) {
  if (localesOrNumberFormat instanceof Intl.NumberFormat) {
    return localesOrNumberFormat.format(rawNumber);
  }

  return new Intl.NumberFormat(localesOrNumberFormat, {
    style: "decimal",
  }).format(rawNumber);
}
