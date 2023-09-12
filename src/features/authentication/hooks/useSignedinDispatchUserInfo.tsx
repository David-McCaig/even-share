import { useEffect } from "react";
import { useAppDispatch } from "../../../hooks/reduxTypeScriptHooks";
import { login } from "../userSlice";
import { auth } from "../../../utils/firebaseconfig";

export const useSignedinDispatchUserInfo = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(
          login({
            email: user?.email,
            displayName: user?.displayName || null,
            photoUrl: user?.photoURL,
            userId: user?.uid,
          })
        );
      }
    });
    return () => unsubscribe();
  }, []);
};
