import { ReactNode } from "react";
interface CustomWrapperProps {
    children: ReactNode;
    onOpen?: () => void;
    inputRef: React.RefObject<HTMLDivElement>;
}
declare const CustomWrapper: ({ children, onOpen, inputRef }: CustomWrapperProps) => JSX.Element;
export { CustomWrapper };
//# sourceMappingURL=customWrapper.d.ts.map