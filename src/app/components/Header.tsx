import React from "react";
import { UserButton } from "@clerk/nextjs";

const Header = () => {
  return (
    <div>
      <h1>Header</h1>
      <UserButton />
    </div>
  );
};

export default Header;
