import { PickerProps } from "../../core";
interface DayLabelProps extends Pick<PickerProps, "dayLabelRender"> {
    dayLabels: string[];
    isJalaali: boolean;
}
export declare const DayLabel: ({ dayLabelRender, dayLabels, isJalaali, }: DayLabelProps) => JSX.Element;
export {};
//# sourceMappingURL=index.d.ts.map