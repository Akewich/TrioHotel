"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import logo from "../public/images/Logo.png";
import Image from "next/image";

const links = [
  { name: "home", path: "/" },
  { name: "rooms", path: "/showrooms" },
  { name: "promotions", path: "/promotion" },
  { name: "profile", path: "/profile" },
];

const authLinks = [
  { name: "login", path: "/login" },
  // { name: "register", path: "/register" },
];

const Navbar = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Function to check if current path is a protected route
  const isProtectedRoute = (path: any) => {
    // Protected routes - only accessible when authenticated
    const protectedRoutes = [
      "/profile",
      "/profile/", // Handle trailing slash
      "/rooms/", // This will match /rooms/anything
    ];

    return protectedRoutes.some(
      (route) => path === route || path.startsWith(route)
    );
  };

  // Function to check if current path is an auth route
  const isAuthRoute = (path: any) => {
    const authRoutes = ["/login", "/register"];
    return authRoutes.includes(path);
  };

  // Don't handle redirects in Navbar - handle them in individual pages instead
  // This prevents conflicts with dynamic routes like /rooms/[id]

  return (
    <header className="py-8 xl:py-12">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/">
          <Image src={logo} alt="Sunset Lagoon" width={50} height={50} />
        </Link>

        {/* Center: Main links */}
        <nav className="flex gap-8">
          {links.map((link) => {
            // Hide profile link if not authenticated
            if (link.path === "/profile" && status !== "authenticated") {
              return null;
            }
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`capitalize font-medium px-4 py-2 rounded-xl transition-all duration-300 ease-in-out
    ${
      pathname === link.path ||
      (link.path === "/rooms" && pathname.startsWith("/rooms/"))
        ? "text-white bg-[#AD8054] border border-[#AD8054] shadow-md hover:bg-[#c99666]"
        : "text-[#AD8054] border border-transparent hover:text-[#d4883c] hover:border-[#d4883c] hover:bg-[#f9f3ef]"
    }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: Auth links or user info */}
        {status === "loading" ? (
          <div className="flex gap-6">
            <span className="capitalize font-medium">Loading...</span>
          </div>
        ) : status === "unauthenticated" ? (
          <div className="flex gap-6">
            {authLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`capitalize font-medium px-4 py-2 hover:text-[#AD8054] transition-all duration-300 ease-in-out  ${
                  pathname === link.path
                    ? "text-[#AD8054] border-b-2 border-[#AD8054] hover:text-[#d4883c] hover:border-[#d4883c]"
                    : "text-[#AD8054] border border-transparent rounded-xl hover:text-[#d4883c] hover:border-[#d4883c] hover:bg-[#f9f3ef]"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        ) : status === "authenticated" && session ? (
          <div className="flex items-center gap-2">
            <span className="capitalize text-emerald-400 font-medium">
              Welcome,{" "}
              {session.user?.name ||
                session.user?.email?.split("@")[0] ||
                "User"}
            </span>
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default Navbar;
