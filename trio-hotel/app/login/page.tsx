"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);

  const Router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result?.error) {
        setError("Invalid email or password");
      } else {
        // Login successful, redirect to profile page
        Router.push("/profile");
        console.log("Logged in successfully");
      }
    } catch (error) {
      console.error;
    }
  };

  return (
    <div className="min-h-full md:flex border border-gray-200 rounded-lg shadow p-6">
      {/* Left side – Picture */}
      <div className="hidden md:flex md:w-1/2 bg-gray-200">
        <img
          src="/hotel.jpg"
          alt="Hotel"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side – Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full border border-gray-200 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
            Login
          </h2>

          {error && (
            <div className="mb-4 text-red-600 text-center text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email:</label>
              <input
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 rounded focus:outline-none mt-1 bg-gray-100"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Password:</label>
              <input
                type="password"
                value={password}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 rounded focus:outline-none mt-1 bg-gray-100"
              />
            </div>

            <div className="mb-8 flex items-center justify-between">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Remember me</span>
              </label>
              <Link
                href="/register"
                className="text-sm text-blue-600 hover:underline focus:outline-none"
              >
                Create an account
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-gray-800 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
