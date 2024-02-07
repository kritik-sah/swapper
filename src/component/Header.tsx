import React from "react";
import { Connect } from "./Connect";
import { NetworkSwitcher } from "./NetworkSwitcher";

const Header = () => {
  return (
    <nav className="w-full flex items-center justify-between max-w-screen-xl m-auto py-2">
      <span className="text-highlight text-3xl font-semibold ">SWAPER</span>
      <div className="flex items-center justify-end gap-4">
        <NetworkSwitcher />
        <Connect />
      </div>
    </nav>
  );
};

export default Header;
