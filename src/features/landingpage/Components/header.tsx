import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import evenShare from "../../../assets/icons/output-onlinepngtools.png";
import MobileMenu from "./mobilemenu"
import { Button } from "../../../Components/ui/button";

function Header() {

  const location = useLocation();

  const [top, setTop] = useState<boolean>(true);
  // detect whether user has scrolled the page down by 10px
  const scrollHandler = () => {
    window.pageYOffset > 10 ? setTop(false) : setTop(true);
  };

  useEffect(() => {
    scrollHandler();
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [top]);

  return (
    <header
      className={` w-full md:bg-opacity-90 transition duration-300 ease-in-out ${
        !top && location.pathname === "/" ? "sticky top-0 z-20 bg-primary-bg-color backdrop-blur-sm shadow-lg" : "bg-primary-bg-color backdrop-blur-sm"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6 ">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Site branding */}
          <div className="shrink-0 mr-4">
            <Link to="/">
            <img
              className="sm:ml-6 w-20 object-contain lg:ml-4"
              src={evenShare}
              alt="EvenShare Logo"
            />
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex md:grow">
            {/* Desktop sign in links */}
            <ul className="flex grow justify-end flex-wrap items-center">
              <li className="mr-3 ">
              <Link
                  to="/login"
                  className="font-medium  w-36 text-gray-900 hover:text-gray-600 px-5 py-3 flex justify-center items-center transition duration-150 ease-in-out"
                >
                  Log in
                </Link>
              </li>
              <li>
              <Link to="/signup">
                <Button className="w-32 !text-white">
                 Sign Up
                </Button>
                </Link>
              </li>
            </ul>
          </nav>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

export default Header;
