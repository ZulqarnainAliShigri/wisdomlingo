/**
 * WisdomLingo - application shell.
 * Routing only: every page lives in src/pages, shared pieces in src/components.
 */
import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./hooks/useAuth";
import { SeoProvider } from "./hooks/useSeo";
import { CompanyProvider } from "./hooks/useCompany";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ScrollToTop } from "./components/layout/ScrollToTop";
import { SiteLayout } from "./components/layout/SiteLayout";
import { SupabaseKeepAlive } from "./components/SupabaseKeepAlive";

import { HomePage } from "./pages/Home";
import { CoursesPage } from "./pages/Courses";
import { StudyAbroadPage } from "./pages/StudyAbroad";
import { AusbildungPage } from "./pages/Apprenticeships";
import { AboutPage } from "./pages/About";
import { BlogPage } from "./pages/Blog";
import { AdminLoginPage } from "./pages/AdminLogin";
import { AdminDashboardPage } from "./pages/AdminDashboard";
import { NotFoundPage } from "./pages/NotFound";

const withLayout = (page: React.ReactElement) => <SiteLayout>{page}</SiteLayout>;

const App: React.FC = () => (
  <AuthProvider>
    <SeoProvider>
      <CompanyProvider>
        <SupabaseKeepAlive />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={withLayout(<HomePage />)} />
            <Route path="/courses" element={withLayout(<CoursesPage />)} />
            <Route path="/study-abroad" element={withLayout(<StudyAbroadPage />)} />
            <Route path="/ausbildung" element={withLayout(<AusbildungPage />)} />
            <Route path="/apprenticeships" element={<Navigate to="/ausbildung" replace />} />
            <Route path="/blog" element={withLayout(<BlogPage />)} />
            <Route path="/about" element={withLayout(<AboutPage />)} />
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={withLayout(<NotFoundPage />)} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={4000}
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="light"
          />
        </BrowserRouter>
      </CompanyProvider>
    </SeoProvider>
  </AuthProvider>
);

export default App;
