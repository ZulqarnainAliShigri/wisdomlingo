/**
 * WisdomLingo - application shell.
 * Routing only: every page lives in src/pages, shared pieces in src/components.
 */
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./hooks/useAuth";
import { SeoProvider } from "./hooks/useSeo";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ScrollToTop } from "./components/layout/ScrollToTop";
import { SiteLayout } from "./components/layout/SiteLayout";

import { HomePage } from "./pages/Home";
import { CoursesPage } from "./pages/Courses";
import { StudyAbroadPage } from "./pages/StudyAbroad";
import { ApprenticeshipsPage } from "./pages/Apprenticeships";
import { AboutPage } from "./pages/About";
import { AdminLoginPage } from "./pages/AdminLogin";
import { AdminDashboardPage } from "./pages/AdminDashboard";
import { NotFoundPage } from "./pages/NotFound";

const withLayout = (page: React.ReactElement) => <SiteLayout>{page}</SiteLayout>;

const App: React.FC = () => (
  <AuthProvider>
    <SeoProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={withLayout(<HomePage />)} />
          <Route path="/courses" element={withLayout(<CoursesPage />)} />
          <Route path="/study-abroad" element={withLayout(<StudyAbroadPage />)} />
          <Route path="/apprenticeships" element={withLayout(<ApprenticeshipsPage />)} />
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
    </SeoProvider>
  </AuthProvider>
);

export default App;
