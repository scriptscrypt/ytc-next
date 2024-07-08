import { useEffect } from "react";
import { gapi } from "gapi-script";
import { envYTCLIENTID } from "@/config/envVars";

const useGoogle = () => {

    useEffect(() => {

        const SCOPE = 'https://www.googleapis.com/auth/youtube.force-ssl';
        const handleClientLoad = () => gapi.load('client:auth2', initClient);
    
        const initClient = () => {
            // const discoveryUrl = "TODO: your discoveryUrl here";
            gapi.client.init({
                'clientId': envYTCLIENTID,
                // 'discoveryDocs': [discoveryUrl],
                'scope': SCOPE
            });
            console.log("Google loaded");
        };

        const script = document.createElement('script');

        script.src = "https://apis.google.com/js/api.js";
        script.async = true;
        script.defer = true;
        script.onload = handleClientLoad;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };

    }, []);
};

export default useGoogle;