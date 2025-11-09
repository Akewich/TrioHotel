"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    status === "authenticated" &&
    session && (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 pt-[120px] max-w-6xl">
          {/* Profile Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center text-white text-2xl font-semibold flex-shrink-0">
                {getInitials(
                  session.user.name ||
                    session.user.username ||
                    session.user.email ||
                    "U"
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {session.user.name || session.user.username || "Guest User"}
                </h1>
                <p className="text-gray-600 mb-4">{session.user.email}</p>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Total Bookings</span>
                    <p className="font-semibold text-gray-900">
                      {bookings.length}
                    </p>
                  </div>
                  <div className="border-l border-gray-200 pl-4">
                    <span className="text-gray-500">Status</span>
                    <p className="font-semibold text-gray-900">
                      {session.user.role === "admin" ? "Admin" : "Guest"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => router.push("/showrooms")}
                  className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  New Booking
                </button>
                {/* <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                >
                  Sign Out
                </button> */}
              </div>
            </div>
          </div>

          {/* Bookings Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Your Bookings</h2>
              {bookings.length > 0 && (
                <button
                  onClick={getUserBookings}
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Refresh
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
              </div>
            ) : error ? (
              <div className="bg-white border border-red-200 rounded-xl p-8 text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={getUserBookings}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : bookings.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No bookings yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start your journey by booking a room
                </p>
                <button
                  onClick={() => router.push("/showrooms")}
                  className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Browse Rooms
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((booking, index) => (
                  <div
                    key={booking._id || `booking-${index}`}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="text-lg font-semibold text-[#ad8054]">
                            Room #{booking.roomNumber}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {booking.roomType}
                          </p>
                        </div>
                        {booking.bookingStatus && (
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-medium ${
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
                    </div>

                    {/* Details */}
                    <div className="p-6 space-y-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Check-in</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(booking.checkIn)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1">Check-out</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(booking.checkOut)}
                        </p>
                      </div>

                      <div className="flex justify-between pt-3 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Guests</p>
                          <p className="text-sm font-medium text-gray-900">
                            {booking.guests}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">Duration</p>
                          <p className="text-sm font-medium text-gray-900">
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
                        <p className="text-xs text-gray-400 pt-3 border-t border-gray-100">
                          Booked {formatDate(booking.createdAt)}
                        </p>
                      )}
                    </div>

                    {/* Uncomment for cancel button */}
                    {/* <div className="px-6 pb-6">
                      <button
                        onClick={() => cancelBooking(booking._id)}
                        disabled={cancellingId === booking._id}
                        className={`w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                          cancellingId === booking._id
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gray-900 hover:bg-gray-800 text-white"
                        }`}
                      >
                        {cancellingId === booking._id
                          ? "Cancelling..."
                          : "Cancel Booking"}
                      </button>
                    </div> */}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
}

export default ProfilePage;
