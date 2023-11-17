import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import evenShare from "../../../assets/icons/output-onlinepngtools.png";
import MobileMenu from "./mobile-menu";
import { Button } from "../../../Components/ui/button";

export default function Header() {

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
      className={` w-full z-30 md:bg-opacity-90 transition duration-300 ease-in-out ${
        !top && location.pathname === "/" ? "sticky top-0 bg-primary-bg-color backdrop-blur-sm shadow-lg" : "bg-primary-bg-color backdrop-blur-sm"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
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
              <li className="mr-3">
                <Button className="w-32 bg-primary-bg-color text-black hover:bg-primary-bg-color hover:text-slate-600 ">
                  <Link to="/login">Log In</Link>
                </Button>
              </li>
              <li>
                <Button className="w-32">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </li>
            </ul>
          </nav>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
