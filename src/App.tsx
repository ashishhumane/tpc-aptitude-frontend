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
import ResultManage from "@/Pages/Admin/ResultManage";
import Settings from "@/Pages/Admin/Setting";
import QualifiedStudent from "@/Pages/Admin/QualifyStudents.tsx"
//hello
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
            {/* Authentication Route (No Sidebar) */}
            <Route path="/auth" element={<Auth />} />

            {/* Protected User Routes (With Sidebar) */}
            <Route>
              <Route path="/" element={<LayoutWithSidebar />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tests/practice" element={<TestPage />} />
                <Route path="/tests/evaluation" element={<EvaluationPage />} />
                <Route path="/results" element={<ResultPage />} />
                <Route path="/result/:testId" element={<ResultInterface />} />
                <Route path="/profile" element={<Profile />} />
                <Route
                  path="/practice-result/:testId"
                  element={<PracResultInterface />}
                />
              </Route>
              <Route path="/test/:testId" element={<TestInterface />} />
            </Route>

            {/* Protected Admin Routes (With Sidebar) */}
            <Route>
              <Route path="/admin" element={<LayoutWithSidebar />}>
                <Route index element={<AdminDashboard />} />
                <Route path="create-test" element={<CreateTest />} />
                <Route path="test-management" element={<TestManagement />} />
                <Route path="user-management" element={<UserManagement />} />
                <Route path="result-manage" element={<ResultManage />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
                <Route path="qualified" element={<QualifiedStudent />} />
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

/* ✅ Extracted Layout with Sidebar */
import { Outlet } from "react-router-dom";
import PracResultInterface from "./Pages/User/PracResultInterface";
function LayoutWithSidebar() {
  return (
    <>
      <AppSidebar />
      <SidebarTrigger />
      <Outlet />
    </>
  );
}
