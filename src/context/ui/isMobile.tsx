"use client";
import { createContext, useContext, useEffect, useState } from "react";

const IsMobileContext = createContext(false);

const IsMobileProvider = ({ children }: { children: React.ReactNode }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            const smallScreen = window.matchMedia("(max-width: 768px)").matches;
            const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
            setIsMobile(smallScreen || coarsePointer);
        };

        checkIsMobile();
        window.addEventListener("resize", checkIsMobile);

        return () => {
            window.removeEventListener("resize", checkIsMobile);
        };
    }, []);

    return (
        <IsMobileContext.Provider value={isMobile}>
            {children}
        </IsMobileContext.Provider>
    );
};

export default IsMobileProvider;
export const useIsMobile = () => useContext(IsMobileContext);