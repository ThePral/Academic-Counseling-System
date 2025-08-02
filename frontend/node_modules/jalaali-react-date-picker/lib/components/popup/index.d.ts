import React, { ReactNode } from "react";
export type Placement = "bottom" | "top" | "right" | "left";
export type Responsive = "desktop" | "mobile" | "auto";
interface PopupProps {
    children: ReactNode;
    placement?: Placement;
    isOpen?: boolean;
    panel: (shouldResponsive?: boolean) => ReactNode;
    mode: "date" | "range";
    getContainer?: HTMLElement | (() => HTMLElement) | string;
    close: () => void;
    toggleAnimate: (animate: boolean) => void;
    animate: boolean;
    inputRef: React.RefObject<HTMLDivElement>;
    responsive?: Responsive;
    isJalaali?: boolean;
}
declare const Popup: React.MemoExoticComponent<({ children, placement, close, animate, toggleAnimate, isOpen, panel, mode, getContainer, inputRef, responsive, isJalaali, }: PopupProps) => JSX.Element>;
export default Popup;
//# sourceMappingURL=index.d.ts.map