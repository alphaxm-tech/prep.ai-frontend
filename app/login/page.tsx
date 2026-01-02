"use client";

import React, { useState, useCallback, memo } from "react";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import {
  addUserDetails,
  loginWithPassword,
  useVerifyUserEmail,
} from "@/utils/mutations/auth.mutations";
import { useToast } from "@/components/toast/ToastContext";

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
  const DEMO_ADMIN_EMAIL = "admin.prepai@gmail.com";
  const DEMO_ADMIN_PASSWORD = "Admin@2025";

  const DEMO_ADMINS = [
    {
      email: "admin.prepai@gmail.com",
      password: "Admin@2025",
      role: "admin",
    },
    {
      email: "sanket.naukarkar@gmail.com",
      password: "Sanket@1998",
      role: "admin",
    },
    {
      email: "vm.prepai@gmail.com",
      password: "prepai@1993",
      role: "admin",
    },
    {
      email: "santhikannuru28@gmail.com",
      password: "santhikannuru28@prepai",
      role: "student",
    },
    {
      email: "pavankumarpadala06@gmail.com",
      password: "pavankumarpadala06@prepai",
      role: "student",
    },
  ];

  const router = useRouter();
  // const { success, error: showError } = useToast();

  // screens: "email" -> "choose" -> "otp" -> "password" | "setPassword"
  const [step, setStep] = useState<
    "email" | "profile" | "choose" | "otp" | "password" | "setPassword"
  >("email");

  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [userID, setUserID] = useState<number | null>();

  // server-driven flags
  const [emailVerified, setEmailVerified] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);

  // loaders / inline error
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("Loading");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { showToast } = useToast();

  const verifyEmailMutation = useVerifyUserEmail();
  const addUserDetailsMutation = addUserDetails();
  const loginWithPasswordMutation = loginWithPassword();

  // -----------------------------
  // Demo credentials still present but this flow prefers server APIs
  // -----------------------------
  const ALLOWED_USERS = [
    { email: "vm.prepai@gmail.com", password: "prepai@1993" },
    // { email: "sanjanaaddepalli2005@gmail.com", password: "xOQDhT3cpWRut4kW" },
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
  // const verifyUserEmail = useCallback(() => {
  //   if (!email) {
  //     showToast("error", "Please add an email ID");
  //     return;
  //   }
  //   setLoading(true);
  //   setErrorMessage(null);
  //   setLoadingMessage("Verifying your email id");

  //   const trimmed = email.trim().toLowerCase();
  //   if (!trimmed || !trimmed.includes("@")) {
  //     // showError?.("Enter a valid email.");
  //     return;
  //   }

  //   verifyEmailMutation.mutate(
  //     { email: trimmed },
  //     {
  //       onSuccess: (data) => {
  //         console.log("Verification successful", data);
  //         setLoading(false);
  //         if (data?.canLogin) {
  //           if (!data?.userDetails) {
  //             setStep("profile");
  //           } else {
  //             setStep("choose");
  //           }

  //           setHasPassword(data?.passswordExists);
  //           showToast("success", "Email verified successfully!");
  //           setUserID(data?.userID ?? null);
  //         } else {
  //           showToast("error", data?.reason);
  //         }
  //       },
  //       onError: (err: any) => {
  //         const status = err?.response?.status;
  //         const data = err?.response?.data;
  //         console.log(status);

  //         if (status === 403) {
  //           handleForbidden(data);
  //           return;
  //         }

  //         showToast("error", "Something went wrong. Please try again.");
  //         setLoading(false);
  //       },
  //     }
  //   );
  // }, [email]);

  // const verifyUserEmail = useCallback(() => {
  //   if (!email) {
  //     showToast("error", "Please add an email ID");
  //     return;
  //   }

  //   const trimmed = email.trim().toLowerCase();

  //   if (!trimmed || !trimmed.includes("@")) {
  //     showToast("error", "Enter a valid email address");
  //     return;
  //   }

  //   /**
  //    * 🔐 DEMO ADMIN SHORT-CIRCUIT (NO BACKEND)
  //    */
  //   if (trimmed === DEMO_ADMIN_EMAIL) {
  //     showToast("success", "Admin email verified");

  //     // Fake server response locally
  //     setStep("password"); // go directly to password login
  //     setHasPassword(true); // admin has password
  //     setEmailVerified(true);
  //     setUserID(-1); // dummy ID (never used)
  //     return;
  //   }

  //   /**
  //    * 🔁 REAL BACKEND FLOW (UNCHANGED)
  //    */
  //   setLoading(true);
  //   setErrorMessage(null);
  //   setLoadingMessage("Verifying your email id");

  //   verifyEmailMutation.mutate(
  //     { email: trimmed },
  //     {
  //       onSuccess: (data) => {
  //         setLoading(false);

  //         if (data?.canLogin) {
  //           if (!data?.userDetails) {
  //             setStep("profile");
  //           } else {
  //             setStep("choose");
  //           }

  //           setHasPassword(data?.passswordExists);
  //           setEmailVerified(true);
  //           setUserID(data?.userID ?? null);
  //           showToast("success", "Email verified successfully!");
  //         } else {
  //           showToast("error", data?.reason);
  //         }
  //       },
  //       onError: (err: any) => {
  //         const status = err?.response?.status;
  //         const data = err?.response?.data;

  //         if (status === 403) {
  //           handleForbidden(data);
  //           return;
  //         }

  //         showToast("error", "Something went wrong. Please try again.");
  //         setLoading(false);
  //       },
  //     }
  //   );
  // }, [email]);

  const verifyUserEmail = useCallback(() => {
    if (!email) {
      showToast("error", "Please add an email ID");
      return;
    }

    const trimmed = email.trim().toLowerCase();

    if (!trimmed || !trimmed.includes("@")) {
      showToast("error", "Enter a valid email address");
      return;
    }

    /**
     * 🔐 UI-ONLY DEMO LOGIN (NO BACKEND)
     * Works for ALL emails in DEMO_ADMINS
     */
    const demoUser = DEMO_ADMINS.find((u) => u.email.toLowerCase() === trimmed);

    if (demoUser) {
      showToast("success", "Demo user verified");

      setEmailVerified(true);
      setHasPassword(true); // all demo users have passwords
      setUserID(-1); // dummy ID
      setStep("password"); // go directly to password login

      return;
    }

    /**
     * 🔁 REAL BACKEND FLOW (UNCHANGED)
     */
    setLoading(true);
    setErrorMessage(null);
    setLoadingMessage("Verifying your email id");

    verifyEmailMutation.mutate(
      { email: trimmed },
      {
        onSuccess: (data) => {
          setLoading(false);

          if (data?.canLogin) {
            if (!data?.userDetails) {
              setStep("profile");
            } else {
              setStep("choose");
            }

            setHasPassword(data?.passswordExists);
            setEmailVerified(true);
            setUserID(data?.userID ?? null);

            showToast("success", "Email verified successfully!");
          } else {
            showToast("error", data?.reason);
          }
        },
        onError: (err: any) => {
          const status = err?.response?.status;
          const data = err?.response?.data;

          if (status === 403) {
            handleForbidden(data);
            return;
          }

          showToast("error", "Something went wrong. Please try again.");
          setLoading(false);
        },
      }
    );
  }, [email]);

  // -----------------------------
  // Screen 2 -> add user details -> name, phonenumber, location
  // -----------------------------
  const submitProfileDetails = useCallback(async () => {
    if (!email || !firstName || !lastName || !phoneNumber || !location) {
      showToast("error", "Please fill all the details");
      return;
    }

    setLoading(true);
    setLoadingMessage("Saving your profile");

    addUserDetailsMutation.mutate(
      {
        email: email.trim(),
        full_name: `${firstName.trim()}, ${lastName.trim()}`,
        phone_number: phoneNumber.trim(),
        location: location.trim(),
      },
      {
        onSuccess: (data: any) => {
          setStep("choose");
          console.log("Verification successful", data);
          setLoading(false);
        },
        onError: (err: any) => {
          const status = err?.response?.status;
          const data = err?.response?.data;

          showToast("error", "Something went wrong. Please try again.");
          setLoading(false);
        },
      }
    );
  }, [email, firstName, lastName, phoneNumber, location]);

  // -----------------------------
  // Screen 2 -> send OTP then go to otp screen
  // -----------------------------
  const sendOtpAndGo = useCallback(async () => {
    if (!emailVerified) {
      // showError?.("Verify email first.");
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
        // showError?.(data?.message || "Unable to send OTP.");
        return;
      }

      setOtpSent(true);
      // success?.("OTP sent to your email.");
      setStep("otp");
    } catch (err) {
      setOtpLoading(false);
      // showError?.("Server error sending OTP.");
    }
  }, [email, emailVerified]);

  // -----------------------------
  // Screen 3a -> verify OTP
  // -----------------------------
  const verifyOtpAndLogin = useCallback(async () => {
    if (!otp || otp.trim().length === 0) {
      // showError?.("Enter the OTP.");
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
        // showError?.(data?.message || "Invalid or expired OTP.");
        return;
      }

      // success?.("OTP verified. Logging in…");
      // assume server sets cookies
      router.push("/home");
    } catch (err) {
      setLoading(false);
      // showError?.("Server error verifying OTP.");
    }
  }, [email, otp, router]);

  // -----------------------------
  // Screen 3b -> password login
  // -----------------------------
  // const passwordLogin = useCallback(async () => {
  //   if (!password || password.length < 8) {
  //     showToast("error", "Password must be of miniumun 8 characters");
  //     return;
  //   }

  //   setLoading(true);
  //   setLoadingMessage("Logging you in....");
  //   loginWithPasswordMutation.mutate(
  //     {
  //       email: email.trim(),
  //       password: password.trim(),
  //     },
  //     {
  //       onSuccess: (data: any) => {
  //         // setStep("choose");

  //         router.push("/home");
  //         console.log("Login successful", data);
  //         setLoading(false);
  //       },
  //       onError: (err: any) => {
  //         const status = err?.response?.status;
  //         const data = err?.response?.data;

  //         showToast("error", "Something went wrong. Please try again.");
  //         setLoading(false);
  //       },
  //     }
  //   );
  // }, [email, password, router]);

  // -----------------------------
  // Screen 3b -> password login
  // -----------------------------
  const passwordLogin = useCallback(async () => {
    if (!password || password.length < 8) {
      showToast("error", "Password must be of minimum 8 characters");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    /**
     * 🔐 UI-only DEMO ADMIN LOGIN (NO API CALL)
     */
    // if (
    //   normalizedEmail === DEMO_ADMIN_EMAIL &&
    //   normalizedPassword === DEMO_ADMIN_PASSWORD
    // ) {
    //   showToast("success", "Admin login successful");
    //   router.push("/home");
    //   return;
    // }

    const matchedDemoUser = DEMO_ADMINS.find(
      (u) =>
        u.email.toLowerCase() === normalizedEmail &&
        u.password === normalizedPassword
    );

    if (matchedDemoUser) {
      showToast("success", `Login successful (${matchedDemoUser.role})`);
      router.push("/home");
      return;
    }

    /**
     * 🔁 REAL BACKEND LOGIN (unchanged)
     */
    setLoading(true);
    setLoadingMessage("Logging you in....");

    loginWithPasswordMutation.mutate(
      {
        email: normalizedEmail,
        password: normalizedPassword,
      },
      {
        onSuccess: (data: any) => {
          router.push("/home");
          setLoading(false);
        },
        onError: (err: any) => {
          showToast("error", "Something went wrong. Please try again.");
          setLoading(false);
        },
      }
    );
  }, [email, password, router]);

  // set password & login
  const setPasswordAndLogin = useCallback(async () => {
    if (!password || password.length < 6) {
      // showError?.("Password should be at least 6 characters.");
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
        // showError?.(data?.message || "Unable to set password.");
        return;
      }

      // success?.("Password set. Logging in…");
      router.push("/home");
    } catch (err) {
      setLoading(false);
      // showError?.("Server error setting password.");
    }
  }, [email, password, router]);

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
      // success?.("Logged in (demo). Redirecting…");
      setTimeout(() => {
        setLoading(false);
        router.push("/home");
      }, 400);
      return;
    }

    setLoading(false);
    const msg = "Invalid credentials.";
    setErrorMessage(msg);
    // showError?.(msg);
  }, [email, password, router]);

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  const handleForbidden = (data: any) => {
    switch (data?.reason) {
      case "PASSWORD_NOT_SET":
        showToast("error", "Your account exists but no password is set.");
        setStep("setPassword");
        break;

      case "EMAIL_NOT_VERIFIED":
        showToast("error", "Please verify your email first.");
        setStep("otp");
        break;

      case "ACCOUNT_SUSPENDED":
        setLoading(false);
        showToast(
          "error",
          "Your account is temporarily suspended. Contact support."
        );
        break;

      case "USER_INACTIVE":
        setLoading(false);
        showToast(
          "error",
          "Your account is temporarily not active. Contact support."
        );
        break;

      default:
        showToast("error", "You’re not allowed to login at the moment.");
    }
  };

  // UI rendering by step
  return (
    <>
      <Loader show={loading || otpLoading} message={loadingMessage} />

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
                PrepBuddy
                <sup className="ml-1 text-sm font-semibold text-yellow-500 align-super">
                  AI
                </sup>
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

                  {step === "setPassword" && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-600">
                        {"Confim password"}
                      </label>
                      <InputWithIcon
                        name="password"
                        autoComplete={"new-password"}
                        icon={<LockClosedIcon className="h-5 w-5" />}
                        type="password"
                        placeholder={"confirm password"}
                        value={password}
                        onChange={handlePasswordChange}
                      />
                    </div>
                  )}

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

              {step === "profile" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Full Name
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <InputWithIcon
                        name="firstName"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFirstName(e.target.value)
                        }
                        icon={<span className="text-gray-400">👤</span>}
                      />

                      <InputWithIcon
                        name="lastName"
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setLastName(e.target.value)
                        }
                        icon={<span className="text-gray-400">👤</span>}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Phone Number
                    </label>
                    <InputWithIcon
                      name="phone"
                      placeholder="9876543210"
                      value={phoneNumber}
                      onChange={(e: any) => setPhoneNumber(e.target.value)}
                      icon={<span className="text-gray-400">📞</span>}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Location
                    </label>
                    <InputWithIcon
                      name="location"
                      placeholder="Mumbai, India"
                      value={location}
                      onChange={(e: any) => setLocation(e.target.value)}
                      icon={<span className="text-gray-400">📍</span>}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={submitProfileDetails}
                    className="w-full mt-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-3 rounded-xl font-semibold"
                    disabled={loading}
                  >
                    Continue
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
