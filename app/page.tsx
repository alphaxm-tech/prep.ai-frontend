"use client";

import React, { useState, useCallback, memo } from "react";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/utils/services/auth.service";
import Loader from "@/components/Loader";
import { useToast } from "@/components/ToastProvider";

/**
 * IMPORTANT FIX:
 * InputWithIcon must be declared at module top-level (not inside the component)
 * so its identity is stable across renders. This prevents React from unmounting/re-mounting
 * the input which causes the focus / 1-character-only typing bug.
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

export default function LoginPage() {
  const router = useRouter();

  // auth mode: "signin" | "signup" | "otp"
  const [mode, setMode] = useState<"signin" | "signup" | "otp">("signin");

  // form state
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  // loaders
  const [loader, setLoader] = useState(false);
  const [loginLoader, setLoginLoader] = useState(false);
  const [otpLoader, setOtpLoader] = useState(false);
  const [sendOtpForLoginLoader, setSendOtpForLoginLoader] = useState(false);

  const { success, error: showError } = useToast();

  // keep existing mutations intact (no changes to logic)
  const registerMutation = useMutation({
    mutationFn: authService.registerWithPassword,
    onSuccess: (data) => {
      console.log("Registered successfully:", data);
      setLoader(false);
      router.push("/home");
    },
    onError: (error) => {
      console.error("Registration failed:", error);
      setLoader(false);
    },
  });

  const loginMutation = useMutation({
    mutationFn: authService.loginWithPassword,
    onSuccess: (data) => {
      console.log("Login successfully:", data?.user);
      setLoginLoader(false);
      router.push("/home");
    },
    onError: (error) => {
      console.error("Registration failed:", error);
      setLoader(false);
    },
  });

  // OTP flow (assume authService has sendOtp & verifyOtp; keep commented if not used)
  const sendOtpMutation = useMutation({
    mutationFn: authService.sendOtpForLogin, // expects { email }
    onSuccess: (data) => {
      console.log("OTP sent:", data);
      setSendOtpForLoginLoader(false);
    },
    onError: (error) => {
      console.error("Send OTP failed:", error);
      showError("Failed to send OTP. Please try again.");
      setSendOtpForLoginLoader(false);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: authService.verifyOtpForLogin, // expects { email, otp }
    onSuccess: (data) => {
      setOtpLoader(false);
      router.push("/home");
    },
    onError: (err) => {
      console.error("Verify OTP failed:", err);
      showError("Failed to send OTP. Please try again.");
      setOtpLoader(false);
    },
  });

  const handleSignIn = useCallback(() => {
    if (mode === "signup") {
      setLoader(true);
      registerMutation.mutate({
        email: email,
        fullname: fullname,
        phoneNumber: phoneNumber,
        password: password,
      });
    } else if (mode === "signin") {
      setLoginLoader(true);
      loginMutation.mutate({
        email: email,
        password: password,
      });
    }
  }, [
    mode,
    email,
    fullname,
    phoneNumber,
    password,
    registerMutation,
    loginMutation,
  ]);

  const handleSendOtp = useCallback(() => {
    // console.log(email);
    setSendOtpForLoginLoader(true);
    sendOtpMutation.mutate({ email });
  }, [sendOtpMutation, email]);

  const handleVerifyOtp = useCallback(() => {
    setOtpLoader(true);
    verifyOtpMutation.mutate({ email, otp: otp });
  }, [otp, email]);

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  // Left column: AI emphasis panel (yellow-themed)
  const HeroIllustration = () => (
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
          <rect x="10" y="80" width="80" height="10" rx="5" fill="#fff" />
          <rect x="10" y="100" width="60" height="8" rx="4" fill="#fff" />
          <rect x="10" y="114" width="40" height="8" rx="4" fill="#fff" />
        </g>
      </svg>

      <div className="text-center">
        <h3 className="text-base font-semibold text-gray-800">
          AI-powered career portal
        </h3>
        <p className="text-xs text-gray-500">
          Resumes curated with AI • Conversational AI interviews • Smart job
          matching
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <div className="flex items-center gap-3 bg-yellow-50 px-3 py-2 rounded-lg">
          <div className="h-8 w-8 rounded-full bg-yellow-200 flex items-center justify-center font-bold text-sm">
            🤖
          </div>
          <div className="text-sm">
            <div className="text-xs text-gray-500">AI Resume Builder</div>
            <div className="font-medium text-gray-800">
              Curated, optimized CVs
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-yellow-50 px-3 py-2 rounded-lg">
          <div className="h-8 w-8 rounded-full bg-yellow-200 flex items-center justify-center font-bold text-sm">
            🎤
          </div>
          <div className="text-sm">
            <div className="text-xs text-gray-500">AI Mock Interviews</div>
            <div className="font-medium text-gray-800">
              Practice with AI feedback
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-yellow-50 px-3 py-2 rounded-lg">
          <div className="h-8 w-8 rounded-full bg-yellow-200 flex items-center justify-center font-bold text-sm">
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
  );

  return (
    <>
      <Loader show={loader} message="Creating your account"></Loader>
      <Loader
        show={loginLoader}
        message="Almost there, Preparing your dashboard..."
      ></Loader>
      <Loader show={otpLoader} message="Verifying OTP..."></Loader>
      <Loader
        show={sendOtpForLoginLoader}
        message="Sending otp to your email id"
      ></Loader>

      <div className="min-h-screen flex items-start justify-center bg-yellow-50/40 px-4 py-8 sm:py-12">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Small-screen hero: show above form on mobile */}
          <div className="md:hidden border-b border-gray-100">
            <HeroIllustration />
          </div>

          {/* Left: Illustration & AI selling points for md+ */}
          <div className="hidden md:flex flex-col justify-center p-8 border-r border-gray-100">
            <HeroIllustration />
          </div>

          {/* Right: Form card */}
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

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              <button
                className={`px-3 py-2 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-300 ${
                  mode === "signin"
                    ? "bg-yellow-400 text-white"
                    : "bg-yellow-50 text-yellow-600"
                }`}
                onClick={() => setMode("signin")}
                aria-pressed={mode === "signin"}
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
              >
                Sign Up
              </button>

              {/* Enter without login: smaller on mobile so it doesn't dominate */}
              <button
                className="px-3 py-2 rounded-full text-sm font-medium bg-yellow-50 text-yellow-600"
                onClick={() => router.push("/home")}
              >
                Enter
              </button>
            </div>

            {/* Form area - fixed min height to prevent layout shift and smooth transition */}
            <div className="space-y-4 min-h-[320px] transition-all duration-200">
              {mode === "signup" && (
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
                  onChange={(e: any) => setEmail(e.target.value)}
                />
              </div>

              {mode === "signup" && (
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
              )}

              {mode === "signup" && (
                <>
                  {/* ADD THIS: Password for signup */}
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-600">
                      Password
                    </label>
                    <InputWithIcon
                      name="password"
                      autoComplete="new-password"
                      icon={<LockClosedIcon className="h-5 w-5" />}
                      type="password"
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e: any) => setPassword(e.target.value)}
                    />
                  </div>
                </>
              )}

              {mode === "signin" && (
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
                    onChange={(e: any) => setPassword(e.target.value)}
                  />
                </div>
              )}

              {mode === "otp" && (
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
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none text-sm sm:text-base"
                    />
                  </div>
                </div>
              )}

              {/* Forgot password only for password sign-in */}
              {mode === "signin" && (
                <div className="text-right">
                  <a
                    href="/forgot-password"
                    className="text-sm text-yellow-600 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
              )}

              {/* Primary action button - modern, sleek style */}
              {mode === "otp" ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className="col-span-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold py-3 rounded-xl shadow-md hover:-translate-y-0.5 transform transition text-sm sm:text-base"
                    onClick={handleSendOtp}
                    disabled={sendOtpForLoginLoader}
                  >
                    {sendOtpForLoginLoader ? "Sending..." : "Send OTP"}
                  </button>

                  <button
                    className="col-span-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold py-3 rounded-xl shadow-md hover:-translate-y-0.5 transform transition text-sm sm:text-base"
                    onClick={handleVerifyOtp}
                  >
                    Verify OTP
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold py-3 rounded-xl shadow-md hover:-translate-y-0.5 transform transition text-sm sm:text-base"
                  onClick={handleSignIn}
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  {mode === "signup" ? "Sign Up" : "Sign In"}
                </button>
              )}
            </div>

            {/* OR Divider */}
            <div className="my-4 flex items-center">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-2 text-gray-500 text-sm">OR</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            {/* Single Google button kept here for discoverability */}
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

            {/* Switch Auth Mode */}
            <p className="text-center text-sm text-gray-600 mt-6">
              {mode === "signup"
                ? "Already have an account?"
                : "Don’t have an account?"}{" "}
              <button
                onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
                className="text-yellow-600 font-medium hover:underline"
              >
                {mode === "signup" ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
