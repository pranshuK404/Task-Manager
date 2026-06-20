import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({children}) => {
  const { isAuthenticated ,user} = useSelector((state) => state.auth);
  
  if(!isAuthenticated || !user) return <Navigate to="/login" />

  return children
};