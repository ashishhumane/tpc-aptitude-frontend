import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Layout/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";

// User Pages
import Dashboard from "@/Pages/User/Dashboard";
import TestPage from "@/Pages/User/TestPage";
import ResultPage from "@/Pages/User/ResultPage";
import TestInterface from "@/Pages/User/TestInterface";
import ResultInterface from "@/Pages/User/ResultInterface";
import Profile from "@/Pages/User/Profile";

// Admin Pages
import AdminDashboard from "@/Pages/Admin/Dashboard";
import CreateTest from "@/Pages/Admin/CreateTest";
import TestManagement from "@/Pages/Admin/TestManagement";
import UserManagement from "@/Pages/Admin/UserManagement";
import Reports from "@/Pages/Admin/Reports";
import Settings from "@/Pages/Admin/Setting";

// Authentication Pages
import Auth from "@/Pages/Auth";
import Error from "./Pages/Error";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <SidebarProvider>
          <AppSidebar />
          <main>
            <SidebarTrigger />
            <Routes>
              {/* Authentication Routes */}
              <Route path="/auth" element={<Auth />} />

              {/* user routes protect them later */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/tests" element={<TestPage />} />
              <Route path="/results" element={<ResultPage />} />
              <Route path="/test/:testId" element={<TestInterface />} />
              <Route path="/result/:testId" element={<ResultInterface />} />
              <Route path="/profile" element={<Profile />} />

              {/* Admin RoutesProtect this routes later */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/create-test" element={<CreateTest />} />
              <Route
                path="/admin/test-management"
                element={<TestManagement />}
              />
              <Route
                path="/admin/user-management"
                element={<UserManagement />}
              />
              <Route path="/admin/reports" element={<Reports />} />
              <Route path="/admin/settings" element={<Settings />} />

              {/* 404 Page */}
              <Route path="*" element={<Error />} />
            </Routes>
          </main>
        </SidebarProvider>
      </Router>
    </ThemeProvider>
  );
}
