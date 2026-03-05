"use client";

import Link from "next/link";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-amber-50 px-6">
      {/* Decorative Blobs */}
      <div className="absolute top-10 right-10 h-72 w-72 rounded-full bg-yellow-400/20 blur-3xl -z-10" />
      <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl -z-10" />

      <div className="max-w-lg rounded-3xl bg-white p-10 shadow-xl border border-yellow-100 text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-yellow-100 p-6 ring-1 ring-yellow-300">
            <ShieldAlert className="h-12 w-12 text-yellow-600" />
          </div>
        </div>

        {/* 403 */}
        <h1 className="text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-500">
          403
        </h1>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800">
          Access Restricted
        </h2>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed">
          You do not have permission to access this page. This may happen if
          your role does not allow it or your session has expired. If you think
          this is an error, please contact support.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4 pt-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 px-6 py-3 text-sm font-medium text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>

        {/* Footer */}
        <p className="pt-6 text-xs text-gray-400">
          Error Code: AUTH-403 · Secure Access
        </p>
      </div>
    </div>
  );
}
