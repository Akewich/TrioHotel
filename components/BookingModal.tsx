// components/BookingConfirmedModal.tsx
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

// Default Of function
export default function BookingConfirmedModal({
  isOpen,
  onClose,
  roomName = "Sunset Lagoon",
  checkIn = "30/02/2025",
  checkOut = "2/03/2025",
  guests = "1 guest",
  roomType = "Standard Room",
  cost = "$14",
  tax = "$5",
  total = "$19",
}: {
  isOpen: boolean;
  onClose: () => void;
  roomName?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
  roomType?: string;
  cost?: string;
  tax?: string;
  total?: string;
}) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Success Icon */}
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 6v-8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2z"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Your stay has been successfully booked. Get ready for an unforgettable
          experience!
        </p>

        {/* Room Info */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
            <Image
              src="/images/standard/std1.png" // Replace with actual room image
              alt="Room"
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div className="text-left">
            <h2 className="font-semibold text-gray-900">{roomName}</h2>
            <p className="text-sm text-gray-500">
              Check-in: {checkIn} • Check-out: {checkOut}
            </p>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="space-y-3 mb-6 text-left">
          <div className="flex justify-between">
            <span className="text-gray-600">Guests:</span>
            <span className="font-medium">{guests}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Type Room:</span>
            <span className="font-medium">{roomType}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200">
            <span className="text-gray-600">Cost:</span>
            <span className="font-medium">{cost}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax:</span>
            <span className="font-medium">{tax}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>{total}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              onClose();
              router.push("/my-bookings");
            }}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
          >
            View Booking
          </button>
          <button
            onClick={() => {
              onClose();
              router.push("/showrooms");
            }}
            className="flex-1 py-2 px-4 bg-[#AD8054] hover:bg-[#ddbc9b] text-white rounded-xl font-medium transition-colors"
          >
            Explore More Stays
          </button>
        </div>
      </div>
    </div>
  );
}
