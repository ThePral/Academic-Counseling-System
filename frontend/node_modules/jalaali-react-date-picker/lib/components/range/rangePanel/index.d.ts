import { ForwardedRef, Ref } from "react";
import { RangeProps as Props } from "../../../core";
interface RangePanelProps extends Props {
    ref?: Ref<HTMLDivElement>;
    responsive?: "desktop" | "mobile" | "auto";
    shouldResponsive?: boolean;
    onClose?: () => void;
    presets?: boolean;
}
declare const RangePanelWithRef: ({ headerRender, panelRender, highlightDays, dayLabelRender, onModeChange, highlightWeekend, className, style, onClose, responsive, shouldResponsive, loading, loadingIndicator, presets, }: RangePanelProps, ref: ForwardedRef<HTMLDivElement>) => JSX.Element;
export default RangePanelWithRef;
//# sourceMappingURL=index.d.ts.map