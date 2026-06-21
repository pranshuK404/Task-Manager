import { useState } from "react";
import { Button } from "../components/index.js";
import { logoutUser } from "../services/auth/index.js";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "../feature/authSlice.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function ProfileMenu({ className = "" }) {
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleLogout() {
    setSubmitting(true);
    try {
      await logoutUser();
      dispatch(logoutSuccess());
      toast.success("Logout successful");
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={className}>
      <Button onClick={() => navigate("/profile")}>Profile</Button>
      <Button onClick={() => navigate("/settings")}>Settings</Button>
      <Button disabled={submitting} onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}

export default ProfileMenu;
