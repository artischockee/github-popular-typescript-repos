import { DAY_MS, HOUR_MS, MINUTE_MS, SECOND_MS } from "../../constants/time";

export function getRelativeTimeFormatInstance(locales?: string | string[]) {
  return new Intl.RelativeTimeFormat(locales, {
    numeric: "auto",
    style: "long",
  });
}

const TIME_CHECK_ORDER: {
  time: number;
  unit: Intl.RelativeTimeFormatUnit;
}[] = [
  { time: DAY_MS, unit: "days" },
  { time: HOUR_MS, unit: "hours" },
  { time: MINUTE_MS, unit: "minutes" },
  { time: SECOND_MS, unit: "seconds" },
];

export function getFormattedRelativeTime(
  originalTime: number,
  relativeToTime: number,
  locales?: string | string[]
): string;
export function getFormattedRelativeTime(
  originalTime: number,
  relativeToTime: number,
  relativeTimeFormat: Intl.RelativeTimeFormat
): string;
export function getFormattedRelativeTime(
  originalTime: number,
  relativeToTime: number,
  localesOrRelativeTimeFormat?: string | string[] | Intl.RelativeTimeFormat
) {
  const rtf =
    localesOrRelativeTimeFormat instanceof Intl.RelativeTimeFormat
      ? localesOrRelativeTimeFormat
      : new Intl.RelativeTimeFormat(localesOrRelativeTimeFormat, {
          numeric: "auto",
          style: "long",
        });

  const timeDiff = originalTime - relativeToTime;

  for (let i = 0; i < TIME_CHECK_ORDER.length; ++i) {
    const diff = timeDiff / TIME_CHECK_ORDER[i].time;

    if (Math.abs(diff) >= 1) {
      return rtf.format(Math.round(diff), TIME_CHECK_ORDER[i].unit);
    }
  }

  return rtf.format(0, "seconds"); // fallback
}
