import { useNavigate } from "react-router-dom";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../hooks/reduxTypeScriptHooks";
import { selectUser } from "../../authentication/userSlice";
import { logout } from "../../authentication/userSlice";
import { auth } from "../../../firebase/firebaseconfig";
import  menuToggle  from "../../../assets/icons/expenseicons/menu-outline.svg";
import evenShareLogo from "../../../assets/icons/output-onlinepngtools.png";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../Components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../../../Components/ui/navigation-menu";

type NavBarProps = {
  showNavBar: boolean;
  setShowNavBar: (value: boolean) => void;
};

export default function NavBar({ showNavBar, setShowNavBar }: NavBarProps) {
  const navigate = useNavigate();

  const firstLetterDisplayName = useAppSelector(selectUser)
    ?.email.slice(0, 1)
    .toUpperCase();
  const displayName = useAppSelector(selectUser)?.displayName;
  const userDisplayImage = useAppSelector(selectUser)?.photoUrl;

  const dispatch = useAppDispatch();

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        console.log("Successfully signed out.");
        dispatch(logout());
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  const openNavClick = () => {
    showNavBar && setShowNavBar(false);
  };

  const closeNavClick = () => {
    !showNavBar && setShowNavBar(true);
  };

  return (
    <nav className="h-16 flex justify-between m-auto  max-w-5xl items-center">
      <div className="sm:hidden">
        <button
          onClick={openNavClick}
          type="button"
          className="inline-flex items-center p-2  text-sm  rounded-lg sm:hidden"
        >
          <span className="sr-only">Open sidebar</span>
        <img src={menuToggle} className="w-12 h-12" alt="Open menu"  />
        </button>
        <aside
          className={
            showNavBar
              ? `fixed top-16 sm:static left-0 z-40 w-64 rounded-medium  transition-transform -translate-x-full sm:translate-x-0  `
              : "fixed top-0 left-0 sm:static z-40 w-64 h-screen transition-transform  sm:translate-x-0"
          }
        >
          <button
            onClick={closeNavClick}
            type="button"
            className="inline-flex items-center p-2 text-sm  rounded-lg sm:hidden"          >
            <span className="sr-only">Open sidebar</span>
            <img src={menuToggle} className="w-12 h-12" alt="Close menu"  />
          </button>
        </aside>
      </div>
      <img
        src={evenShareLogo}
        className="sm:ml-6 w-20 object-contain lg:ml-4"
      />
      <div className="flex sm:gap-2 bg-primary-bg-color">
        <Avatar>
          <AvatarImage src={userDisplayImage} />
          <AvatarFallback>{firstLetterDisplayName}</AvatarFallback>
        </Avatar>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger
                onPointerMove={(event) => event.preventDefault()}
                onPointerLeave={(event) => event.preventDefault()}
                className="bg-primary-bg-color"
              >
                {displayName}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div
                  onClick={handleLogout}
                  className="md:pt-2"
                >
                  <NavigationMenuLink className="md:px-4 cursor-pointer">Logout</NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}
