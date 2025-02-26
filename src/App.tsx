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
import Settings from "@/Pages/Admin/Setting";

// Authentication Pages
import Auth from "@/Pages/Auth";
import Error from "./Pages/Error";
import { Toaster } from "@/components/ui/sonner";
import ProtectedRoute from "./components/ProtectedRoute";
import Reports from "./Pages/Admin/Reports";
import EvaluationPage from "./Pages/User/EvaluationPage";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <SidebarProvider>
          <Routes>
            {/* Authentication Routes (No Sidebar) */}
            <Route path="/auth" element={<Auth />} />

            {/* Protected User Routes (With Sidebar) */}
            <Route element={<ProtectedRoute adminOnly={false} />}>
              <Route
                element={
                  <>
                    <AppSidebar />
                    <SidebarTrigger />
                  </>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tests/practice" element={<TestPage />} />
                <Route path="/tests/evaluation" element={<EvaluationPage />} />
                <Route path="/results" element={<ResultPage />} />
                <Route path="/test/:testId" element={<TestInterface />} />
                <Route path="/result/:testId" element={<ResultInterface />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Route>

            {/* Protected Admin Routes (With Sidebar) */}
            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route
                element={
                  <>
                    <AppSidebar />
                    <SidebarTrigger />
                  </>
                }
              >
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
              </Route>
            </Route>

            {/* 404 Page (No Sidebar) */}
            <Route path="*" element={<Error />} />
          </Routes>
          <Toaster />
        </SidebarProvider>
      </Router>
    </ThemeProvider>
  );
}
