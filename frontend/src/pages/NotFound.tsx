import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const NotFoundPage: React.FC = () => (
  <section className="section bg-white">
    <div className="container-page text-center">
      <span className="text-6xl font-extrabold text-primary-100">404</span>
      <h1 className="mt-4 text-2xl font-extrabold text-slate-900 sm:text-3xl">Page not found</h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-slate-600">
        The page you were looking for has moved or never existed. Try one of the main sections
        instead.
      </p>
      <Link to="/" className="btn-primary mt-8">
        Back to home <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  </section>
);

/* =========================================================================
   17. APP + ROUTES
   ========================================================================= */
