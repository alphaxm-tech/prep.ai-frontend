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
 * Multi-screen Login Page (email -> choose -> otp/password flows)
 *
 * - Screen 1: only email input + Verify Email button
 * - Screen 2: after verification -> Login with OTP | Login with Password
 * - Screen 3a: OTP entry only
 * - Screen 3b: Password entry OR Set password (based on hasPassword)
 *
 * Backend endpoints expected (adjust if needed):
 * - POST /api/auth/verifyUserEmail  { email } -> { exists, hasPassword }
 * - POST /api/auth/send-otp         { email } -> { success }
 * - POST /api/auth/verify-otp       { email, otp } -> { success }  (sets cookies)
 * - POST /api/auth/login            { email, password } -> { success } (sets cookies)
 * - POST /api/auth/setPasswordAndLogin { email, password } -> { success } (sets cookies)
 */
export default function LoginPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();

  // screens: "email" -> "choose" -> "otp" -> "password" | "setPassword"
  const [step, setStep] = useState<
    "email" | "choose" | "otp" | "password" | "setPassword"
  >("email");

  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [fullname, setFullname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // server-driven flags
  const [emailVerified, setEmailVerified] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);

  // loaders / inline error
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // -----------------------------
  // Demo credentials still present but this flow prefers server APIs
  // -----------------------------
  const ALLOWED_USERS = [
    { email: "vm.prepai@gmail.com", password: "prepai@1993" },
    { email: "sanjanaaddepalli2005@gmail.com", password: "xOQDhT3cpWRut4kW" },
  ];

  // input handlers
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

  // -----------------------------
  // Screen 1 -> verify user email
  // -----------------------------
  const verifyUserEmail = useCallback(async () => {
    setErrorMessage(null);

    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) {
      showError?.("Enter a valid email.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/verifyUserEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        showError?.(data?.message || "Unable to verify email.");
        return;
      }

      if (!data.exists) {
        showError?.("No account found with this email.");
        setEmailVerified(false);
        return;
      }

      // email exists -> move to choose screen
      setEmailVerified(true);
      setHasPassword(Boolean(data.hasPassword));
      success?.("Email verified. Choose a login method.");
      setStep("choose");
    } catch (err) {
      setLoading(false);
      showError?.("Server error verifying email.");
    }
  }, [email, success, showError]);

  // -----------------------------
  // Screen 2 -> send OTP then go to otp screen
  // -----------------------------
  const sendOtpAndGo = useCallback(async () => {
    if (!emailVerified) {
      showError?.("Verify email first.");
      return;
    }

    setOtpLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();
      setOtpLoading(false);

      if (!res.ok || !data.success) {
        showError?.(data?.message || "Unable to send OTP.");
        return;
      }

      setOtpSent(true);
      success?.("OTP sent to your email.");
      setStep("otp");
    } catch (err) {
      setOtpLoading(false);
      showError?.("Server error sending OTP.");
    }
  }, [email, emailVerified, success, showError]);

  // -----------------------------
  // Screen 3a -> verify OTP
  // -----------------------------
  const verifyOtpAndLogin = useCallback(async () => {
    if (!otp || otp.trim().length === 0) {
      showError?.("Enter the OTP.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || !data.success) {
        showError?.(data?.message || "Invalid or expired OTP.");
        return;
      }

      success?.("OTP verified. Logging in…");
      // assume server sets cookies
      router.push("/home");
    } catch (err) {
      setLoading(false);
      showError?.("Server error verifying OTP.");
    }
  }, [email, otp, router, success, showError]);

  // -----------------------------
  // Screen 3b -> password login
  // -----------------------------
  const passwordLogin = useCallback(async () => {
    if (!password || password.length < 6) {
      showError?.("Enter a valid password (min 6 chars).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || !data.success) {
        showError?.(data?.message || "Invalid credentials.");
        return;
      }

      success?.("Logged in. Redirecting…");
      router.push("/home");
    } catch (err) {
      setLoading(false);
      showError?.("Server error logging in.");
    }
  }, [email, password, router, success, showError]);

  // set password & login
  const setPasswordAndLogin = useCallback(async () => {
    if (!password || password.length < 6) {
      showError?.("Password should be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/setPasswordAndLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || !data.success) {
        showError?.(data?.message || "Unable to set password.");
        return;
      }

      success?.("Password set. Logging in…");
      router.push("/home");
    } catch (err) {
      setLoading(false);
      showError?.("Server error setting password.");
    }
  }, [email, password, router, success, showError]);

  // fallback demo signin (keeps your original demo behavior if you click Sign In without using flow)
  const demoSignIn = useCallback(() => {
    setLoading(true);
    setErrorMessage(null);

    const normalizedEmail = email.trim().toLowerCase();
    const matchedUser = ALLOWED_USERS.find(
      (u) =>
        u.email.toLowerCase() === normalizedEmail && u.password === password
    );

    if (matchedUser) {
      success?.("Logged in (demo). Redirecting…");
      setTimeout(() => {
        setLoading(false);
        router.push("/home");
      }, 400);
      return;
    }

    setLoading(false);
    const msg = "Invalid credentials.";
    setErrorMessage(msg);
    showError?.(msg);
  }, [email, password, router, success, showError]);

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  // UI rendering by step
  return (
    <>
      <Loader show={loading || otpLoading} message="Working..." />

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

          {/* Right: Form card */}
          <div className="p-6 sm:p-8">
            <div className="text-center mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                AI prep <span className="text-yellow-500">buddy</span>
              </h1>
              <p className="text-gray-500 mt-2 text-sm sm:text-base">
                {step === "email" && "Enter your email to continue."}
                {step === "choose" && "Choose a login method."}
                {step === "otp" && "Enter the OTP sent to your email."}
                {step === "password" && "Enter your password to login."}
                {step === "setPassword" && "Create a new password."}
              </p>
            </div>

            <div className="space-y-4 min-h-[320px] transition-all duration-200">
              {/* Screen 1: only email + verify button */}
              {step === "email" && (
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

                  <button
                    type="button"
                    onClick={verifyUserEmail}
                    className="w-full mt-4 bg-yellow-500 text-white font-semibold py-3 rounded-xl"
                    disabled={loading}
                  >
                    Verify Email
                  </button>

                  {/* keep demo fallback Sign In hidden on this screen to match req */}
                </div>
              )}

              {/* Screen 2: choose method */}
              {step === "choose" && (
                <div>
                  <div className="text-sm text-gray-600 mb-3">
                    Email verified:{" "}
                    <span className="font-medium text-gray-800">{email}</span>
                  </div>

                  <button
                    type="button"
                    onClick={sendOtpAndGo}
                    className="w-full mb-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-3 rounded-xl font-semibold"
                    disabled={otpLoading}
                  >
                    Login with OTP
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (hasPassword) {
                        setStep("password");
                      } else {
                        setStep("setPassword");
                      }
                    }}
                    className="w-full mb-3 bg-yellow-100 text-yellow-700 py-3 rounded-xl font-semibold"
                  >
                    Login with Password
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/reset-password")}
                    className="w-full text-sm text-gray-500 underline mt-2"
                  >
                    Reset Password
                  </button>
                </div>
              )}

              {/* Screen 3a: OTP entry only */}
              {step === "otp" && (
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

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <button
                      className="col-span-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold py-3 rounded-xl shadow-md transform transition text-sm sm:text-base"
                      onClick={sendOtpAndGo}
                      type="button"
                      disabled={otpLoading}
                    >
                      {otpSent ? "Resend OTP" : "Send OTP"}
                    </button>

                    <button
                      className="col-span-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold py-3 rounded-xl shadow-md transform transition text-sm sm:text-base"
                      onClick={verifyOtpAndLogin}
                      type="button"
                      disabled={loading}
                    >
                      Login
                    </button>
                  </div>
                </div>
              )}

              {/* Screen 3b: Password entry or Set password */}
              {(step === "password" || step === "setPassword") && (
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    {step === "password" ? "Password" : "Set New Password"}
                  </label>
                  <InputWithIcon
                    name="password"
                    autoComplete={
                      step === "password" ? "current-password" : "new-password"
                    }
                    icon={<LockClosedIcon className="h-5 w-5" />}
                    type="password"
                    placeholder={
                      step === "password"
                        ? "Enter your password"
                        : "Create a password"
                    }
                    value={password}
                    onChange={handlePasswordChange}
                  />

                  <button
                    type="button"
                    onClick={
                      step === "password" ? passwordLogin : setPasswordAndLogin
                    }
                    className="w-full mt-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold py-3 rounded-xl"
                    disabled={loading}
                  >
                    {step === "password" ? "Login" : "Save & Login"}
                  </button>
                </div>
              )}

              {/* Keep a tiny link to go back to email screen (helpful navigation) */}
              {step !== "email" && (
                <div className="text-center mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      // if user goes back to email, reset flow
                      setStep("email");
                      setEmailVerified(false);
                      setHasPassword(false);
                      setOtp("");
                      setPassword("");
                      setOtpSent(false);
                    }}
                    className="text-sm text-gray-500 hover:underline"
                  >
                    Back to Email
                  </button>
                </div>
              )}

              {/* Inline error */}
              {errorMessage && (
                <div
                  className="text-sm text-red-600 mt-1"
                  role="alert"
                  aria-live="assertive"
                >
                  {errorMessage}
                </div>
              )}

              {/* Keep original demo Sign In hidden except user explicitly wants; but keep a small fallback to preserve behavior */}
              {step === "email" && (
                <div className="mt-4">
                  {/* Hidden by default per your requirement — no Sign In button on first screen other than Verify Email */}
                </div>
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
