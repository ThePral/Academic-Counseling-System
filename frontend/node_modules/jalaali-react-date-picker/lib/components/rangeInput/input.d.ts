import React from "react";
type InputBuiltInProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "value">;
interface InputProps extends InputBuiltInProps {
    isRtl: boolean;
    value?: string;
    firstInput?: boolean;
    separator?: React.ReactNode;
    disabled?: boolean;
    onLayout?: (width: number) => void;
}
export declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
export {};
//# sourceMappingURL=input.d.ts.map