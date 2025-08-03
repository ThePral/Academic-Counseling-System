interface HeaderSideProps {
    isJalaali: boolean;
    onDecreaseYear: () => void;
    onIncreaseYear: () => void;
    onDecreaseMonth: () => void;
    onIncreaseMonth: () => void;
    onSelectMonthPicker?: () => void;
    onSelectYearPicker?: () => void;
    monthLabel?: string;
    yearLabel?: string;
    shouldResponsive?: boolean;
}
declare const HeaderSide: ({ isJalaali, onDecreaseYear, onIncreaseYear, onDecreaseMonth, onIncreaseMonth, onSelectMonthPicker, onSelectYearPicker, monthLabel, yearLabel, shouldResponsive, }: HeaderSideProps) => JSX.Element;
export { HeaderSide };
//# sourceMappingURL=side.d.ts.map