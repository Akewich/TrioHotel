"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye } from "@deemlol/next-icons";
import { EyeOff } from "@deemlol/next-icons";
import Image from "next/image";
import loginImage from "@/public/images/LoginRegiserBG.png";
// import loginImage from "@/public/images/bg1.png";
import logo from "@/public/images/Logo.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
        setIsLoading(false);
      } else {
        setSuccess(true);
        console.log("Logged in successfully");

        // Redirect after showing success message
        setTimeout(() => {
          router.push("/profile");
        }, 1000);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#94806D] gap-6 p-4 md:p-6 md:pt-30">
      {/* Left side – Picture */}
      <div className="w-full md:w-1/2 flex justify-center items-start">
        <div className="w-full md:aspect-square relative rounded-2xl overflow-hidden">
          <Image
            src={loginImage}
            alt="Login Image"
            fill
            className="h-full w-full object-bottom md:object-cover"
            priority
          />
        </div>
      </div>
      {/* Right side – Form */}
      <div className="w-full h-auto md:w-1/2 md:h-1/2 flex items-center justify-start bg-white rounded-2xl p-4 md:p-30">
        <div className="w-full max-w-md">
          <Image
            src={logo}
            alt="Logo"
            width={70}
            height={47}
            className="mb-6"
          />

          <h2 className="text-5xl font-bold mb-3 text-start text-gray-900">
            Hello, <br />
            Welcome Back!
          </h2>
          <p className="text-sm font-bold text-gray-400 mb-9">
            Get ready for your next peaceful stay.
          </p>
          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 animate-in fade-in duration-200">
              <svg
                className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2 animate-in fade-in duration-200">
              <svg
                className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-green-700 text-sm">Login successful! ...</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || success}
                required
                className="w-full px-3 py-2 rounded-xl focus:outline-none mt-1 border border-gray-400 rad disabled:opacity-50 disabled:cursor-not-allowed transition"
              />
            </div>

            <div className="mb-3">
              <label className="block text-gray-700 mb-2">Password:</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading || success}
                  required
                  className="w-full px-3 py-2 rounded-xl focus:outline-none   mt-1 border border-gray-400 rad disabled:opacity-50 disabled:cursor-not-allowed transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading || success}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900 focus:outline-none disabled:opacity-50"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-8 flex items-center justify-between">
              <Link
                href="/register"
                className="text-sm text-[#E08429] font-bold hover:underline focus:outline-none"
              >
                Create an account
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading || success}
              className="w-1/2 py-2 bg-[#d4883c] text-white font-semibold rounded hover:bg-[#C0A489] transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {isLoading ? "Logging in..." : success ? "Success!" : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
