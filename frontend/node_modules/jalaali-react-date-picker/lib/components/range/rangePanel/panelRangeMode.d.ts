/// <reference types="react" />
import { Mode, RangeProps } from "../../../core";
interface RangePanelModeProps extends RangeProps {
    children: JSX.Element | JSX.Element[] | null;
    shouldResponsive?: boolean;
    presets?: boolean;
}
interface RangePanelModeContext extends RangePanelModeProps {
    onChangeMode?: (mode: Mode) => void;
    onClose?: () => void;
}
declare const RangePanelModeContext: import("react").Context<Omit<RangePanelModeContext, "children">>;
declare const RangePanelMode: import("react").MemoExoticComponent<({ children, ...props }: RangePanelModeProps) => JSX.Element>;
export declare const useRangePanelContext: () => Omit<RangePanelModeContext, "children">;
export default RangePanelMode;
//# sourceMappingURL=panelRangeMode.d.ts.map