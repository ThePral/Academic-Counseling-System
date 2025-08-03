import { MutableRefObject } from "react";
import { Placement } from "../../components/popup";
type ConfigProps = {
    element: MutableRefObject<HTMLDivElement | null>;
    placement?: Placement;
    shouldResponsive?: boolean;
    mode: "date" | "range";
    isJalaali?: boolean;
};
type Coordinate = {
    top: number | undefined;
    left: number | undefined;
    right: number | undefined;
    bottom: number | undefined;
    width: number;
    height: number;
};
type Config = {
    coordinates: Coordinate;
    animationClassName: string | undefined;
};
export declare const useConfig: ({ element, placement, mode, shouldResponsive, isJalaali, }: ConfigProps) => () => Config;
export {};
//# sourceMappingURL=useConfig.d.ts.map