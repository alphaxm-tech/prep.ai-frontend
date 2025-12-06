"use client";

import React, { useState, useCallback, memo } from "react";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { useToast } from "@/components/ToastProvider";

/**
 * InputWithIcon must be declared at module top-level to keep identity stable.
 */
const InputWithIcon = memo(function InputWithIcon({
  icon,
  type = "text",
  placeholder = "",
  value,
  onChange,
  name,
  autoComplete,
  ...rest
}: any) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(e);
  };

  return (
    <div className="relative mt-1">
      <div className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none">
        {icon}
      </div>
      <input
        name={name}
        autoComplete={autoComplete}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none text-sm sm:text-base"
        {...rest}
      />
    </div>
  );
});

/**
 * Demo-only Login Page
 *
 * UI: uses the original tab/buttons layout (Email | OTP | Sign Up | Enter)
 * Auth: demo-only client-side check for allowed users
 *
 * Security reminder: credentials are visible in the client bundle. Use only for testing/demo.
 */
export default function LoginPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();

  // keep tabs like original UI (so user can click OTP / signup) but auth remains demo-only
  const [mode, setMode] = useState<"signin" | "signup" | "otp">("signin");

  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [fullname, setFullname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // loaders / inline error
  const [loginLoader, setLoginLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // -----------------------------
  // Allowed demo credentials (client-side)
  // -----------------------------
  const ALLOWED_USERS = [
    {
      email: "vm.prepai@gmail.com",
      password: "prepai@1993",
    },
    {
      email: "sanjanaaddepalli2005@gmail.com",
      password: "xOQDhT3cpWRut4kW",
    },
  ];

  // clear inline error on input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errorMessage) setErrorMessage(null);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errorMessage) setErrorMessage(null);
  };
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
    if (errorMessage) setErrorMessage(null);
  };

  // Primary action:
  // validate against the allowed users list and route to /home on success.
  const handleSignIn = useCallback(() => {
    setLoginLoader(true);
    setErrorMessage(null);

    const normalizedEmail = email.trim().toLowerCase();

    const matchedUser = ALLOWED_USERS.find(
      (u) =>
        u.email.toLowerCase() === normalizedEmail && u.password === password
    );

    if (matchedUser) {
      success?.("Logged in (demo). Redirecting…");
      setTimeout(() => {
        setLoginLoader(false);
        router.push("/home");
      }, 400);
      return;
    }

    // failure
    setLoginLoader(false);
    const msg = "Invalid credentials.";
    setErrorMessage(msg);
    showError?.(msg);
  }, [email, password, router, success, showError]);

  // OTP / Signup actions simply reuse the same demo-only behavior.
  const handleSendOtp = useCallback(() => {
    setErrorMessage(null);
    showError?.("OTP flow not active in demo. Use demo credentials.");
  }, [showError]);

  const handleVerifyOtp = useCallback(() => {
    setErrorMessage(null);
    showError?.("OTP verification not active in demo. Use demo credentials.");
  }, [showError]);

  const handleRegister = useCallback(() => {
    setErrorMessage(null);
    showError?.("Sign up not active in demo. Use demo credentials to sign in.");
  }, [showError]);

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <>
      <Loader show={loginLoader} message="Signing you in..." />

      <div className="min-h-screen flex items-start justify-center bg-yellow-50/40 px-4 py-8 sm:py-12">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Small-screen hero */}
          <div className="md:hidden border-b border-gray-100 p-6">
            <div className="flex flex-col items-center justify-center gap-4">
              <svg
                width="160"
                height="160"
                viewBox="0 0 220 220"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-md"
                aria-hidden
              >
                <rect
                  x="0"
                  y="0"
                  width="220"
                  height="220"
                  rx="20"
                  fill="url(#gradAIY)"
                />
                <defs>
                  <linearGradient id="gradAIY" x1="0" x2="1">
                    <stop offset="0%" stopColor="#fff7ed" />
                    <stop offset="100%" stopColor="#ffedd5" />
                  </linearGradient>
                </defs>
                <g transform="translate(40,40)">
                  <circle cx="50" cy="40" r="24" fill="#fff" />
                  <rect
                    x="10"
                    y="80"
                    width="80"
                    height="10"
                    rx="5"
                    fill="#fff"
                  />
                  <rect
                    x="10"
                    y="100"
                    width="60"
                    height="8"
                    rx="4"
                    fill="#fff"
                  />
                  <rect
                    x="10"
                    y="114"
                    width="40"
                    height="8"
                    rx="4"
                    fill="#fff"
                  />
                </g>
              </svg>
              <div className="text-center">
                <h3 className="text-base font-semibold text-gray-800">
                  AI-powered career portal
                </h3>
                <p className="text-xs text-gray-500">
                  Resumes curated with AI • Conversational AI interviews • Smart
                  job matching
                </p>
              </div>
            </div>
          </div>

          {/* Left: Illustration & AI selling points for md+ */}
          <div className="hidden md:flex flex-col justify-center p-8 border-r border-gray-100">
            <div className="flex flex-col items-center justify-center gap-4 p-6">
              <svg
                width="160"
                height="160"
                viewBox="0 0 220 220"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-md"
                aria-hidden
              >
                <rect
                  x="0"
                  y="0"
                  width="220"
                  height="220"
                  rx="20"
                  fill="url(#gradAIY)"
                />
                <defs>
                  <linearGradient id="gradAIY" x1="0" x2="1">
                    <stop offset="0%" stopColor="#fff7ed" />
                    <stop offset="100%" stopColor="#ffedd5" />
                  </linearGradient>
                </defs>
                <g transform="translate(40,40)">
                  <circle cx="50" cy="40" r="24" fill="#fff" />
                  <rect
                    x="10"
                    y="80"
                    width="80"
                    height="10"
                    rx="5"
                    fill="#fff"
                  />
                  <rect
                    x="10"
                    y="100"
                    width="60"
                    height="8"
                    rx="4"
                    fill="#fff"
                  />
                  <rect
                    x="10"
                    y="114"
                    width="40"
                    height="8"
                    rx="4"
                    fill="#fff"
                  />
                </g>
              </svg>

              <div className="text-center">
                <h3 className="text-base font-semibold text-gray-800">
                  AI-powered career portal
                </h3>
                <p className="text-xs text-gray-500">
                  Resumes curated with AI • Conversational AI interviews • Smart
                  job matching
                </p>
              </div>

              <div className="flex flex-col gap-3 w-full">
                <div className="flex items-center gap-3 bg-yellow-50 px-3 py-2 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-yellow-200 flex items-center justify-center">
                    🤖
                  </div>
                  <div className="text-sm">
                    <div className="text-xs text-gray-500">
                      AI Resume Builder
                    </div>
                    <div className="font-medium text-gray-800">
                      Curated, optimized CVs
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-yellow-50 px-3 py-2 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-yellow-200 flex items-center justify-center">
                    🎤
                  </div>
                  <div className="text-sm">
                    <div className="text-xs text-gray-500">
                      AI Mock Interviews
                    </div>
                    <div className="font-medium text-gray-800">
                      Practice with AI feedback
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-yellow-50 px-3 py-2 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-yellow-200 flex items-center justify-center">
                    ⚡
                  </div>
                  <div className="text-sm">
                    <div className="text-xs text-gray-500">Smart Insights</div>
                    <div className="font-medium text-gray-800">
                      Personalized career tips
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form card (uses original tab/buttons layout) */}
          <div className="p-6 sm:p-8">
            <div className="text-center mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                AI prep <span className="text-yellow-500">buddy</span>
              </h1>
              <p className="text-gray-500 mt-2 text-sm sm:text-base">
                {mode === "signup"
                  ? "Create your account"
                  : mode === "otp"
                  ? "Sign in with OTP"
                  : "Welcome back! Please log in."}
              </p>
            </div>

            {/* Tabs (original) */}
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              <button
                className={`px-3 py-2 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-300 ${
                  mode === "signin"
                    ? "bg-yellow-400 text-white"
                    : "bg-yellow-50 text-yellow-600"
                }`}
                onClick={() => setMode("signin")}
                aria-pressed={mode === "signin"}
                type="button"
              >
                Email
              </button>

              <button
                className={`px-3 py-2 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-300 ${
                  mode === "otp"
                    ? "bg-yellow-400 text-white"
                    : "bg-yellow-50 text-yellow-600"
                }`}
                onClick={() => setMode("otp")}
                aria-pressed={mode === "otp"}
                type="button"
              >
                OTP
              </button>

              <button
                className={`px-3 py-2 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-300 ${
                  mode === "signup"
                    ? "bg-yellow-400 text-white"
                    : "bg-yellow-50 text-yellow-600"
                }`}
                onClick={() => setMode("signup")}
                aria-pressed={mode === "signup"}
                type="button"
              >
                Sign Up
              </button>
            </div>

            {/* Form area */}
            <div className="space-y-4 min-h-[320px] transition-all duration-200">
              {mode === "signup" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Full Name
                    </label>
                    <InputWithIcon
                      name="fullname"
                      autoComplete="name"
                      icon={<></>}
                      type="text"
                      placeholder="John Doe"
                      value={fullname}
                      onChange={(e: any) => setFullname(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Phone number
                    </label>
                    <InputWithIcon
                      name="phone"
                      autoComplete="tel"
                      icon={<EnvelopeIcon className="h-5 w-5" />}
                      type="tel"
                      placeholder="9130859725"
                      value={phoneNumber}
                      onChange={(e: any) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Email
                </label>
                <InputWithIcon
                  name="email"
                  autoComplete="email"
                  icon={<EnvelopeIcon className="h-5 w-5" />}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>

              {mode === "otp" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-600 pb-1">
                    Enter OTP
                  </label>
                  <div className="flex gap-2">
                    <input
                      name="otp"
                      autoComplete="one-time-code"
                      type="text"
                      placeholder="123456"
                      value={otp}
                      onChange={handleOtpChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none text-sm sm:text-base"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Password
                  </label>
                  <InputWithIcon
                    name="password"
                    autoComplete="current-password"
                    icon={<LockClosedIcon className="h-5 w-5" />}
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </div>
              )}

              {mode !== "otp" && (
                <div className="text-right">
                  <a
                    href="/forgot-password"
                    className="text-sm text-yellow-600 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
              )}

              {errorMessage && (
                <div
                  className="text-sm text-red-600 mt-1"
                  role="alert"
                  aria-live="assertive"
                >
                  {errorMessage}
                </div>
              )}

              {mode === "otp" ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className="col-span-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold py-3 rounded-xl shadow-md hover:-translate-y-0.5 transform transition text-sm sm:text-base"
                    onClick={handleSendOtp}
                    type="button"
                  >
                    Send OTP
                  </button>

                  <button
                    className="col-span-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold py-3 rounded-xl shadow-md hover:-translate-y-0.5 transform transition text-sm sm:text-base"
                    onClick={handleVerifyOtp}
                    type="button"
                  >
                    Verify OTP
                  </button>
                </div>
              ) : mode === "signup" ? (
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold py-3 rounded-xl shadow-md hover:-translate-y-0.5 transform transition text-sm sm:text-base"
                  onClick={handleRegister}
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  Sign Up
                </button>
              ) : (
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold py-3 rounded-xl shadow-md hover:-translate-y-0.5 transform transition text-sm sm:text-base"
                  onClick={handleSignIn}
                  disabled={loginLoader}
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  Sign In
                </button>
              )}
            </div>

            <div className="my-4 flex items-center">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-2 text-gray-500 text-sm">OR</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition text-sm sm:text-base"
              onClick={handleGoogleLogin}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 533.5 544.3"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
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
          </div>
        </div>
      </div>
    </>
  );
}
