import { auth } from "../utils/firebaseconfig";
import { useDispatch } from "react-redux";
import { logout } from "../features/authentication/userSlice";

function Home() {

    const dispatch = useDispatch();

    const signOutClick = () => {
        auth
          .signOut()
          .then(() => {
            console.log("Successfully signed out.");
            dispatch(logout());
          })
          .catch((error) => {
            console.error("Error signing out:", error);
          });
      };

  return (
    <div>
        <button onClick={signOutClick}> button </button>
    <div className="" >Home</div>
       
    </div>
  )
}

export default Home