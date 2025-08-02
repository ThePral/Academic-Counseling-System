import { DatePickerProps } from "../core";
export declare const generateNextMonthDays: ({ currentMonthWeekDay, currentMonth, year, isJalaali, disabledDates, }: {
    currentMonthWeekDay: number;
    currentMonth: number;
    year: number;
    disabledDates: DatePickerProps["disabledDates"];
    isJalaali?: boolean | undefined;
}) => {
    isNotCurrentMonth: boolean;
    id: string;
    isWeekend?: boolean | undefined;
    isDisabled?: boolean | undefined;
    year: number;
    month: number;
    day: number;
}[];
//# sourceMappingURL=generateNextMonthDays.d.ts.map