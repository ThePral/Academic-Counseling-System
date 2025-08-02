import { Date } from "../../types/global.types";
export declare enum DateActionKind {
    DATE = "DATE",
    DAY = "DAY",
    MONTH = "MONTH",
    YEAR = "YEAR",
    MONTH_PLUS = "MONTH_PLUS",
    MONTH_MINUS = "MONTH_MINUS",
    YEAR_PLUS = "YEAR_PLUS",
    YEAR_MINUS = "YEAR_MINUS"
}
export interface DateAction {
    type: DateActionKind;
    payload: Date;
}
export declare function reducer(state: Date, action: DateAction): Date;
//# sourceMappingURL=dateReducer.d.ts.map