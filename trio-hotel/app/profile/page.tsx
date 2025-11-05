"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";

// Define booking type
type Booking = {
  _id: string;
  email: string;
  roomNumber: string;
  roomType: string;
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
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const { data: session, status } = useSession();
  const router = useRouter();
  const email = session?.user?.email;

  // Fetch bookings
  const getUserBookings = async () => {
    if (!session?.user?.email) return;

    try {
      setLoading(true);
      setError(null);

      const token = (session as any)?.accessToken || (session as any)?.token;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/email/${email}`,
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

      const data = await response.json();
      const userBookings = Array.isArray(data)
        ? data.filter((b: Booking) => b.email === session.user.email)
        : [];

      setBookings(userBookings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  // Cancel booking
  const cancelBooking = async (bookingId: string) => {
    const result = await Swal.fire({
      title: "Cancel Booking?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, cancel it",
      cancelButtonText: "No, keep it",
    });

    if (!result.isConfirmed) return;

    setCancellingId(bookingId);

    try {
      const token = (session as any)?.accessToken || (session as any)?.token;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to cancel booking");
      }

      // Remove from UI
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));

      Swal.fire({
        title: "Cancelled!",
        text: "Your booking has been cancelled.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err instanceof Error ? err.message : "Could not cancel booking",
        icon: "error",
      });
    } finally {
      setCancellingId(null);
    }
  };

  // Load bookings
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      getUserBookings();
    }
  }, [status, session?.user?.email]);

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Format date
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
    const diff = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

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
      <div className="container mx-auto px-4 py-8 pt-[120px] min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">My Profile</h1>

        {/* User Info Card */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="mb-2 text-lg">
              <span className="font-semibold">Name:</span>{" "}
              <span className="text-[#AD8054]">
                {session.user.name || session.user.username || "Guest"}
              </span>
            </p>
            <p className="text-lg">
              <span className="font-semibold">Email:</span>{" "}
              <span className="text-[#AD8054]">{session.user.email}</span>
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-[#AD8054] hover:bg-[#ddbc9b] rounded-xl px-6 py-2 text-white transition-colors font-medium"
          >
            Logout
          </button>
        </div>

        {/* Bookings Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Your Bookings
          </h2>

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
                className="bg-[#AD8054] hover:bg-[#ddbc9b] text-white px-6 py-3 rounded-xl transition-colors font-medium"
              >
                Browse Rooms
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking, index) => (
                <div
                  key={booking._id || `booking-${index}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Room #{booking.roomNumber}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {booking.roomType}
                        </p>
                      </div>
                      {booking.bookingStatus && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
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

                    <div className="space-y-3 text-sm">
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
                        <div>
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
                        <div>
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
                        <div>
                          <p className="font-semibold">Guests</p>
                          <p>
                            {booking.guests} guest
                            {parseInt(booking.guests) !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-200 text-sm">
                        <p className="text-gray-600">
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

                      {booking.createdAt && (
                        <p className="text-xs text-gray-400 mt-3">
                          Booked on: {formatDate(booking.createdAt)}
                        </p>
                      )}
                    </div>

                    {/* <div className="mt-5 flex justify-end">
                      <button
                        onClick={() => cancelBooking(booking._id)}
                        disabled={cancellingId === booking._id}
                        className={`px-5 py-2 rounded-xl text-white font-medium transition-all ${
                          cancellingId === booking._id
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        {cancellingId === booking._id ? (
                          <>
                            <svg
                              className="inline-block animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                            Cancelling...
                          </>
                        ) : (
                          "Cancel Booking"
                        )}
                      </button>
                    </div> */}
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
