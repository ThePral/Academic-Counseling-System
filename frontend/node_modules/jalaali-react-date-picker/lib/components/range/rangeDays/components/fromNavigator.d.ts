interface FromNavigatorProps {
    onDecreaseYear: () => void;
    onDecreaseMonth: () => void;
    isJalaali: boolean;
    shouldResponsive?: boolean;
    type: "from" | "to";
    monthLabel?: string;
    yearLabel?: string;
    onSelectMonthPicker?: () => void;
    onSelectYearPicker?: () => void;
}
export declare const FromNavigator: ({ isJalaali, onDecreaseMonth, onDecreaseYear, type, shouldResponsive, monthLabel, yearLabel, onSelectYearPicker, }: FromNavigatorProps) => JSX.Element;
export {};
//# sourceMappingURL=fromNavigator.d.ts.map