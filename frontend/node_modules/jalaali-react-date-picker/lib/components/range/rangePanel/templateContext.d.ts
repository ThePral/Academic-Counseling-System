/// <reference types="react" />
import { Mode } from "../../../core";
interface RangeTemplateContextType {
    type: "from" | "to";
    onChangeMode?: (mode: Mode) => void;
}
export declare const RangeTemplateContext: import("react").Context<RangeTemplateContextType>;
export declare const useRangeTemplate: () => RangeTemplateContextType;
export {};
//# sourceMappingURL=templateContext.d.ts.map