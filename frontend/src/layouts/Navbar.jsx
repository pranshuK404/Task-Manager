import React from "react";
import { Logo } from "../components/index.js";
import { useSelector } from "react-redux";
import AvatarBtn from "../components/AvatarBtn.jsx";

function Navbar() {
  const user = useSelector((state) => state.auth.user);
  return (
    <nav>
      <Logo />
      {user && <AvatarBtn user={user} />}
    </nav>
  );
}

export default Navbar;
