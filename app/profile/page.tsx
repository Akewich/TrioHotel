"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
// Define booking type
type Booking = {
  _id: string;
  email: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  bookingStatus?: string;
  createdAt?: string;
};

function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const { data: session, status } = useSession();
  const router = useRouter();

  const getUserBookings = async () => {
    if (!session?.user?.email) return;

    try {
      setLoading(true);
      setError(null);

      const token = (session as any)?.accessToken || (session as any)?.token;

      console.log("Fetching bookings for:", session.user.email);
      console.log("Token:", token ? "exists" : "missing");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings`, // Fixed typo: bookins -> bookings
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch bookings");
      }

      const bookingsData = await response.json();
      console.log("Bookings Data:", bookingsData);

      // Filter bookings for current user if backend returns all bookings
      const userBookings = Array.isArray(bookingsData)
        ? bookingsData.filter(
            (booking: Booking) => booking.email === session.user.email
          )
        : [];

      setBookings(userBookings);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching your bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      getUserBookings();
    }
  }, [status, session?.user?.email]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate nights
  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const cancleBooking = () => {};

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    status === "authenticated" &&
    session && (
      <div className="container mx-auto px-4 py-8 pt-[120px]  min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Profile Page</h1>

        {/* User Info Card */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
          <p className="mb-2 text-lg">
            <span className="font-semibold">Username:</span>{" "}
            <span className="text-[#AD8054]">
              {session.user.username || "No name provided"}
            </span>
          </p>
          <p className="mb-4 text-lg">
            <span className="font-semibold">Email:</span>{" "}
            <span className="text-[#AD8054]">{session.user.email}</span>
          </p>
          {/* <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-[#AD8054] hover:bg-[#ddbc9b] rounded-xl px-6 py-2 text-white transition-colors"
          >
            Logout
          </button> */}
        </div>

        {/* Bookings Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Your Bookings</h2>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AD8054]"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-600 font-medium">{error}</p>
              <button
                onClick={getUserBookings}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-lg">
              <p className="text-gray-500 text-lg mb-4">
                You don't have any bookings yet.
              </p>
              <button
                onClick={() => router.push("/showrooms")}
                className="bg-[#AD8054] hover:bg-[#ddbc9b] text-white px-6 py-3 rounded-xl transition-colors"
              >
                Browse Rooms
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        Room #{booking.roomNumber}
                      </h3>
                      {booking.bookingStatus && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.bookingStatus === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : booking.bookingStatus === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {booking.bookingStatus}
                        </span>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700">
                        <svg
                          className="w-5 h-5 mr-2 text-[#AD8054]"
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
                        <div className="text-sm">
                          <p className="font-semibold">Check-in</p>
                          <p>{formatDate(booking.checkIn)}</p>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-700">
                        <svg
                          className="w-5 h-5 mr-2 text-[#AD8054]"
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
                        <div className="text-sm">
                          <p className="font-semibold">Check-out</p>
                          <p>{formatDate(booking.checkOut)}</p>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-700">
                        <svg
                          className="w-5 h-5 mr-2 text-[#AD8054]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <div className="text-sm">
                          <p className="font-semibold">Guests</p>
                          <p>
                            {booking.guests} guest
                            {parseInt(booking.guests) !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Duration:</span>{" "}
                          {calculateNights(booking.checkIn, booking.checkOut)}{" "}
                          night
                          {calculateNights(
                            booking.checkIn,
                            booking.checkOut
                          ) !== 1
                            ? "s"
                            : ""}
                        </p>
                      </div>
                    </div>
                    {booking.createdAt && (
                      <p className="text-xs text-gray-400 mt-4">
                        Booked on: {formatDate(booking.createdAt)}
                      </p>
                    )}
                    <div className="flex justify-end items-start mt-4">
                      <button className="bg-red-400 hover:bg-red-300 rounded-xl px-6 py-2 text-white transition-colors">
                        Cancel Booking
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  );
}

export default ProfilePage;
