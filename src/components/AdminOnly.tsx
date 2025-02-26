import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

interface AdminOnlyProps {
  children: React.ReactNode;
}

const AdminOnly: React.FC<AdminOnlyProps> = ({ children }) => {
  const token = useSelector((state: any) => state.auth.token);

  if (!token) return null; // Don't render anything if no token

  try {
    const decoded = jwtDecode<{ isAdmin: boolean }>(token);
    console.log(decoded.isAdmin);
    if (!decoded.isAdmin) return null; // Hide content for non-admins
  } catch {
    return null;
  }

  return <>{children}</>; // Render only if admin
};

export default AdminOnly;
