import React from "react";

import { BsFillMoonStarsFill } from "react-icons/bs";

function NavBar() {
  return (
    <>
      <nav className="pt-2 mb-10 dark:text-white sticky top-0">
        <div className="flex backdrop-blur-sm space-x-3 md:space-x-16 bg-stone-100 opacity-80  border-2 border-slate-100  items-center pr-8 pl-8 h-14 dark:bg-black dark:border-2 dark:border-black ">
          <button>About Me</button>
          <button>Projects</button>
          <button>Contact</button>
          <div className="">
            <BsFillMoonStarsFill className=" cursor-pointer text-2xl" />
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
