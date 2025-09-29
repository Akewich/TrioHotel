"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      alert("Please fill in all fields");
      return;
    }
    const API = "http://localhost:8000/register";
    console.log(username, email, password);
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (res.ok) {
        setUsername("");
        setEmail("");
        setPassword("");
        router.push("/login");
      } else {
        const err = await res.json();
        alert(err.message || "Registration failed.");
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred.");
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
        <div className="max-w-md w-full p-6 border border-gray-200 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
            Register
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Username:</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 rounded focus:outline-none mt-1 bg-gray-100"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email:</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 rounded focus:outline-none mt-1 bg-gray-100"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Password:</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 rounded focus:outline-none mt-1 bg-gray-100"
              />
            </div>

            {/* click for login */}
            <div className="mb-4 text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-600 hover:underline focus:outline-none"
              >
                Login
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-gray-800 transition"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
