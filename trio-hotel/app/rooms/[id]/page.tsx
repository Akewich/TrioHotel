"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Room } from "@/types/rooms";

export default function RoomDetailPage() {
  // Single room state (not array)
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const roomNumber = searchParams.get("roomNumber");
    const roomType = searchParams.get("roomType");
    const price = searchParams.get("price");
    const status = searchParams.get("status");
    const updatedAt = searchParams.get("updatedAt");
    // Note: We don't need 'id' from search params since it's in the URL path

    if (roomNumber && roomType && price && status && updatedAt) {
      // Get the ID from the URL path (since you're in /rooms/[id])
      const urlPath = window.location.pathname;
      const id = urlPath.split("/").pop() || "";

      const roomData: Room = {
        _id: id,
        roomNumber,
        roomType,
        price: parseInt(price),
        status: status as Room["status"],
        updatedAt,
      };
      setRoom(roomData);
    }
    setLoading(false);
  }, [searchParams]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: Room["status"]) => {
    switch (status) {
      case "available":
        return "text-green-600 bg-green-50";
      case "reserved":
        return "text-yellow-600 bg-yellow-50";
      case "occupied":
        return "text-red-600 bg-red-50";
      case "maintenance":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => router.push("/showrooms")}
            className="mt-2 bg-gray-500 hover:bg-gray-700 text-white py-1 px-3 rounded text-sm"
          >
            Back to Rooms
          </button>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Room Not Found
        </h2>
        <button
          onClick={() => router.push("/showrooms")}
          className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-6 rounded-lg transition-colors duration-200"
        >
          Back to All Rooms
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <button
        onClick={() => router.push("/showrooms")}
        className="mb-6 text-emerald-600 hover:text-emerald-800 flex items-center gap-2"
      >
        ← Back to All Rooms
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 flex items-center justify-center">
              <span className="text-gray-500 text-lg">
                Room {room.roomNumber} Image
              </span>
            </div>
          </div>

          <div className="md:w-2/3">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {room.roomType}
                </h1>
                <p className="text-xl text-gray-600 font-medium">
                  Room #{room.roomNumber}
                </p>
                <p className="text-sm text-gray-500 mt-1">ID: {room._id}</p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                  room.status
                )}`}
              >
                {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
              </span>
            </div>

            <div className="space-y-6 mb-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-3 text-lg">
                  Room Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Price per night</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {formatPrice(room.price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="text-lg font-semibold capitalize">
                      {room.status}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-3 text-lg">
                  Last Updated
                </h3>
                <p className="text-gray-900 text-lg">
                  {formatDate(room.updatedAt)}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {room.status === "available" ? (
                <>
                  <button className="bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-8 rounded-lg transition-colors duration-200 font-medium flex-1">
                    Book Now
                  </button>
                  <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-8 rounded-lg transition-colors duration-200 font-medium flex-1">
                    Check Availability
                  </button>
                </>
              ) : (
                <button className="bg-gray-300 text-gray-500 py-3 px-8 rounded-lg font-medium flex-1 cursor-not-allowed">
                  {room.status === "reserved"
                    ? "Reserved"
                    : room.status === "occupied"
                    ? "Occupied"
                    : "Under Maintenance"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
