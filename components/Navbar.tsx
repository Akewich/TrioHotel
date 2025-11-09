"use client";
import { useSession, signOut } from "next-auth/react"; // Add signOut
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, useRef } from "react"; // Add useRef
import logo from "../public/images/Logo.png";
import Image from "next/image";
import { MdArrowDropUp } from "react-icons/md";
import { MdArrowDropDown } from "react-icons/md";

const links = [
  { name: "home", path: "/" },
  { name: "rooms", path: "/showrooms" },
  { name: "contact", path: "/contact" },
  { name: "my bookings", path: "/profile" },
  { name: "admin", path: "/admin" },
];

const authLinks = [{ name: "login", path: "/login" }];

const Navbar = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const [scrolled, setScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null); // Add ref for modal

  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fixed: Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  const isTransparentNavbar = isHomePage && !scrolled;
  const headerClasses = `
    fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4
    ${
      isTransparentNavbar
        ? "bg-transparent"
        : "bg-[#FFF6E2] backdrop-blur-sm shadow-sm"
    }
  `;

  return (
    <header className={headerClasses}>
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Left: Logo */}
        <Link href="/">
          <Image src={logo} alt="Sunset Lagoon" width={50} height={50} />
        </Link>

        {/* Center: Main links */}
        <nav className="flex gap-8">
          {links.map((link) => {
            //  If you are not login yet
            if (link.path === "/profile" && status !== "authenticated") {
              return null;
            }

            // If you are not admin
            if (link.path === "/admin") {
              if (
                status !== "authenticated" ||
                session?.user?.role !== "admin"
              ) {
                return null;
              }
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
                className={`capitalize font-medium px-4 py-2 hover:text-[#AD8054] transition-all duration-300 ease-in-out ${
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
          <div className="relative" ref={modalRef}>
            <div
              className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setIsModalOpen(!isModalOpen)}
            >
              <p className="text-[#AD8054]">Hi, </p>
              <span className="capitalize text-[#AD8054] font-extrabold">
                {session.user?.name ||
                  session.user?.email?.split("@")[0] ||
                  "User"}
              </span>
              {isModalOpen ? (
                <MdArrowDropUp className="text-[#AD8054] text-2xl" />
              ) : (
                <MdArrowDropDown className="text-[#AD8054] text-2xl" />
              )}
            </div>

            {/* Dropdown Modal */}
            {isModalOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 w-64 overflow-hidden z-50 animate-fade-in">
                <div className="p-4 border-b border-gray-100 ">
                  <p className="capitalize font-semibold text-gray-800 truncate font">
                    {session.user?.username || "User"}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {session.user?.email}
                  </p>
                </div>

                <div className="p-2">
                  <Link
                    href="/profile"
                    onClick={() => setIsModalOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#FFF6E2] rounded-lg transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="font-medium">My Profile</span>
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setIsModalOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#FFF6E2] rounded-lg transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-medium">My Bookings</span>
                  </Link>

                  <div className="border-t border-gray-100 my-2"></div>

                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Add this CSS for animation */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Navbar;
