import { useId } from "react";

function Input({ label, type = "text", className = "", ...props }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        className={`w-full border p-2 ${className}`}
        {...props}
      />
    </div>
  );
}

export default Input;
