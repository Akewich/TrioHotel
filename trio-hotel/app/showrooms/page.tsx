"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Room } from "@/types/rooms"; // Make sure this type matches your API
import SearchBox from "@/components/SearchBox";

export default function ShowRoomPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get search criteria from URL
  const roomTypeParam = searchParams.get("roomType");

  // Fetch all rooms once
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

      const data = await response.json();
      if (Array.isArray(data)) {
        setRooms(data);
      } else {
        throw new Error("Invalid API response: expected an array");
      }
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter rooms whenever rooms or roomTypeParam changes
  useEffect(() => {
    if (rooms.length === 0) return;

    let result = rooms;

    // Filter by room type if provided
    if (roomTypeParam) {
      result = result.filter((room) => room.roomType === roomTypeParam);
    }

    // Only show available rooms
    result = result.filter((room) => room.status === "available");

    setFilteredRooms(result);
  }, [rooms, roomTypeParam]);

  // Fetch rooms on mount
  useEffect(() => {
    fetchRooms();
  }, []);

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
  const getStatusColor = (status: string) => {
    // Only "available" should appear, but keep for safety
    return status === "available"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
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

  const getTitle = () => {
    if (roomTypeParam) {
      return `${roomTypeParam.replace(/_/g, " ")} Rooms`;
    }
    return "Available Rooms";
  };

  const getDescription = () => {
    if (roomTypeParam) {
      return `Browse available ${roomTypeParam.replace(/_/g, " ")} rooms`;
    }
    return "Browse all available rooms ready for booking";
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
          <strong>Error:</strong> {error}
          <button
            onClick={fetchRooms}
            className="ml-4 bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-28">
      <SearchBox />
      <div className="my-10 text-center">
        <h1 className="text-4xl font-bold mb-4">{getTitle()}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">{getDescription()}</p>

        {/* Clear filters button */}
        {roomTypeParam && (
          <button
            onClick={() => router.push("/showrooms")}
            className="mt-4 text-amber-600 hover:text-amber-800 font-medium text-sm flex items-center gap-1 mx-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Clear filters
          </button>
        )}
      </div>

      {filteredRooms.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {roomTypeParam
              ? `No available ${roomTypeParam.replace(/_/g, " ")} rooms found.`
              : "No available rooms at the moment."}
          </p>
          <button
            onClick={() => router.push("/showrooms")}
            className="mt-4 text-amber-600 hover:text-amber-800 font-medium"
          >
            View all room types
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRooms.map((room) => (
            <div
              key={room._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {room.roomType.replace(/_/g, " ")}
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
                    <span className="font-semibold text-amber-600">
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

                <button
                  onClick={() => handleViewRoom(room)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 text-sm font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
