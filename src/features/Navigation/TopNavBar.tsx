import { useNavigate } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../Components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "../../Components/ui/navigation-menu";

export default function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {

      navigate('/')
  }

  return (
    <nav className=" h-16 flex justify-between m-auto px-8 items-center sm:px-8  max-w-3xl ">
      <h1>Split-Bill</h1>
      <div className="flex gap-4">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>David McCaig</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div onClick={handleLogout} className="w-[8.5rem] h-6 cursor-pointer pl-4 " >
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
