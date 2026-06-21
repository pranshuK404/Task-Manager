import React from "react";
import { Button } from "../components/index.js";

import { useNavigate } from "react-router-dom";

function ProfileMenu({className=""}) {
  const navigate = useNavigate();
  return (
    <div className={className}>
      <Button onClick={() => navigate("/profile")}>Profile</Button>
      <Button onClick={() => navigate("/settings")}>Settings</Button>
      <Button onClick={() => navigate("/logout")}>Logout</Button>
    </div>
  );
}

export default ProfileMenu;
