import { Moment } from "moment-jalaali";
import { Date, DateMetadata } from "../core";
/** Check if two date is equals */
declare function checkDates(a: Date | null, b: DateMetadata): boolean;
/** This function checks current date is after selected start date or not */
declare const checkAfter: (start: Date, current: Date, isJalaali: boolean) => boolean;
/** This function checks current date is before selected start date or not */
declare const checkBefore: (end: Date, current: Date, isJalaali: boolean) => boolean;
/** This function checks current date is between selected start date and end date or not */
declare function isBetweenHighlight(day: Date, startDate: Date | null, endDate: Date | null, isJalaali: boolean): boolean;
/** Get current date year */
declare function getCurrentYear(isJalaali?: boolean): number;
/** Get current date month */
declare function getCurrentMonth(isJalaali?: boolean): number;
/** Get current date day */
declare function getCurrentDay(isJalaali?: boolean): number;
declare function getDateYear(date: Moment, isJalaali?: boolean): number;
declare function getDateMonth(date: Moment, isJalaali?: boolean): number;
declare function getDateDay(date: Moment, isJalaali?: boolean): number;
export { checkDates, checkAfter, checkBefore, isBetweenHighlight, getCurrentYear, getCurrentMonth, getCurrentDay, getDateYear, getDateMonth, getDateDay, };
//# sourceMappingURL=momentMethods.d.ts.map