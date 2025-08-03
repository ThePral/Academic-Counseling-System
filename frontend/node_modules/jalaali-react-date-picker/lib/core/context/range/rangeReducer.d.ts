import { RangeDate } from "../../types/global.types";
export declare enum RangeActionKind {
    DATE = "DATE",
    DAY = "DAY",
    MONTH = "MONTH",
    YEAR = "YEAR",
    MONTH_PLUS = "MONTH_PLUS",
    MONTH_MINUS = "MONTH_MINUS",
    YEAR_PLUS = "YEAR_PLUS",
    YEAR_MINUS = "YEAR_MINUS"
}
export interface RangeAction {
    type: RangeActionKind;
    payload: RangeDate;
}
export declare function rangeReducer(state: RangeDate, action: RangeAction): RangeDate;
//# sourceMappingURL=rangeReducer.d.ts.map