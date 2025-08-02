import { PickerProps } from "../../core";
interface FooterProps extends Pick<PickerProps, "footerRender"> {
    toggle?: () => void;
}
export declare const Footer: ({ footerRender, toggle }: FooterProps) => JSX.Element;
export {};
//# sourceMappingURL=index.d.ts.map