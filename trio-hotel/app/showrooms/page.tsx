"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Room } from "@/types/rooms";

export default function ShowRoomPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]); // Array of rooms
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleViewRoom = (room: Room) => {
    const params = new URLSearchParams({
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      price: room.price.toString(),
      status: room.status,
      updatedAt: room.updatedAt,
    });

    // Navigate to rooms/[id] WITH search parameters
    router.push(`/rooms/${room._id}?${params.toString()}`);
  };

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch rooms: ${response.status} ${response.statusText}`
        );
      }

      // This is the CORRECT way to handle the response
      const data = await response.json();
      setRooms(data); // Set the array directly
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

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
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 ">
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
            onClick={fetchRooms}
            className="mt-2 bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-28">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-4">All Rooms</h1>
        <p className="text-gray-600 text-center max-w-2xl mx-auto">
          Browse our complete room inventory with real-time availability
        </p>
      </div>

      {rooms.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No rooms found in the system.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {room.roomType}
                    </h3>
                    <p className="text-gray-600 font-medium">
                      Room #{room.roomNumber}
                    </p>
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
                    <span className="text-gray-900">
                      {formatDate(room.updatedAt)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleViewRoom(room)} // Pass the room object
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 text-sm font-medium"
                    disabled={room.status !== "available"}
                  >
                    {room.status === "available"
                      ? "View Details"
                      : "Not Available"}
                  </button>

                  {room.status === "available" && (
                    <button className="flex-1 border border-emerald-500 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 py-2 px-4 rounded-lg transition-colors duration-200 text-sm font-medium">
                      Book Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
