import { useNavigate } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../Components/ui/avatar";
import { AlignLeftOutlined } from "@ant-design/icons";
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

export default function NavBar({ showNavBar, setShowNavBar }:NavBarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const openNavClick = () => {
    showNavBar && setShowNavBar(false);
  };

  const closeNavClick = () => {
    !showNavBar && setShowNavBar(true);
  };

  return (
    <nav className="h-16 flex justify-between m-auto sm:px-8  max-w-5xl items-center ">
      <div className="sm:hidden">
     <button
        onClick={openNavClick}
        type="button"
        className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <AlignLeftOutlined className="text-2xl" />
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
        className="mt-4 ml-6 inline-flex items-center text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <AlignLeftOutlined className="text-2xl" />
      </button>
      </aside>
      </div>
      <h1>Split-Bill</h1>
      <div className="flex sm:gap-2">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>David McCaig</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div
                  onClick={handleLogout}
                  className="w-[8.5rem] h-6 cursor-pointer pl-4 "
                >
                  <NavigationMenuLink>Log out</NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}
