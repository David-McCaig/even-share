import { useEffect } from "react";
import { useNavigate } from "react-router";
import { auth } from "../../../firebase/firebaseconfig";
import { getRedirectResult } from "firebase/auth";

export const useGoogleGetSignInResult = (
  setAuthenticating: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const navigate = useNavigate();
  useEffect(() => {
    
    const handleRedirectSignIn = async () => {
      try {
        setAuthenticating(true);
        const user = await getRedirectResult(auth)
        if(user) {
          navigate('/')
        }
      } catch (err) {
        console.log(err)
      } finally {
        setAuthenticating(false);
      }
    };
    handleRedirectSignIn();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
