import { MouseEvent } from "react";
interface IconProps {
    size?: number;
    onClick?: (e?: MouseEvent<HTMLDivElement>) => void;
    isJalaali?: boolean;
    hoverEffect?: boolean;
}
declare const Icon: {
    (): null;
    Forward: ({ size, onClick }: IconProps) => JSX.Element;
    Calendar: ({ size, onClick }: IconProps) => JSX.Element;
    Back: ({ size, onClick }: IconProps) => JSX.Element;
    DoubleChevronRight: ({ size, onClick, hoverEffect }: IconProps) => JSX.Element;
    DoubleChevronLeft: ({ size, onClick, hoverEffect }: IconProps) => JSX.Element;
    Clear: ({ size, onClick }: IconProps) => JSX.Element;
    ChevronRight: ({ size, onClick, hoverEffect }: IconProps) => JSX.Element;
    ChevronLeft: ({ size, onClick, hoverEffect }: IconProps) => JSX.Element;
    CalendarToday: ({ size, onClick }: IconProps) => JSX.Element;
    Chevron: ({ size, onClick, isJalaali, hoverEffect }: IconProps) => JSX.Element;
    DoubleChevron: ({ size, onClick, isJalaali, hoverEffect, }: IconProps) => JSX.Element;
    Dropdown: ({ size, onClick, hoverEffect }: IconProps) => JSX.Element;
    Error: ({ size, onClick, hoverEffect }: IconProps) => JSX.Element;
};
export { Icon };
//# sourceMappingURL=index.d.ts.map