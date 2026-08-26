import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FullPageLoader } from "./ui/Loader";

export const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullPageLoader label="Checking your session..." />;
  if (!session) return <Navigate to="/admin" state={{ from: location.pathname }} replace />;
  return children;
};

/* =========================================================================
   6. SHARED UI PRIMITIVES
   ========================================================================= */
