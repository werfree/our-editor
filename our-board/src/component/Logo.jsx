import React from "react";

function LogoText() {
  return (
    <div className="flex flex-1">
      <div className="text-xl tracking-wide font-mono ">
        <span className="font-bold text-white">{"< "}</span>
        <span className="font-extrabold bg-gradient-to-br from-orange-50 via-orange-200 to-orange-300 text-transparent bg-clip-text drop-shadow-md">
          CODE
        </span>
        <span className="font-bold bg-gradient-to-br from-orange-300 via-orange-200 to-orange-50 text-transparent bg-clip-text drop-shadow-md">
          {" "}
          Link
        </span>
        <span className="font-bold text-white">{" />"}</span>
      </div>
    </div>
  );
}

export default LogoText;
