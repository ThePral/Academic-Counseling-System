import { DatePickerProps, RangePickerProps } from "../interfaces";
export type DatePropsReducerType = Pick<DatePickerProps, "locale" | "onChange" | "value" | "disabledDates" | "format"> & {
    format?: string;
};
export type RangePropsReducerType = Pick<RangePickerProps, "locale" | "onChange" | "value" | "disabledDates" | "format"> & {
    format?: string;
};
export declare enum PropsActionKind {
    LOCALE = "LOCALE",
    ONCHANGE = "ONCHANGE",
    RANGEONCHANGE = "RANGEONCHANGE",
    VALUE = "VALUE",
    RANGEVALUE = "RANGEVALUE",
    DISABLEDDATES = "DISABLEDDATES",
    FORMAT = "FORMAT"
}
export interface Action {
    type: PropsActionKind;
    payload?: any;
}
export declare function datePropsReducer(state: DatePropsReducerType, action: Action): DatePropsReducerType;
export declare function rangePropsReducer(state: RangePropsReducerType, action: Action): RangePropsReducerType;
//# sourceMappingURL=propsReducer.d.ts.map