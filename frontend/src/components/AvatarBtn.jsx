import { useState, useRef, useEffect } from "react";
import ProfileMenu from "./ProfileMenu";
import { Button } from "../components/index";

function AvatarBtn({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (!isOpen) return;

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative">
      <Button type="button" onClick={() => setIsOpen((prev) => !prev)}>
        <img src={user?.avatar} alt={user?.username} />
      </Button>
      {isOpen && <ProfileMenu className="absolute top-full right-0" />}
    </div>
  );
}

export default AvatarBtn;
