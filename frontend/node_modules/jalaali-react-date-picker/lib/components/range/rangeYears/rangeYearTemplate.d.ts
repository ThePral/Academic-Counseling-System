import { Mode, Year } from "../../../core";
interface RangeYearTemplatePanelProps {
    onChangeMode?: (mode: Mode) => void;
    years: Year[];
    lowerDecade: number;
    upperDecade: number;
    onSelect: (year: number) => void;
    onDecreaseDecade: () => void;
    onIncreaseDecade: () => void;
}
export declare const RangeYeartemplate: ({ years, onChangeMode, lowerDecade, upperDecade, onSelect, onDecreaseDecade, onIncreaseDecade, }: RangeYearTemplatePanelProps) => JSX.Element;
export {};
//# sourceMappingURL=rangeYearTemplate.d.ts.map