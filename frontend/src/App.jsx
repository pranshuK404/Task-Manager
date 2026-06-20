/*** APP.JSX KA KAAM H JB WEBSITE OPEN HO TOH AUTH STATE KO CHECK KARNA 
AND PASS THE CONTROL TO ROUTER **/

import { useEffect } from "react";
import { Loader } from "./components/index";
import { getCurrentUser, refreshAccessToken } from "./services/auth/index";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, stopLoading, logoutSuccess } from "./feature/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router";

function App() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await refreshAccessToken(); // either refresh token or throw error
        const user = await getCurrentUser(); // either get user or throw error
        dispatch(loginSuccess(user)); //dispatch action to store
      } catch (error) {
        toast.error(error.message); // show error message
      } finally {
        dispatch(stopLoading()); // stop loading
      }
    };

    fetchUser();
  }, [dispatch]);

  if (isLoading) return <Loader />;

  return <RouterProvider router={router} />;
}

export default App;
