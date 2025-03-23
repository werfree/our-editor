import React from "react";

function HeaderButton({ action = () => {}, children = <></> }) {
  return (
    <button
      onClick={action}
      className="relative inline-flex items-center justify-center p-0.5 md:me-1 overflow-hidden text-sm font-medium  rounded-lg group bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 text-white dark:hover:text-gray-900  dark:focus:ring-red-400"
    >
      <span className="relative px-1 py-0.5  md:px-3  md:py-1.5 transition-all ease-in duration-75 bg-[#1E1E1E] rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent text-xs md font-bold tracking-tighter md:tracking-wider">
        {children}
      </span>
    </button>
  );
}

export default HeaderButton;
