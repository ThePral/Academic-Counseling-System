import { Locale } from "../types/global.types";
declare const fa: {
    readonly today: "امروز";
    readonly startDate: "تاریخ شروع";
    readonly endDate: "تاریخ پایان";
    readonly to: "تا";
};
declare const en: {
    readonly today: "Today";
    readonly startDate: "Start date";
    readonly endDate: "End date";
    readonly to: "to";
};
type TranslationKey = keyof typeof fa;
type Translation = Record<Locale, Record<TranslationKey, string>>;
export type { TranslationKey, Translation };
export { fa, en };
//# sourceMappingURL=translations.d.ts.map