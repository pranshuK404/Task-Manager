import { useState } from "react";
import { Button, Input } from "../components/index.js";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../feature/authSlice.js";
import { toast } from "react-hot-toast";
import { loginUser } from "../services/auth/index.js";
import { useForm } from "react-hook-form";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const login = async (data) => {
    try {
      const session = await loginUser(data);
      console.log(session); //** WE HAVE TO CHECK RESPONSE WHILE CONNECTING BACKEND

      if (session) {
        dispatch(loginSuccess({ user: session.user }));
        toast.success("Login successful");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(login)}>
        <Input
          label={"Email"} //---HERE KEEP IT CAPITAL , PRODUCTION PRACTICE
          type="email"
          placeholder="Enter email"
          autoFocus={true}
          autoComplete="email"
          {...register("email", {
            //--here email act as identifire defined by you
            required: "Email is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Invalid email",
            },
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        <div>
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            autoComplete="current-password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />

          <button    //**LATER PUT IT INSIDE INPUT COMPONENT
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="px-4 py-2 border rounded-lg"
          >
            {showPassword ? "Hide" : "Show"}
          </button>

          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}

export default LoginPage;
