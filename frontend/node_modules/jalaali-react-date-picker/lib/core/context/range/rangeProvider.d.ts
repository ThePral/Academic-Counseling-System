import React, { ChangeEvent } from "react";
import { RangePickerProps } from "../../interfaces";
import { Date, RangeDate, RangeValue } from "../../types/global.types";
import { RangePropsReducerType } from "../propsReducer";
interface RangeInputProps {
    values: [string, string];
    placeholderFrom: string;
    placeholderTo: string;
    isJalaali?: boolean;
    onClear?: () => void;
    onChangeInputRange?: (e: ChangeEvent<HTMLInputElement>, isStartDate: boolean) => void;
}
interface ContextType extends RangePropsReducerType {
    rangeState: RangeDate;
    cacheRangeDate?: RangeDate;
    dateRange: RangeValue | null;
    onRangeDateChange: (payload: RangeDate) => void;
    onRangeDaychange: (payload: Date, isStartDate: boolean) => void;
    onRangeMonthchange: (month: number, mode: "from" | "to") => void;
    onRangeYearchange: (year: number, mode: "from" | "to") => void;
    onRangeIncreaseYear: () => void;
    onRangeDecreaseYear: () => void;
    onRangeIncreaseMonth: () => void;
    onRangeDecreaseMonth: () => void;
    changeFrom: (date: Partial<Date>) => void;
    changeTo: (date: Partial<Date>) => void;
    changePlaceholder: (date: Date | null) => void;
    from: Date;
    to: Date;
    offsets: [number, number];
    setOffsets: (offsets: [number, number]) => void;
}
export declare const RangePickerContext: React.Context<ContextType>;
interface RangeProviderProps {
    children: React.ReactNode | ((props: RangeInputProps) => React.ReactNode);
    props: RangePickerProps;
}
export declare const RangeProvider: ({ children, props }: RangeProviderProps) => JSX.Element;
export declare const useRangePickerContext: () => ContextType;
export {};
//# sourceMappingURL=rangeProvider.d.ts.map