interface ToNavigatorProps {
    onIncreaseYear: () => void;
    onIncreaseMonth: () => void;
    isJalaali: boolean;
    shouldResponsive?: boolean;
    type: "from" | "to";
}
export declare const ToNavigator: ({ isJalaali, onIncreaseMonth, onIncreaseYear, type, shouldResponsive, }: ToNavigatorProps) => JSX.Element | null;
export {};
//# sourceMappingURL=toNavigator.d.ts.map