"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "@deemlol/next-icons";
import loginImage from "@/public/images/LoginRegiserBG.png";
import logo from "@/public/images/Logo.png";
import Image from "next/image";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!username || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      console.log(username, email, password);

      if (res.ok) {
        setUsername("");
        setEmail("");
        setPassword("");
        setSuccess(true);
        router.push("/login");
      } else {
        const err = await res.json();
        setIsLoading(false);

        alert(err.message || "Registration failed.");
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#94806D] border border-gray-200 rounded-lg shadow p-6 pt-30">
      {/* Left side – Picture */}
      <div className="hidden md:flex md:w-1/2 justify-center items-center">
        <Image
          src={loginImage}
          alt="Login Image"
          className="w-full h-min pr-4 object-cover"
          priority
        />{" "}
      </div>

      {/* Right side – Form */}
      <div className="flex w-full md:w-1/2 items-start justify-center p-8 md:p-16 lg:p-24 bg-white rounded-2xl">
        <div className="max-w-screen w-full p-6">
          <Image
            src={logo}
            alt="Logo"
            width={70}
            height={47}
            className="mb-6"
          />

          <h2 className="text-5xl font-bold mb-9 text-start text-gray-900">
            Register
          </h2>
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
              <p className="text-green-700 text-sm">Register successful! ...</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl focus:outline-none mt-1 border border-gray-400 rad disabled:opacity-50 disabled:cursor-not-allowed transition"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || success}
                className="w-full px-3 py-2 rounded-xl focus:outline-none mt-1 border border-gray-400 rad disabled:opacity-50 disabled:cursor-not-allowed transition"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  disabled={isLoading || success}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl focus:outline-none mt-1 border border-gray-400 rad disabled:opacity-50 disabled:cursor-not-allowed transition"
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

            {/* click for login */}
            <div className="mb-4 text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-[#E08429] font-bold hover:underline focus:outline-none"
              >
                Login
              </a>
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
              {isLoading
                ? "Registering in..."
                : success
                ? "Success!"
                : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
