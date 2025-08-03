import moment from "moment-jalaali";
export declare const useDatepicker: () => {
    offset: number;
    onDaychange: (payload: import("../..").Date) => void;
    onIncreaseYear: (payload: import("../..").Date) => void;
    onDecreaseYear: (payload: import("../..").Date) => void;
    onIncreaseMonth: (payload: import("../..").Date) => void;
    onDecreaseMonth: (payload: import("../..").Date) => void;
    changePlaceholder: (payload: import("../..").Date | null) => void;
    setOffset: (offset: number) => void;
    value?: moment.Moment | null | undefined;
    onChange?: ((date: moment.Moment | null | undefined, dateString: string) => void) | undefined;
    format?: string | (((value: moment.Moment) => string) & string) | undefined;
    state: import("../..").Date;
    onDateChange: (payload: import("../..").Date) => void;
    goToToday: () => void;
    isJalaali: boolean;
    locale: import("../..").Locale;
    dayLabels: string[];
    cacheDate: import("../..").Date | undefined;
    onMonthchange: (payload: import("../..").Date) => void;
    onYearchange: (payload: import("../..").Date) => void;
};
//# sourceMappingURL=useDatepicker.d.ts.map