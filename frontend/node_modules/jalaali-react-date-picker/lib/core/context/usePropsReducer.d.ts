import { DatePickerProps, RangePickerProps } from "../interfaces";
export declare const useDatePropsReducer: () => {
    setLocale: (payload?: DatePickerProps["locale"]) => void;
    setDisabledDates: (payload?: DatePickerProps["disabledDates"]) => void;
    setFormat: (payload?: DatePickerProps["format"]) => void;
    propsState: import("./propsReducer").DatePropsReducerType;
};
export declare const useRangePropsReducer: () => {
    setLocale: (payload?: DatePickerProps["locale"]) => void;
    setRangeDisabledDates: (payload?: RangePickerProps["disabledDates"]) => void;
    setFormat: (payload?: DatePickerProps["format"]) => void;
    propsState: import("./propsReducer").RangePropsReducerType;
};
//# sourceMappingURL=usePropsReducer.d.ts.map