import { Date, DateMetadata } from "../../../core";
interface RangeDayPanelProps {
    days: DateMetadata[];
    selectedRange: {
        startDate: Date | null;
        endDate: Date | null;
    };
    onSelect: (date: DateMetadata) => void;
}
export declare const RangeDayPanel: ({ days, onSelect, selectedRange, }: RangeDayPanelProps) => JSX.Element;
export {};
//# sourceMappingURL=rangeDayPanel.d.ts.map