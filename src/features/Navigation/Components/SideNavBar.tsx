import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../hooks/reduxTypeScriptHooks";
import { useFetchUserGroupsQuery } from "../../groupexpense/groupexpenseTableSlice";
import { useNavigateHome } from "./hooks/useNavigateHome";
import { selectUser } from "../../authentication/userSlice";
import  menuToggle  from "../../../assets/icons/expenseicons/menu-outline.svg";
import CreateGroupModal from "./CreateGroupModal";
import {
  DashboardIcon,
  ActivityLogIcon,
  GroupIcon,
  PersonIcon
} from "@radix-ui/react-icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../Components/ui/accordion";

type NavBarProps = {
  showNavBar: boolean;
  setShowNavBar: (value: boolean) => void;
};

function NavBar({ showNavBar, setShowNavBar }: NavBarProps) {
  const [activeLink, setActiveLink] = useState("/");

  const userInfo = useAppSelector(selectUser);
  const userEmail = userInfo?.email;
  const { data } = useFetchUserGroupsQuery(userEmail);

  const location = useLocation()?.pathname

  const closeNavClick = () => {
    !showNavBar && setShowNavBar(true);
  };
  //navigate back to home page when user clicks evenShare logo
  useNavigateHome(location,setActiveLink)

  return (
    <nav className="z-40">
      <div className="sticky top-24 sm:top-0">
        <aside
          className={
            showNavBar
              ? `fixed top-16 sm:static left-0 w-64 rounded-medium  transition-transform -translate-x-full sm:translate-x-0  `
              : "fixed top-0 left-0 sm:static w-64 h-screen transition-transform  sm:translate-x-0"
          }
        >
          <div className="bg-primary-bg-color  h-screen pt-2 overflow-y-auto dark:bg-gray-800 rounded-xl shadow-lg sm:pt-0">
            <ul className="space-y-2 font-medium">
            <img src={menuToggle} onClick={closeNavClick} className="w-12 h-12 ml-1 sm:hidden"/>
              <li></li>
              <li>
                <Link
                  className={`flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${activeLink === "/" ? "text-primary-button-color" : "text-primary-font-color"}`}
                  to={"/"}
                >
                  <DashboardIcon className="w-6 h-6 " />
                  <span className="ml-3 text-2xl">Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  className={`flex items-center p-2  rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${activeLink === "/recentactivity" ? "text-primary-button-color" : ""}`}
                  onClick={() => setActiveLink("/recentactivity")}
                  to={"/recentactivity"}
                >
                  <ActivityLogIcon className="w-6 h-6" />
                  <span className="flex-1 ml-3 whitespace-nowrap text-2xl">
                    Recent Activity
                  </span>
                </Link>
              </li>
              <li>
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      <GroupIcon className="w-7 h-7 mr-2" /> Group{" "}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="text-lg">
                        <CreateGroupModal />
                      </div>
                      {data?.map((group) => (
                        <div key={group.id}>
                          <Link 
                          className={`${activeLink === "/group/" + group.id ? "text-primary-button-color" : ""}`}
                          to={"/group/" + group.id}
                          onClick={() => setActiveLink("/group/" + group.id)}
                          >
                            {group.user_group_name}
                          </Link>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </li>
              <li>
                <Link 
                className={`flex items-center p-2  rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${activeLink === "/profile" ? "text-primary-button-color" : "text-primary-font-color"}`}
                to={"/profile"}
                onClick={() => setActiveLink("/profile")}
                >
                <PersonIcon className="w-6 h-6" />
                  <span className="flex-1 ml-3 whitespace-nowrap mt-1 text-2xl">
                    Profile
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </nav>
  );
}

export default NavBar;
