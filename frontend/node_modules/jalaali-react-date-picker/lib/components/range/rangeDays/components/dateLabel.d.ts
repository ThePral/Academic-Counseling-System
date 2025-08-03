interface DateLabelProps {
    onSelectMonthPicker?: () => void;
    onSelectYearPicker?: () => void;
    onIncreaseMonth: () => void;
    onDecreaseMonth: () => void;
    monthLabel?: string;
    yearLabel?: string;
    shouldResponsive?: boolean;
    isJalaali: boolean;
}
export declare const DateLabel: ({ monthLabel, onSelectMonthPicker, onSelectYearPicker, yearLabel, onDecreaseMonth, onIncreaseMonth, shouldResponsive, isJalaali, }: DateLabelProps) => JSX.Element;
export {};
//# sourceMappingURL=dateLabel.d.ts.map