import React from "react";
import { useNavigate } from "react-router-dom";
// from-orange-50 via-orange-200 to-orange-300
function LogoText() {
  const navigator = useNavigate();
  return (
    <div className="flex flex-1">
      <div
        onClick={() => {
          navigator("/");
        }}
        className="text-sm md:text-2xl tracking-wide font-mono cursor-pointer"
      >
        <span className="font-bold text-white">{"< "}</span>
        <span className="font-extrabold bg-gradient-to-br    text-transparent from-red-200 via-red-300 to-yellow-200  bg-clip-text drop-shadow-md  ">
          CODE
        </span>
        <span className="font-bold bg-gradient-to-br to-red-200 via-red-300 from-yellow-200   text-transparent bg-clip-text drop-shadow-md ">
          {" "}
          Link
        </span>
        <span className="font-bold text-white">{" />"}</span>
      </div>
    </div>
  );
}

export default LogoText;
