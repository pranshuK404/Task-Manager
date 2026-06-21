import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const SidebarItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      label: "Tasks",
      path: "/tasks",
    },
    // Add more sidebar items as needed,
  ];

  
  return (
    <div>
      <ul>
        {SidebarItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive ? "text-orange-700" : "text-gray-700"
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
