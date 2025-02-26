import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {jwtDecode} from "jwt-decode";

const ProtectedRoute = ({ adminOnly, children }:{adminOnly:any, children:any}) => {
  const token = useSelector((state:any) => state.auth.token);

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  try {
    const decoded = jwtDecode(token) as any;
    if (adminOnly && !decoded.isAdmin) {
      return <Navigate to="/unauthorized" replace />;
    }
  } catch (error) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
