import { DatePickerProps } from "../../interfaces";
import { Date, Locale } from "../../types/global.types";
interface DateReducerType {
    formatProp?: string;
    onChangeProp?: DatePickerProps["onChange"];
    valueProp?: DatePickerProps["value"];
    defaultValueProp?: DatePickerProps["defaultValue"];
    onDayChangeProp?: DatePickerProps["onDayChange"];
    onMonthChangeProp?: DatePickerProps["onMonthChange"];
    onYearChangeProp?: DatePickerProps["onYearChange"];
    locale: Locale;
    setOffset?: (offset: number) => void;
    close?: () => void;
}
export declare const useDateReducer: ({ formatProp, valueProp, defaultValueProp, onChangeProp, onDayChangeProp, onMonthChangeProp, onYearChangeProp, locale, close, }: DateReducerType) => {
    state: Date;
    cacheDate: Date;
    onDateChange: (payload: Date | null) => void;
    onDaychange: (payload: Date) => void;
    onMonthchange: (payload: Date) => void;
    onYearchange: (payload: Date) => void;
    onIncreaseYear: (payload: Date) => void;
    onDecreaseYear: (payload: Date) => void;
    onIncreaseMonth: (payload: Date) => void;
    onDecreaseMonth: (payload: Date) => void;
    changePlaceholder: (date: Date | null) => void;
    onClear: () => void;
    offset: number;
    setOffset: (offset: number) => void;
    inputProps: {
        value: string;
        placeholder: string;
        onChangeInputValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
        onClear: () => void;
        isJalaali: boolean;
    };
};
export {};
//# sourceMappingURL=useDateReducer.d.ts.map