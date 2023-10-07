import { Providers } from "../../../firebase/firebaseproviders";
import { getAuth, signInWithRedirect } from "firebase/auth";

export const useGoogleSignIn = (
  setAuthenticating: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
) => {


  const googleSignIn = async () => {
    const auth = getAuth();
    setAuthenticating(true);
  
    try {
      // await auth.signInWithRedirect(Providers.google);
      await signInWithRedirect(auth, Providers)
    } catch (errorMessage) {
      setErrorMessage((errorMessage as Error).message);
    } finally {
      setAuthenticating(false);
    }

  };

  return { googleSignIn } ;
};
