import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../hooks/reduxTypeScriptHooks";
import { login, logout } from "../userSlice";
import { auth } from "../../../firebase/firebaseconfig";

export const useSignedinDispatchUserInfo = () => {
  const dispatch = useAppDispatch();
  const [isInitializing, setIsInitializing] = useState(true);
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
      } else {
        dispatch(logout());
      }
      setIsInitializing(false);
    });
    return () => unsubscribe();
  }, [dispatch]);
  return isInitializing;
};
