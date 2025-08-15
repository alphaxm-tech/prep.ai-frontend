"use client";

import { useState } from "react";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50/40 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Prep<span className="text-yellow-500">.ai</span>
          </h1>
          <p className="text-gray-500 mt-2">
            {isSignUp ? "Create your account" : "Welcome back! Please log in."}
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Full Name
              </label>
              <div className="relative mt-1">
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <div className="relative mt-1">
              <EnvelopeIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <div className="relative mt-1">
              <LockClosedIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </div>
          </div>

          {!isSignUp && (
            <div className="text-right">
              <a
                href="/forgot-password"
                className="text-sm text-yellow-600 hover:underline"
              >
                Forgot password?
              </a>
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-yellow-400 text-white font-semibold py-2 rounded-lg hover:bg-yellow-500 transition"
            onClick={handleSignIn}
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        {/* OR Divider */}
        <div className="my-4 flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Google Login */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 533.5 544.3"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M533.5 278.4c0-17.4-1.5-34-4.3-50.1H272.1v95h146.9c-6.4 34.5-25 63.8-53.4 83.2v68h86.1c50.3-46.3 81.8-114.7 81.8-196.1z"
              fill="#4285f4"
            />
            <path
              d="M272.1 544.3c72.4 0 133.2-23.9 177.6-64.8l-86.1-68c-23.8 16-54.1 25.4-91.5 25.4-70 0-129.3-47.2-150.5-110.4h-89v69.4c44.3 88.3 135.8 148.4 239.5 148.4z"
              fill="#34a853"
            />
            <path
              d="M121.6 326.5c-10.3-30.1-10.3-62.8 0-92.9v-69.4h-89c-37.7 75.3-37.7 164.7 0 240.1l89-69.4z"
              fill="#fbbc04"
            />
            <path
              d="M272.1 107.7c38.9 0 74 13.4 101.7 39.7l76.3-76.3C405.3 24.6 344.5 0 272.1 0 168.4 0 76.9 60.1 32.6 148.4l89 69.4c21.2-63.2 80.5-110.4 150.5-110.4z"
              fill="#ea4335"
            />
          </svg>
          <span className="text-gray-700 font-medium">
            Continue with Google
          </span>
        </button>

        {/* Switch Auth Mode */}
        <p className="text-center text-sm text-gray-600 mt-6">
          {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-yellow-600 font-medium hover:underline"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>

        <button
          onClick={handleSignIn}
          className="w-full my-4 flex items-center justify-center gap-2 bg-yellow-400 font-semibold py-2 rounded-lg hover:bg-yellow-500 transition text-black"
        >
          Test Enter
        </button>
      </div>
    </div>
  );
}
