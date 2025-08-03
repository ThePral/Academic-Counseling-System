export interface HeaderProps {
    lowerDecade: number;
    upperDecade: number;
    onIncreaseDecade: () => void;
    onDecreaseDecade: () => void;
    onYearPress?: (id: number) => void;
}
declare const YearsHeader: ({ lowerDecade, upperDecade, onDecreaseDecade, onIncreaseDecade, onYearPress, }: HeaderProps) => JSX.Element;
export { YearsHeader };
//# sourceMappingURL=header.d.ts.map