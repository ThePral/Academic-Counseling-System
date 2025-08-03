import { Date, RangeDate } from "../../types/global.types";
declare function nextDate(date: Date | null, state: RangeDate): Date | null;
declare function nextMonth(date: Date | null, state: RangeDate): Date | null;
declare function nextMonthDecrease(date: Date | null, state: RangeDate): Date | null;
declare function nextMonthIncrease(date: Date | null, state: RangeDate): Date | null;
declare function nextYear(date: Date | null, state: RangeDate): Date | null;
declare function nextYearDecrease(date: Date | null, state: RangeDate): Date | null;
declare function nextYearIncrease(date: Date | null, state: RangeDate): Date | null;
declare function nextCacheDay(payload: RangeDate, cache: RangeDate): Date | null;
declare function nextCacheMonthIncrease(payload: RangeDate, cache: RangeDate): Date | null;
declare function nextCacheMonthDecrease(payload: RangeDate, cache: RangeDate): Date | null;
export { nextDate, nextMonth, nextMonthDecrease, nextMonthIncrease, nextYear, nextYearDecrease, nextYearIncrease, nextCacheDay, nextCacheMonthIncrease, nextCacheMonthDecrease, };
//# sourceMappingURL=rangeNextDate.d.ts.map