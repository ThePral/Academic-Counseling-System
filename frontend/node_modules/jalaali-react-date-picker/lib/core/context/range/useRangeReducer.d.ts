import { RangePickerProps } from "../../interfaces";
import { Date, Locale, RangeDate, RangeValue } from "../../types/global.types";
interface RangeDateReducerType {
    formatProp?: string;
    onChangeProp?: RangePickerProps["onChange"];
    valueProp?: RangePickerProps["value"];
    defaultValueProp?: RangePickerProps["defaultValue"];
    onDayChangeProp?: RangePickerProps["onDayChange"];
    onMonthChangeProp?: RangePickerProps["onMonthChange"];
    onYearChangeProp?: RangePickerProps["onYearChange"];
    locale: Locale;
}
type Offsets = [number, number];
type RangeInput = [string, string];
type FromTo = {
    from: Date;
    to: Date;
};
export declare const useRangeReducer: ({ formatProp, valueProp, defaultValueProp, onChangeProp, onDayChangeProp, onMonthChangeProp, onYearChangeProp, locale, }: RangeDateReducerType) => {
    rangeState: RangeDate;
    cacheRangeDate: RangeDate;
    onRangeDateChange: (payload: RangeDate | null) => void;
    onRangeDaychange: (payload: Date, isStartDate: boolean) => void;
    onRangeMonthchange: (month: number, mode: "from" | "to") => void;
    onRangeYearchange: (year: number, mode: "from" | "to") => void;
    onRangeIncreaseYear: () => void;
    onRangeDecreaseYear: () => void;
    onRangeIncreaseMonth: () => void;
    onRangeDecreaseMonth: () => void;
    changeFrom: (from: Partial<FromTo["from"]>) => void;
    changeTo: (to: Partial<FromTo["to"]>) => void;
    dateRange: RangeValue;
    from: Date;
    to: Date;
    changePlaceholder: (date: Date | null) => void;
    offsets: Offsets;
    setOffsets: (offsets: [number, number]) => void;
    inputRangeProps: {
        values: RangeInput;
        onChangeInputRange: (e: React.ChangeEvent<HTMLInputElement>, isStartDate: boolean) => void;
        placeholderFrom: string;
        placeholderTo: string;
        onClear: () => void;
        isJalaali: boolean;
    };
};
export {};
//# sourceMappingURL=useRangeReducer.d.ts.map