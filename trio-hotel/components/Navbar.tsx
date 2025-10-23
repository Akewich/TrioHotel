"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import logo from "../public/images/Logo.png";
import Image from "next/image";

const links = [
  { name: "home", path: "/" },
  { name: "rooms", path: "/showrooms" },
  // { name: "promotions", path: "/promotion" },
  { name: "contact", path: "/contact" },
  { name: "profile", path: "/profile" },
];

const authLinks = [
  { name: "login", path: "/login" },
  // { name: "register", path: "/register" },
];

const Navbar = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const [scrolled, setScrolled] = useState(false);
  const isHomePage = pathname === "/";
  // Function to check if current path is a protected route
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isTransparentNavbar = isHomePage && !scrolled;
  const headerClasses = `
    fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4
    ${
      isTransparentNavbar
        ? "bg-transparent"
        : "bg-[#FFF6E2] backdrop-blur-sm shadow-sm"
    }
  `;
  // This prevents conflicts with dynamic routes like /rooms/[id]

  return (
    <header className={headerClasses}>
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
            <p className="text-[#AD8054] ">Hi, </p>
            <span className="capitalize text-[#AD8054] font-extrabold">
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
