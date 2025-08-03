interface DayProps {
    day: number;
    startDay?: number;
    endDay?: number;
    isSelected?: boolean;
    isWeekend?: boolean;
    isDisabled?: boolean;
    isHighlight?: boolean;
    isNotCurrentMonth?: boolean;
    isToday?: boolean;
    isNeighborsDisabled?: boolean;
    mode?: "date" | "range";
    isJalaali?: boolean;
    onPress?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}
declare const Day: ({ day, isDisabled, isSelected, isWeekend, onPress, isHighlight, isNotCurrentMonth, isToday, onMouseEnter, onMouseLeave, mode, endDay, startDay, isJalaali, }: DayProps) => JSX.Element;
export default Day;
//# sourceMappingURL=index.d.ts.map