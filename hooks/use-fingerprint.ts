import { useEffect, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs-pro";

const useFingerprint = () => {
    const [fingerprint, setFingerprint] = useState<string | null>(null);

    useEffect(() => {
        const loadFingerprint = async () => {
            try {
                const fp = await FingerprintJS.load({
                    apiKey: "UAqJTAVVqaHNrhzSsgkU",
                });

                const result = await fp.get();
                setFingerprint(result.visitorId);
            } catch (error) {
                console.log("Error loading fingerprint:", error);
                
            }
        }
        loadFingerprint();
    }, []);
    return fingerprint;
}

export default useFingerprint;