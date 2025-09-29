"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const links = [
  {
    name: "home",
    path: "/",
  },

  {
    name: "rooms",
    path: "/room",
  },
  {
    name: "promotions",
    path: "/promotion",
  },
  {
    name: "profile",
    path: "/profile",
  },
];

const authLinks = [
  {
    name: "login",
    path: "/login",
  },
  {
    name: "register",
    path: "/register",
  },
];

const Navbar = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  return (
    <header className="py-8 xl:py-12">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/">
          <h1 className="text-2xl font-semibold">
            Trio Hotel<span className="text-green-600">.</span>
          </h1>
        </Link>
        {/* Center: Main links */}
        <nav className="flex gap-8">
          {links.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`capitalize font-medium hover:text-green-400 transition-all ${
                link.path === pathname &&
                "text-emerald-400 border-b-2 border-accent"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        {/* Right: Auth links */}
        {status === "unauthenticated" && (
          <div className="flex gap-6">
            {authLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`capitalize font-medium hover:text-green-400 transition-all ${
                  link.path === pathname &&
                  "text-emerald-400 border-b-2 border-accent"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
        {status === "authenticated" && session && (
          <div className="flex gap-6">
            {/* welcome */}
            <div className="flex gap-6">welcome,</div>
            <span className="capitalize text-emerald-400 font-medium">
              {session.user.username}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
