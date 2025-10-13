// app/showrooms/RoomCard.tsx
"use client";

import { useRouter } from "next/navigation";
import { Room } from "@/types/rooms";

const getStatusColor = (status: Room["status"]) => {
  switch (status) {
    case "available":
      return "bg-green-100 text-green-800";
    case "reserved":
      return "bg-yellow-100 text-yellow-800";
    case "occupied":
      return "bg-red-100 text-red-800";
    case "maintenance":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price);

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function RoomCard({ room }: { room: Room }) {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/rooms/${room._id}`);
  };

  const handleBookNow = () => {
    // Later: could open booking modal or go to checkout
    alert("Booking flow not implemented yet");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {room.roomType}
            </h3>
            <p className="text-gray-600 font-medium">Room #{room.roomNumber}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
              room.status
            )}`}
          >
            {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
          </span>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Price:</span>
            <span className="font-semibold text-emerald-600">
              {formatPrice(room.price)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Last Updated:</span>
            <span className="text-gray-900">{formatDate(room.updatedAt)}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleViewDetails}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 text-sm font-medium"
            disabled={room.status !== "available"}
          >
            {room.status === "available" ? "View Details" : "Not Available"}
          </button>

          {room.status === "available" && (
            <button
              onClick={handleBookNow}
              className="flex-1 border border-emerald-500 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 py-2 px-4 rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              Book Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
