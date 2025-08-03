import { ForwardedRef, Ref } from "react";
import { NavigationIcon, PickerProps as Props } from "../../../core";
interface PanelProps extends Props {
    ref?: Ref<HTMLDivElement>;
    toggle?: () => void;
    navigationIcons?: NavigationIcon;
    presets?: boolean;
}
declare const PanelWithRef: ({ footerRender, headerRender, panelRender, highlightDays, dayLabelRender, onModeChange, toggle, navigationIcons, highlightWeekend, style, className, loading, loadingIndicator, presets, }: PanelProps, ref: ForwardedRef<HTMLDivElement>) => JSX.Element;
export default PanelWithRef;
//# sourceMappingURL=index.d.ts.map