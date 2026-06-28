import { Routes, Route } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import UploadPage from "./pages/UploadPage";
import InterviewPage from "./pages/InterviewPage";
import ResearchPage from "./pages/ResearchPage";
import DashboardPage from "./pages/DashboardPage";
import ResumesPage from "./pages/ResumesPage";
import DatasheetPage from "./pages/DatasheetPage";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import SignupPage from "./pages/SignupPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AccountPage from "./pages/AccountPage";
import DemoPage from "./pages/DemoPage";
import DemoUploadPage from "./pages/DemoUploadPage";
import DemoInterviewPage from "./pages/DemoInterviewPage";
import DemoResearchPage from "./pages/DemoResearchPage";
import DemoResultsPage from "./pages/DemoResultsPage";
import DemoResumesPage from "./pages/DemoResumesPage";
import AdminLayout from "./components/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminSubscriptionsPage from "./pages/admin/AdminSubscriptionsPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/resumes" element={<ResumesPage />} />
        <Route path="/datasheet" element={<DatasheetPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/demo/upload" element={<DemoUploadPage />} />
        <Route path="/demo/interview" element={<DemoInterviewPage />} />
        <Route path="/demo/research" element={<DemoResearchPage />} />
        <Route path="/demo/results" element={<DemoResultsPage />} />
        <Route path="/demo/resumes" element={<DemoResumesPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="subscriptions" element={<AdminSubscriptionsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
