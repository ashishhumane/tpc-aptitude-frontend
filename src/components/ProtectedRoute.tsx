import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {jwtDecode} from "jwt-decode";

const ProtectedRoute = ({ adminOnly }: { adminOnly: boolean }) => {
  const token = useSelector((state: any) => state.auth.token);
  const user = useSelector((state: any) => state.auth.user);

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  try {
    const decoded = jwtDecode(token) as any;
    const isAdminFromToken = decoded?.isAdmin || decoded?.role === "admin";
    const isAdminFromState = user?.isAdmin === true || user?.role === "admin";

    if (adminOnly && !isAdminFromToken && !isAdminFromState) {
      return <Navigate to="/unauthorized" replace />;
    }
  } catch (error) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
