import React from "react";

function Button({ type = "button", children, className = "", ...props }) {
  return (
    <div>
      <button
        type={type}
        className={`px-4 py-2 border rounded-lg ${className}`}
        {...props}
      >
        {children}
      </button>
    </div>
  );
}

export default Button;
