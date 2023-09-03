// hooks/useSignInEmailPassword.tsx
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch } from "../../../hooks/reduxTypeScriptHooks";
import { login } from "../userSlice";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// Custom hook for signing in with email and password
export const useSignUpEmailPassword = (
  setAuthenticating: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const dispatch = useAppDispatch();
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>(""); // Move the state hook inside this custom hook
  const navigate = useNavigate();
  const signUpEmailPassword = async (values: {
    email: string;
    password: string;
  }) => {
    try {
      setAuthenticating(true)
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password)
      const user = userCredential.user;
      dispatch(login({
        email: user?.email,
        displayName: user?.displayName
      }));
      // await auth.createUserWithEmailAndPassword(values.email, values.password);
      navigate("/setprofile");
    } catch (error) {
      const errorCode = (error as { code?: string })?.code;
      const errorMessage = (error as { message?: string })?.message;
      setAuthenticating(false)
      setPasswordErrorMessage(errorMessage ?? "An error occured");
      console.log(errorCode);
    }
  };

  return { passwordErrorMessage, signUpEmailPassword }; // Return the function instead of just the error message
};
