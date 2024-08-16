import useGoogle from "@/hooks/useGoogle";
import { gapi } from "gapi-script";

export const useGoogleAuth = () => {
  useGoogle();
  const authenticateWithGoogle = async () => {
    await gapi.auth2
      .getAuthInstance()
      .signIn()
      .then(() => {
        console.log(
          "Sign-in successful",
          gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse()
            .access_token
        );

        localStorage.setItem(
          "access_token",
          JSON.stringify(
            `${
              gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse()
                .access_token
            }`
          )
        );
      })
      .catch((err: any) => console.error("Error signing in", err));
  };

  return { authenticateWithGoogle };
};
