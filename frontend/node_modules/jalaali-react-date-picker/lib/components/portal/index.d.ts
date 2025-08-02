import { ReactNode } from "react";
interface PortalProps {
    children: ReactNode;
    getContainer?: HTMLElement | (() => HTMLElement) | string;
}
declare const Portal: ({ children, getContainer }: PortalProps) => import("react").ReactPortal | null;
export { Portal };
//# sourceMappingURL=index.d.ts.map