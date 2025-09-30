"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import React, { useEffect } from "react";

function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  return (
    status === "authenticated" &&
    session && (
      <div>
        <h1 className="text-2xl font-bold mb-4">Profile Page</h1>
        <div className="bg-white p-5 rounded-2xl shadow-lg">
          <p className="mb-2">
            This is your username:{" "}
            <span className="text-emerald-500">
              {session.user.username || "No name provided"}
            </span>
          </p>
          <p className="mb-4">
            This is your email:{" "}
            <span className="text-emerald-500">{session.user.email}</span>
          </p>
          <button
            onClick={() => signOut({ callbackUrl: "/" })} // Fixed signOut usage
            className="bg-emerald-500 rounded-2xl w-fit h-full px-5 py-2 text-white hover:bg-emerald-300 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    )
  );
}

export default ProfilePage;
