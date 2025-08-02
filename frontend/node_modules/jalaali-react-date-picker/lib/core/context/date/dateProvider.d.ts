/// <reference types="react" />
import { DatePickerProps } from "../../interfaces";
import { Date } from "../../types/global.types";
import { DatePropsReducerType } from "../propsReducer";
interface DateInputProps {
    value: string;
    placeholder?: string;
    isJalaali?: boolean;
    onClear: () => void;
    onChangeInputValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
interface ContextType extends DatePropsReducerType {
    state: Date;
    cacheDate?: Date;
    offset: number;
    onClear: () => void;
    onDateChange: (payload: Date) => void;
    onDaychange: (payload: Date) => void;
    onMonthchange: (payload: Date) => void;
    onYearchange: (payload: Date) => void;
    onIncreaseYear: (payload: Date) => void;
    onDecreaseYear: (payload: Date) => void;
    onIncreaseMonth: (payload: Date) => void;
    onDecreaseMonth: (payload: Date) => void;
    changePlaceholder: (payload: Date | null) => void;
    setOffset: (offset: number) => void;
}
export declare const DatePickerContext: import("react").Context<ContextType>;
interface DateProviderProps {
    props: DatePickerProps;
    children: React.ReactNode | ((props: DateInputProps) => React.ReactNode);
}
export declare const DateProvider: ({ children, props }: DateProviderProps) => JSX.Element;
export declare const useDatePickerContext: () => ContextType;
export {};
//# sourceMappingURL=dateProvider.d.ts.map