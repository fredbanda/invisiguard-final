"use client";

import { createContext, useContext} from "react";
import {FpjsProvider, useVisitorData} from "@fingerprintjs/fingerprintjs-pro-react";

const FingerprintContext = createContext<{visitorId?: string}>({});

export const FingerprintProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <FpjsProvider loadOptions={{apiKey: "MBlaJ552Pkp2460xIVIt"}}>
            <FingerprintConsumer>
                {children}
            </FingerprintConsumer>
        </FpjsProvider>
    );
};

const FingerprintConsumer = ({ children }: { children: React.ReactNode }) => {
    const {data} = useVisitorData({extendedResult: true});

    return  <FingerprintContext.Provider value={{visitorId: data?.visitorId}}>
        {children}
    </FingerprintContext.Provider>
};

export const useFingerprint = () => useContext(FingerprintContext)