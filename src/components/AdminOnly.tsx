import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

interface AdminOnlyProps {
  children: React.ReactNode;
}

const AdminOnly: React.FC<AdminOnlyProps> = ({ children }) => {
  const token = useSelector((state: any) => state.auth.token);
 
 
  if (!token) return null; // Don't render anything if no token

  try {
    const decoded = jwtDecode<{ role: string }>(token);
    console.log("role:", decoded.role);
    if (decoded.role !== "admin") return null; // Hide content for non-admins
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }

  return <>{children}</>; // Render only if admin

};

export default AdminOnly;
