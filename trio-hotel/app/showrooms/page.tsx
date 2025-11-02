"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Room } from "@/types/rooms"; // Make sure this type matches your API
import SearchBox from "@/components/SearchBox";
import Image from "next/image";

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

  const getRoomImages = (roomType: string): string[] => {
    const imageMap: Record<string, string[]> = {
      Standard: ["/images/standard/std1.png"],
      Deluxe: ["/images/deluxe/dlx1.png"],
      Suite: ["/images/suite/suite1.png"],
      Family: ["/images/family/family1.png"],
      Honeymoon: ["/images/honeymoon/hm1.png"],
    };

    return imageMap[roomType] || ["/images/rooms/default_room.jpg"];
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

    result = result.filter((room) => room.status);

    setFilteredRooms(result);
  }, [rooms, roomTypeParam]);

  // Fetch rooms on mount
  useEffect(() => {
    fetchRooms();
  }, []);

  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const adults = searchParams.get("adults") || "1";
  const children = searchParams.get("children") || "0";
  const roomCount = searchParams.get("room") || "1";
  useEffect(() => {
    console.log("Room Type:", roomTypeParam);
    console.log("Check-in:", checkIn);
    console.log("Adults:", adults);
    console.log("Check-out:", checkOut);
  }, [roomTypeParam, checkIn, checkOut, adults]);

  const handleViewRoom = (room: Room) => {
    const params = new URLSearchParams({
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      price: room.price.toString(),
      status: room.status,
      updatedAt: room.updatedAt,
      checkIn,
      checkOut,
      adults,
      children,
      room: roomCount,
    });
    console.log("Viewing room with params:", params);

    // Navigate to rooms/[id] WITH search parameters
    router.push(`/rooms/${room._id}?${params.toString()}`);
  };
  const getStatusColor = (status: string) => {
    // Only "available" should appear, but keep for safety
    return status === "available"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (checkIn: string, checkOut: string): string => {
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };

    // ถ้าอยู่ในปีเดียวกัน → ไม่ต้องแสดงปีซ้ำ
    if (startDate.getFullYear() === endDate.getFullYear()) {
      const start = startDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const end = endDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return `${start} – ${end}`;
    }

    // ถ้าข้ามปี → แสดงทั้งคู่เต็ม
    return `${startDate.toLocaleDateString(
      "en-US",
      options
    )} – ${endDate.toLocaleDateString("en-US", options)}`;
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
      <SearchBox isHomepage={false} />

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
              className="bg-white rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-48 w-full">
                <Image
                  src={getRoomImages(room.roomType)[0]}
                  alt={`${room.roomType} room`}
                  fill
                  className="object-cover rounded-2xl"
                  priority
                />
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Room Type */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {room.roomType.replace(/_/g, " ")} Room
                    </h3>
                  </div>

                  {/* Status */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      room.status
                    )}`}
                  >
                    {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                  </span>
                </div>

                {/* Room Number + Price */}
                <div className="flex justify-between items-center mb-4">
                  <span className="border text-gray-800 px-3 py-1 rounded-full text-sm">
                    Room #{room.roomNumber}
                  </span>
                  <span className="font-semibold text-amber-600">
                    {formatPrice(room.price)} / day
                  </span>
                </div>

                {/* Date */}
                <span className="text-xs text-gray-500">
                  {formatDate(checkIn, checkOut)}
                </span>

                {/* Book Now Button */}
                <button
                  onClick={() => handleViewRoom(room)}
                  className="w-1/2 flex justify-center bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-2xl transition-colors duration-200 text-sm font-medium mt-4"
                >
                  Book now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
