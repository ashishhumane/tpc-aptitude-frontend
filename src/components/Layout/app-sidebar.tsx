import { Link } from "react-router-dom";
import {
  Home,
  ClipboardList,
  FileText,
  Users,
  Settings,
  PlusSquare,
  BarChart,
  User,
  LogIn,
  LogOut,
  UserPlus,
  ChevronDown,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { ModeToggle } from "@/components/mode-toggle"; // Import ModeToggle component
import ProtectedRoute from "../ProtectedRoute";

// User Menu Items
const userItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Tests", url: "/tests", icon: ClipboardList },
  { title: "Results", url: "/results", icon: FileText },
  { title: "Profile", url: "/profile", icon: User },
];

// Admin Menu Items
const adminItems = [
  { title: "Admin Dashboard", url: "/admin", icon: Home },
  { title: "Create Test", url: "/admin/create-test", icon: PlusSquare },
  {
    title: "Test Management",
    url: "/admin/test-management",
    icon: ClipboardList,
  },
  { title: "User Management", url: "/admin/user-management", icon: Users },
  { title: "Reports", url: "/admin/reports", icon: BarChart },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        {/* User Pages */}
        <SidebarGroup>
          <SidebarGroupLabel>User Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <ProtectedRoute isAdmin={true}>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        </ProtectedRoute>
        {/* Admin Pages */}
        
      </SidebarContent>
      <div className="flex justify-start">
        <ModeToggle />
      </div>

      {/* Sidebar Footer - Authentication Section */}
      <SidebarFooter className="p-2 border-t border-gray-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="w-full flex items-center justify-between">
              <User className="mr-2" />
              Username
              <ChevronDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="center" className="w-full">
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex items-center">
                <User className="mr-2" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/auth?type=login" className="flex items-center">
                <LogIn className="mr-2" />
                Login
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/auth?type=signup" className="flex items-center">
                <UserPlus className="mr-2" />
                Signup
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                to="/auth?type=logout"
                className="flex items-center text-red-500"
              >
                <LogOut className="mr-2" />
                Logout
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
