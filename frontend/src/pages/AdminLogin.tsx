import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, ChevronRight, Lock } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import { ADMIN_EMAIL, isSupabaseConfigured } from "../lib/supabase";
import { emailPattern, errorMessage } from "../lib/utils";
import { Logo } from "../components/layout/Logo";
import { Spinner } from "../components/ui/Loader";

export const AdminLoginPage: React.FC = () => {
  const { signIn, session, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && session) navigate("/admin/dashboard", { replace: true });
  }, [session, loading, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!emailPattern.test(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
      toast.success("Welcome back!");
      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      toast.error(errorMessage(error, "Login failed. Check your credentials and try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 flex justify-center">
            <Logo />
          </Link>

          <div className="rounded-2xl bg-white p-7 shadow-xl sm:p-9">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
                <Lock className="h-5 w-5" />
              </span>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900">Admin Login</h1>
                <p className="text-sm text-slate-500">Manage courses and site content</p>
              </div>
            </div>

            {!isSupabaseConfigured && (
              <div className="mb-5 flex gap-3 rounded-xl bg-amber-50 p-4 text-xs text-amber-900">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <p>
                  Supabase is not configured. Add <code>REACT_APP_SUPABASE_URL</code> and{" "}
                  <code>REACT_APP_SUPABASE_ANON_KEY</code> to your environment, then restart.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label className="label" htmlFor="admin-email">
                  Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  className="input"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={ADMIN_EMAIL}
                  autoComplete="username"
                  required
                />
              </div>

              <div>
                <label className="label" htmlFor="admin-password">
                  Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  className="input"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
              </div>

              <button type="submit" className="btn-primary w-full" disabled={submitting}>
                {submitting ? <Spinner /> : <Lock className="h-4 w-4" />}
                {submitting ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-400">
              Authorised personnel only. All actions are logged.
            </p>
          </div>

          <Link
            to="/"
            className="mt-6 flex items-center justify-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-primary"
          >
            <ChevronRight className="h-4 w-4 rotate-180" /> Back to website
          </Link>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   15. ADMIN DASHBOARD
   ========================================================================= */
