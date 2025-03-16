import React from "react";
import { Dropdown } from "flowbite";
function FLowDropDown() {
  useEffect(() => {
    const dropdownButton = document.getElementById("dropdownDelayButton");
    const dropdownMenu = document.getElementById("dropdownDelay");

    if (dropdownButton && dropdownMenu) {
      new Dropdown(dropdownMenu, dropdownButton);
    }
  }, []);
  return <div>DropDown</div>;
}

export default FLowDropDown;
