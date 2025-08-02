/// <reference types="react" />
import { Mode, NavigationIcon, PickerProps } from "../../../core";
interface PanelModeProps extends Omit<PickerProps, "renderFooter"> {
    toggle?: () => void;
    navigationIcons?: NavigationIcon;
    presets?: boolean;
}
interface PanelModeContext extends PanelModeProps {
    onChangeMode?: (mode: Mode) => void;
}
declare const PanelModeContext: import("react").Context<PanelModeContext>;
declare const PanelMode: ({ toggle, onModeChange, navigationIcons, presets, ...props }: PanelModeProps) => JSX.Element;
export declare const usePanelContext: () => PanelModeContext;
export default PanelMode;
//# sourceMappingURL=panelMode.d.ts.map