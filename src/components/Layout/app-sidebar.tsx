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
  SidebarMenuSubItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { ModeToggle } from "@/components/mode-toggle"; // Import ModeToggle component

import AdminOnly from "../AdminOnly";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/authSlice.ts";

// User Menu Items
const userItems = [
  { title: "Dashboard", url: "/", icon: Home },
  {
    title: "Tests",
    icon: ClipboardList,
    children: [
      { title: "Practice Tests", url: "/tests/practice" },
      { title: "Evaluation Tests", url: "/tests/evaluation" },
    ],
  },
  { title: "Results", url: "/results", icon: FileText },
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
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AppSidebar() {
  const dispatch = useDispatch()
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
            <Link to={item.url || "#"} className="flex items-center">
              <item.icon className="mr-2" />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>

          {/* If the item has sub-items, render SidebarMenuSub */}
          {item.children && (
            <SidebarMenuSub>
              {item.children.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton asChild>
                    <Link to={subItem.url}>
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          )}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  </SidebarGroupContent>
</SidebarGroup>



        <AdminOnly  >
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
        </AdminOnly>
        {/* Admin Pages */}
        
      </SidebarContent>
      <div className="flex justify-center p-2">
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
              <Link
                to="/auth"
                className="flex items-center text-red-500"
                onClick={()=>dispatch(logout())}
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
