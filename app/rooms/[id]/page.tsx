"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Room } from "@/types/rooms";
import Swal from "sweetalert2";
import bg from "@/public/images/background.jpg";
import { useSession } from "next-auth/react";
import localFont from "next/font/local";
import { Charis_SIL } from "next/font/google";
// Icons
import { GiForkKnifeSpoon } from "react-icons/gi";
import { FaCoffee } from "react-icons/fa";
import { LiaBedSolid } from "react-icons/lia";
import { GiWindow } from "react-icons/gi";
import { IoTvOutline } from "react-icons/io5";
import { LuSofa } from "react-icons/lu";
import { GiKnifeFork } from "react-icons/gi";
import { TbAirConditioning } from "react-icons/tb";
import { BiCabinet } from "react-icons/bi";
import { PiShower } from "react-icons/pi";
import { MdTableRestaurant } from "react-icons/md";
import { RiSafe3Line } from "react-icons/ri";
import { FaGlassCheers } from "react-icons/fa";
import { MdOutlineBathtub } from "react-icons/md";
import { MdOutlineLocationOn } from "react-icons/md";
import { MdArrowLeft } from "react-icons/md";
import { TbBeach } from "react-icons/tb";

// Amenity definitions
type Amenity = {
  icon: React.ReactNode;
  category: string;
  description: string;
};

// font Charis SIL
const charis = Charis_SIL({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

// Room descriptions
const ROOM_DESCRIPTIONS: Record<string, string> = {
  Standard:
    "This room accommodates up to 2 guests features 1 bed and 1 bathroom. (Size: 20–25 sqm)\nComplimentary breakfast and coffee are available at the central lounge. The beach is located nearby.",
  Deluxe:
    "This room accommodates up to 3 guests features 1 large bed and 1 bathroom. (Size: 30–35 sqm)\nComplimentary breakfast and coffee are available at the central lounge. The beach is located nearby.",
  Suite:
    "This room accommodates up to 4 guests features 1 king-size bed and 1 bathroom. (Size: 40–45 sqm)\nComplimentary breakfast and coffee are available at the central lounge. The beach is located nearby.",
  Family:
    "This room accommodates up to 5 guests features 2 large beds and 1 bathroom. (Size: 50–55 sqm)\nComplimentary breakfast and coffee are available at the central lounge. The beach is located nearby.",
  Honeymoon:
    "This room accommodates up to 2 guests features 1 king-size bed, a jacuzzi, and 1 bathroom. (Size: 45–50 sqm)\nComplimentary breakfast and coffee are available at the central lounge. The beach is located nearby.",
};

const getAmenities = (roomType: string): Amenity[] => {
  const commonAmenities: Amenity[] = [
    {
      icon: (
        <LiaBedSolid size={36} className="text-[#AD8054]" aria-hidden="true" />
      ),
      category: "Bedroom",
      description:
        roomType === "Standard"
          ? "Twin beds, pillows, bed sheets, blanket"
          : "King-size bed, plush pillows, premium bed linens",
    },
    {
      icon: (
        <IoTvOutline size={36} className="text-[#AD8054]" aria-hidden="true" />
      ),
      category: "Entertainment",
      description:
        roomType === "Standard"
          ? "Smart TV, complimentary Wi-Fi"
          : "Smart TV, sound bar, complimentary Wi-Fi, telephone",
    },
    {
      icon: (
        <TbAirConditioning
          size={36}
          className="text-[#AD8054]"
          aria-hidden="true"
        />
      ),
      category: "Comfort",
      description:
        roomType === "Standard"
          ? "Air conditioning, heating"
          : "Air conditioning, heating, ceiling fan",
    },
    {
      icon: (
        <RiSafe3Line size={36} className="text-[#AD8054]" aria-hidden="true" />
      ),
      category: "Storage",
      description:
        roomType === "Standard"
          ? "Wardrobe, safety deposit box"
          : "Spacious wardrobe, luggage rack, safety deposit box",
    },
    {
      icon: (
        <PiShower size={36} className="text-[#AD8054]" aria-hidden="true" />
      ),
      category: "Bathroom",
      description:
        roomType === "Standard"
          ? "Hot shower, toothbrush set, vanity mirror"
          : "Hot shower, bathtub, premium toiletries, hairdryer",
    },
  ];

  switch (roomType) {
    case "Standard":
      return commonAmenities;
    case "Deluxe":
      return [
        ...commonAmenities,
        {
          icon: (
            <GiWindow size={36} className="text-[#AD8054]" aria-hidden="true" />
          ),
          category: "View & Ambience",
          description:
            "Balcony with scenic view, blackout curtains, bedside lamps",
        },
        {
          icon: (
            <MdTableRestaurant
              size={36}
              className="text-[#AD8054]"
              aria-hidden="true"
            />
          ),
          category: "Work Space",
          description: "Work desk, ergonomic chair, desk lamp, power outlets",
        },
      ];
    case "Suite":
      return [
        ...commonAmenities.filter(
          (a) => !["Storage", "Bathroom"].includes(a.category)
        ),
        {
          icon: (
            <GiWindow size={36} className="text-[#AD8054]" aria-hidden="true" />
          ),
          category: "View & Ambience",
          description:
            "Balcony with scenic view, blackout curtains, bedside lamps",
        },
        {
          icon: (
            <LuSofa size={36} className="text-[#AD8054]" aria-hidden="true" />
          ),
          category: "Living Area",
          description:
            "Separate seating area with sofa, coffee table, and armchairs",
        },
        {
          icon: (
            <BiCabinet
              size={36}
              className="text-[#AD8054]"
              aria-hidden="true"
            />
          ),
          category: "Storage",
          description: "Spacious wardrobe, luggage rack, safety deposit box",
        },
        {
          icon: (
            <PiShower size={36} className="text-[#AD8054]" aria-hidden="true" />
          ),
          category: "Bathroom",
          description: "Hot shower, bathtub, premium toiletries, hairdryer",
        },
        {
          icon: (
            <MdTableRestaurant
              size={36}
              className="text-[#AD8054]"
              aria-hidden="true"
            />
          ),
          category: "Work Space",
          description: "Work desk, ergonomic chair, desk lamp, power outlets",
        },
        {
          icon: (
            <GiKnifeFork
              size={36}
              className="text-[#AD8054]"
              aria-hidden="true"
            />
          ),
          category: "Dining",
          description:
            "Mini fridge, electric kettle, complimentary bottled water",
        },
      ];
    case "Family":
      return [
        ...commonAmenities,
        {
          icon: (
            <GiWindow size={36} className="text-[#AD8054]" aria-hidden="true" />
          ),
          category: "View & Ambience",
          description:
            "Balcony with scenic view, blackout curtains, bedside lamps",
        },
        {
          icon: (
            <MdTableRestaurant
              size={36}
              className="text-[#AD8054]"
              aria-hidden="true"
            />
          ),
          category: "Kid Friendly",
          description:
            "Crib upon request, child-safe amenities, family board games",
        },
        {
          icon: (
            <LuSofa size={36} className="text-[#AD8054]" aria-hidden="true" />
          ),
          category: "Living Area",
          description:
            "Separate seating area with sofa, coffee table, and armchairs",
        },
        {
          icon: (
            <GiKnifeFork
              size={36}
              className="text-[#AD8054]"
              aria-hidden="true"
            />
          ),
          category: "Dining",
          description:
            "Mini fridge, electric kettle, complimentary bottled water",
        },
      ];
    case "Honeymoon":
      return [
        {
          icon: (
            <LiaBedSolid
              size={36}
              className="text-[#AD8054]"
              aria-hidden="true"
            />
          ),
          category: "Bedroom",
          description: "King-size bed, plush pillows, premium bed linens",
        },
        {
          icon: (
            <FaGlassCheers
              size={36}
              className="text-[#AD8054]"
              aria-hidden="true"
            />
          ),
          category: "Romantic Touches",
          description: "Complimentary champagne, rose petals, mood lighting",
        },
        {
          icon: (
            <GiWindow size={36} className="text-[#AD8054]" aria-hidden="true" />
          ),
          category: "View & Ambience",
          description:
            "Balcony with scenic view, blackout curtains, bedside lamps",
        },
        {
          icon: (
            <IoTvOutline
              size={36}
              className="text-[#AD8054]"
              aria-hidden="true"
            />
          ),
          category: "Entertainment",
          description: "Smart TV, sound bar, complimentary Wi-Fi, telephone",
        },
        {
          icon: (
            <GiKnifeFork
              size={36}
              className="text-[#AD8054]"
              aria-hidden="true"
            />
          ),
          category: "Dining",
          description:
            "In-room dining menu, mini fridge, electric kettle, bottled water",
        },
        {
          icon: (
            <TbAirConditioning
              size={36}
              className="text-[#AD8054]"
              aria-hidden="true"
            />
          ),
          category: "Comfort",
          description: "Air conditioning, heating, ceiling fan",
        },
        {
          icon: (
            <BiCabinet
              size={36}
              className="text-[#AD8054]"
              aria-hidden="true"
            />
          ),
          category: "Storage",
          description: "Spacious wardrobe, luggage rack, safety deposit box",
        },
        {
          icon: (
            <MdOutlineBathtub
              size={36}
              className="text-[#AD8054]"
              aria-hidden="true"
            />
          ),
          category: "Bathroom",
          description: "Jacuzzi tub, hot shower, premium toiletries, hairdryer",
        },
      ];
    default:
      return commonAmenities;
  }
};

// Image paths
const getRoomImages = (roomType: string): string[] => {
  const imageMap: Record<string, string[]> = {
    Standard: [
      "/images/standard/std1.png",
      "/images/standard/std2.png",
      "/images/standard/std3.png",
      "/images/standard/std4.png",
    ],
    Deluxe: [
      "/images/deluxe/dlx1.png",
      "/images/deluxe/dlx2.png",
      "/images/deluxe/dlx3.png",
      "/images/deluxe/dlx4.png",
    ],
    Suite: [
      "/images/suite/suite1.png",
      "/images/suite/suite2.png",
      "/images/suite/suite3.png",
      "/images/suite/suite4.png",
    ],
    Family: [
      "/images/family/family1.png",
      "/images/family/family2.png",
      "/images/family/family3.png",
      "/images/family/family4.png",
    ],
    Honeymoon: [
      "/images/honeymoon/hm1.png",
      "/images/honeymoon/hm2.png",
      "/images/honeymoon/hm3.png",
      "/images/honeymoon/hm4.png",
    ],
  };
  return imageMap[roomType] || ["/images/standard/std1.png"];
};

export default function RoomDetailPage() {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSecondModal, setIsSecondModal] = useState(false);
  const [isThirdModal, setIsThirdModal] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [modalView, setModalView] = useState<"summary" | "success">("summary");
  const [isModalLogin, setIsModalLogin] = useState(false);
  const [localAdults, setLocalAdults] = useState(room?.adults || 1);
  const [localChildren, setLocalChildren] = useState(room?.children || 0);
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();

  useEffect(() => {
    const roomNumber = searchParams.get("roomNumber");
    const roomType = searchParams.get("roomType");
    const price = searchParams.get("price");
    const status = searchParams.get("status");
    const updatedAt = searchParams.get("updatedAt");
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const adults = searchParams.get("adults");
    const children = searchParams.get("children");
    const roomCount = searchParams.get("room");

    if (roomNumber && roomType && price && status && updatedAt) {
      const id = window.location.pathname.split("/").pop() || "";
      setRoom({
        _id: id,
        roomNumber,
        roomType,
        price: parseInt(price),
        status: status as Room["status"],
        updatedAt,
        checkIn: checkIn ? new Date(checkIn).toISOString() : undefined,
        checkOut: checkOut ? new Date(checkOut).toISOString() : undefined,
        adults: adults ? parseInt(adults) : undefined,
        children: children ? parseInt(children) : undefined,
        roomCount: roomCount ? parseInt(roomCount) : undefined,
      });
    }
    setLoading(false);
  }, [searchParams]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

  const getStatusColor = (status: Room["status"]) => {
    const base = "px-4 py-2 rounded-full text-sm font-medium border";
    switch (status) {
      case "available":
        return `${base} text-green-600 bg-green-50 border-green-600`;
      case "reserved":
        return `${base} text-yellow-600 bg-yellow-50 border-yellow-600`;
      case "occupied":
        return `${base} text-red-600 bg-red-50 border-red-600`;
      case "maintenance":
        return `${base} text-gray-600 bg-gray-50 border-gray-600`;
      default:
        return `${base} text-gray-600 bg-gray-50 border-gray-600`;
    }
  };

  // Format date
  const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleLogin = () => {
    setIsModalLogin(true);
  };

  const handleBooking = async () => {
    if (!session?.user?.email) {
      Swal.fire({
        title: "Login Required",
        text: "Please sign in to book a room.",
        icon: "warning",
        confirmButtonColor: "#AD8054",
      });
      setIsModalLogin(true);
      return;
    }

    if (!room || room.status !== "available") {
      Swal.fire({
        title: "Room Unavailable",
        text: "This room is not available for booking.",
        icon: "error",
        confirmButtonColor: "#AD8054",
      });
      return;
    }
    // update room with the new value
    const updatedRoom = {
      ...room!,
      adults: localAdults,
      children: localChildren,
    };
    setRoom(updatedRoom);

    if (!room.checkIn || !room.checkOut) {
      Swal.fire({
        title: "Missing Dates",
        text: "Please select check-in and check-out dates.",
        icon: "warning",
        confirmButtonColor: "#AD8054",
      });
      return;
    }

    if (!room.adults || room.adults < 1) {
      Swal.fire({
        title: "Missing Guest Information",
        text: "Please specify the number of guests.",
        icon: "warning",
        confirmButtonColor: "#AD8054",
      });
      return;
    }

    setIsModalOpen(true);
    setIsSecondModal(true);
    setIsThirdModal(true);
    setModalView("summary");
  };

  const formatFloor = (roomNumber: string): string => {
    if (!roomNumber || roomNumber.length < 2) return "Ground Floor";
    const floorStr = roomNumber.slice(0, -2);
    if (!floorStr) return "Ground Floor";
    const floorNum = parseInt(floorStr, 10);
    if (floorNum === 0 || isNaN(floorNum)) return "Ground Floor";

    const suffixes = ["th", "st", "nd", "rd"];
    const v = floorNum % 100;
    if (v >= 11 && v <= 13) return `${floorNum}th Floor`;
    const lastDigit = floorNum % 10;
    const suffix = suffixes[lastDigit] || suffixes[0];
    return `${floorNum}${suffix} Floor`;
  };

  const confirmBooking = async () => {
    if (!room || !session?.user?.email) return;
    setIsBooking(true);

    try {
      const totalGuests = localAdults + localChildren; // ✅ Use local state
      const bookingData = {
        email: session.user.email,
        roomNumber: room.roomNumber,
        checkIn: new Date(room.checkIn!).toISOString().split("T")[0],
        checkOut: new Date(room.checkOut!).toISOString().split("T")[0],
        guests: totalGuests.toString(),
      };

      const token = (session as any)?.accessToken || (session as any)?.token;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(bookingData),
        }
      );

      const responseText = await response.text();
      if (
        responseText.startsWith("<!DOCTYPE") ||
        responseText.startsWith("<html")
      ) {
        throw new Error(
          "API endpoint not found. Please check your API route setup."
        );
      }

      const result = JSON.parse(responseText);
      if (!response.ok) throw new Error(result.message || "Booking failed");

      setModalView("success");
      setIsSecondModal(false);
      setIsThirdModal(false);
    } catch (error) {
      console.error("Booking error:", error);
      Swal.fire({
        title: "Booking Failed",
        text: error instanceof Error ? error.message : "Please try again.",
        icon: "error",
        confirmButtonColor: "#AD8054",
      });
      setIsModalOpen(false);
      setIsSecondModal(false);
      setIsThirdModal(false);
      setModalView("summary");
    } finally {
      setIsBooking(false);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "/images/standard/std1.png";
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

  if (!room) {
    return (
      <div className="bg-[#FFF6E2] min-h-screen">
        <div className="container mx-auto py-12 px-4 md:px-6 pt-[120px] text-center">
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
      </div>
    );
  }

  return (
    <div className={`${charis.className} bg-[#FFF6E2] min-h-screen`}>
      {" "}
      <div className="container mx-auto py-12 px-4 md:px-6 pt-[120px]">
        <button
          onClick={() => router.back()}
          className="mb-6 text-emerald-600 hover:text-emerald-800 flex items-center gap-2"
        >
          <MdArrowLeft className="text-emerald-600 text-2xl" />
          Back to All Rooms
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {room.roomType} Room
                </h1>
                <p className="text-xl text-gray-600 font-medium">
                  Room #{room.roomNumber}
                </p>
              </div>
              <span className={getStatusColor(room.status)}>
                {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
              </span>
            </div>

            <div className="text-3xl text-gray-900 font-semibold mb-4">
              <span className="text-[#AD8054]">{formatPrice(room.price)} </span>
              / Night
            </div>

            {isModalOpen && (
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8 overflow-y-auto"
                onClick={() => {
                  setIsModalOpen(false);
                  setIsSecondModal(false);
                  setIsThirdModal(false);
                  setModalView("summary");
                }}
              >
                {/* SUCCESS MODAL: CENTERED */}
                {modalView === "success" && room && (
                  <div
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-fade-in-up my-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <svg
                        className="w-8 h-8 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                      Booking Confirmed!
                    </h1>
                    <p className="text-gray-600 text-center mb-6">
                      Your stay has been successfully booked!
                    </p>
                    <h3 className="text-[#818181] font-bold mb-1">Date</h3>
                    <div className="flex justify-around font-medium mb-5">
                      <span className="font-medium pl-3 text-[#333333]">
                        {formatDate(room.checkIn)}
                      </span>
                      -<span>{formatDate(room.checkOut)}</span>
                    </div>
                    <div className="mb-5 text-left pt-2 border-t border-gray-200">
                      <div className="justify-between">
                        <h3 className="text-[#818181] font-bold mb-1">
                          Guests
                        </h3>
                        <span className="font-medium pl-3 text-[#333333]">
                          {localAdults} adult{localAdults !== 1 ? "s" : ""}
                          {localChildren
                            ? `, ${localChildren} child${
                                localChildren !== 1 ? "ren" : ""
                              }`
                            : ""}
                        </span>
                      </div>
                    </div>
                    <div className="mb-5 text-left pt-2 border-t border-gray-200">
                      <h3 className="text-[#818181] font-bold mb-1">
                        Room & Stay
                      </h3>
                      <div className="flex justify-between text-[16px]">
                        <span>Room Type : {room.roomType}</span>
                        <span className="text-gray-400">|</span>
                        <span>Room : {room.roomNumber}</span>
                        <span className="text-gray-400">|</span>
                        <span>Floor : {formatFloor(room.roomNumber)}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-gray-200 mb-5">
                      <h3 className="text-[#818181] font-bold mb-1">Payment</h3>
                      <div className="flex justify-between">
                        <span className="pl-3">Amount</span>
                        <span className="font-bold text-lg pr-3 text-green-600">
                          {formatPrice((room?.price ?? 0) - 5)}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setIsModalOpen(false);
                          router.push("/profile");
                        }}
                        className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 font-medium"
                      >
                        View Booking
                      </button>
                      <button
                        onClick={() => {
                          setIsModalOpen(false);
                          router.push("/showrooms");
                        }}
                        className="flex-1 py-3 bg-[#AD8054] hover:bg-[#ddbc9b] text-white rounded-xl font-medium"
                      >
                        Explore More
                      </button>
                    </div>
                  </div>
                )}

                {/* SUMMARY VIEW: SIDE-BY-SIDE */}
                {modalView === "summary" && (
                  <div
                    className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl mx-auto my-8 "
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Left: Confirm Booking */}
                    <div className="bg-white rounded-2xl shadow-2xl w-full lg:w-1/2 p-6 relative animate-fade-in-up max-h-[85vh] overflow-y-auto">
                      <button
                        onClick={() => {
                          setIsModalOpen(false);
                          setIsSecondModal(false);
                          setIsThirdModal(false);
                          setModalView("summary");
                        }}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
                      >
                        <svg
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

                      <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
                        Confirm Booking
                      </h2>

                      <div className="mb-4">
                        <label className="block font-bold text-gray-700 mb-1">
                          Username
                        </label>
                        <div className="border border-gray-300 rounded-md px-4 py-2 text-gray-600">
                          {session?.user?.username}
                        </div>
                      </div>

                      <div className="border-b border-gray-200 my-4" />

                      <div className="gap-6 mb-6 mt-6">
                        <label className="block font-bold text-gray-700 mb-1">
                          Guest
                        </label>
                        {/* Adults */}
                        <div className="flex justify-between px-5 items-center gap-3">
                          <span className="text-sm font-medium text-gray-700 w-16">
                            Adults
                          </span>
                          <div className="flex items-center rounded-lg">
                            <button
                              onClick={() =>
                                setLocalAdults(Math.max(1, localAdults - 1))
                              }
                              className="w-7 h-7 items-center text-gray-400 justify-center border border-gray-400 rounded-full hover:bg-gray-100"
                            >
                              –
                            </button>
                            <span className="px-4 py-1 font-medium">
                              {localAdults}
                            </span>
                            <button
                              onClick={() =>
                                setLocalAdults(Math.min(5, localAdults + 1))
                              }
                              className="w-7 h-7 items-center text-gray-400 justify-center border border-gray-400 rounded-full hover:bg-gray-100 "
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Children */}
                        <div className="flex justify-between px-5 items-center gap-3">
                          <span className="text-sm font-medium text-gray-700 w-16">
                            Children
                          </span>
                          <div className="flex items-center rounded-lg">
                            <button
                              onClick={() =>
                                setLocalChildren(Math.max(0, localChildren - 1))
                              }
                              className="w-7 h-7 items-center text-gray-400 justify-center border border-gray-400 rounded-full hover:bg-gray-100"
                            >
                              –
                            </button>
                            <span className="px-4 py-1 font-medium">
                              {localChildren}
                            </span>
                            <button
                              onClick={() =>
                                setLocalChildren(Math.min(3, localChildren + 1))
                              }
                              className="w-7 h-7 items-center text-gray-400 justify-center border border-gray-400 rounded-full hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="border-b border-gray-200 my-4" />

                      <div className="mb-4">
                        <h3 className="font-bold text-gray-700 mb-2">
                          Trip Dates
                        </h3>
                        <div className="border-2 border-gray-300 rounded-xl p-3">
                          <div className="flex justify-around text-sm text-gray-500 mb-1">
                            <span>Trip Start On</span>
                            <span>Trip End On</span>
                          </div>
                          <div className="flex justify-around font-medium">
                            <span>{formatDate(room.checkIn)}</span> -
                            <span>{formatDate(room.checkOut)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-b border-gray-200 my-4" />

                      <div className="mb-6">
                        <h3 className="font-bold text-gray-700 mb-3">
                          Room Details
                        </h3>
                        <div className="grid grid-cols-3 gap-7 ml-1">
                          <div>
                            <label className="text-sm text-gray-500">
                              Room Type
                            </label>
                            <div className="mt-1 px-3 py-1 border border-gray-200 rounded-lg text-sm font-medium">
                              {room.roomType}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-gray-500">
                              Room Number
                            </label>
                            <div className="mt-1 px-3 py-1 border border-gray-200 rounded-lg text-sm font-medium">
                              {room.roomNumber}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-gray-500">
                              Floor
                            </label>
                            <div className="mt-1 px-3 py-1 border border-gray-200 rounded-lg text-sm font-medium">
                              {formatFloor(room.roomNumber)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={confirmBooking}
                          disabled={isBooking}
                          className="flex-1 py-3 bg-[#E08409] hover:bg-[#ddbc9b] text-white rounded-xl font-medium disabled:opacity-70 flex items-center justify-center"
                        >
                          {isBooking ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                              Booking...
                            </>
                          ) : (
                            "Confirm "
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setIsModalOpen(false);
                            setIsSecondModal(false);
                            setIsThirdModal(false);
                          }}
                          className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>

                    {/* Right: Hotel + Price Details */}
                    <div className="flex flex-col gap-6 w-full lg:w-1/2 max-h-[85vh] overflow-y-auto">
                      {" "}
                      {isSecondModal && (
                        <div className="bg-white rounded-2xl shadow-2xl w-full p-6 relative animate-fade-in-up">
                          <button
                            onClick={() => setIsSecondModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
                          >
                            <svg
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

                          <div className="flex items-center gap-4 mb-6 pt-6 bg-white rounded-xl">
                            <Image
                              alt="Sunset Lagoon Resort"
                              src={bg}
                              width={100}
                              height={100}
                              className="rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex-1 flex flex-col justify-center">
                              <h3 className="font-bold text-lg text-gray-900">
                                Sunset Lagoon Resort
                              </h3>
                              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 mt-1 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <MdOutlineLocationOn />
                                  <span>Chonburi 20250</span>
                                </div>
                                <span>Enjoy our Beach</span>
                              </div>
                              <p className="flex gap-1 mt-1 text-sm text-gray-600">
                                <TbBeach />
                                Beach umbrellas and jet skis for rent.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      {isThirdModal && (
                        <div className="bg-white rounded-2xl shadow-2xl w-full relative animate-fade-in-up">
                          <div className="px-8 pt-6">
                            <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors">
                              <svg
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

                            <h3 className="text-2xl font-bold text-start text-gray-900 mb-8">
                              Price Details
                            </h3>

                            <div className="space-y-5 mb-8">
                              <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-amber-500 transition-colors"></div>
                                  <span className="text-gray-600 font-medium">
                                    Room Rate
                                  </span>
                                </div>
                                <span className="text-gray-900 font-semibold text-lg">
                                  ${room.price}
                                </span>
                              </div>

                              <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-green-500 transition-colors"></div>
                                  <span className="text-gray-600 font-medium">
                                    Discount
                                  </span>
                                </div>
                                <span className="text-green-600 font-semibold text-lg">
                                  - $5
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-[#333333] rounded-b-2xl p-5 w-full flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="ml-10 uppercase text-white font-bold text-lg">
                                Total Price
                              </span>
                            </div>
                            <span className="text-white font-bold text-2xl mr-10">
                              ${(room?.price ?? 0) - 5}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {isModalLogin && (
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setIsModalLogin(false)}
              >
                <div
                  className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-fade-in-up"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setIsModalLogin(false)}
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
                  <div className="text-center">
                    <p className="text-xl font-md text-gray-900 mb-4">
                      Please sign in to book this room.
                    </p>
                    <button
                      onClick={() => {
                        setIsModalLogin(false);
                        router.push("/login");
                      }}
                      className="bg-[#AD8054] hover:bg-[#ddbc9b] text-white cursor-pointer py-2 px-5 rounded-full font-medium"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setIsModalLogin(false);
                        router.push("/register");
                      }}
                      className="text-black cursor-pointer py-2 px-5 rounded-full font-medium"
                    >
                      Register
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {room.status === "available" ? (
                status === "authenticated" ? (
                  <button
                    onClick={handleBooking}
                    className="py-3 px-8 rounded-full bg-[#AD8054] hover:bg-[#ddbc9b] text-white font-medium w-full sm:w-auto"
                  >
                    Book Now
                  </button>
                ) : status === "loading" ? (
                  <button
                    disabled
                    className="bg-gray-300 text-gray-500 py-3 px-8 rounded-full font-medium w-full sm:w-auto cursor-not-allowed"
                  >
                    Loading...
                  </button>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="bg-[#AD8054] hover:bg-[#ddbc9b] text-white cursor-pointer py-3 px-8 rounded-full font-medium w-full sm:w-auto"
                  >
                    Book Now
                  </button>
                )
              ) : (
                <button className="bg-gray-300 text-gray-500 py-3 px-8 rounded-lg font-medium w-full cursor-not-allowed">
                  {room.status === "reserved"
                    ? "Reserved"
                    : room.status === "occupied"
                    ? "Occupied"
                    : "Under Maintenance"}
                </button>
              )}
            </div>

            <div className="my-6 text-gray-700 whitespace-pre-line">
              {ROOM_DESCRIPTIONS[room.roomType] || ROOM_DESCRIPTIONS.Standard}
            </div>

            <div className="space-y-6 mb-8">
              <div className="border p-6 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-3 text-lg">
                  Service
                </h3>
                <div className="w-full h-0.5 bg-gray-300 mb-6"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col items-center text-center p-3">
                    <GiForkKnifeSpoon
                      size={40}
                      className="text-[#AD8054] mb-2"
                      aria-hidden="true"
                    />
                    <p className="text-base font-semibold text-gray-800">
                      Complimentary breakfast
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center p-3">
                    <FaCoffee
                      size={40}
                      className="text-[#AD8054] mb-2"
                      aria-hidden="true"
                    />
                    <p className="text-base font-semibold text-gray-800">
                      Coffee & tea
                    </p>
                  </div>
                </div>
              </div>

              <div className="border p-6 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-3 text-lg">
                  Room Amenities
                </h3>
                <div className="w-full h-0.5 bg-gray-300 mb-6"></div>
                <div className="space-y-3">
                  {getAmenities(room.roomType).map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      {amenity.icon}
                      <div>
                        <span className="font-bold text-[#AD8054]">
                          {amenity.category}:
                        </span>{" "}
                        <span className="text-gray-700">
                          {amenity.description}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-1/2 flex flex-col gap-4">
            <div className="relative rounded-xl overflow-hidden h-80">
              <Image
                src={getRoomImages(room.roomType)[0]}
                alt={`${room.roomType} main view`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                onError={handleImageError}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {getRoomImages(room.roomType)
                .slice(1, 3)
                .map((src, index) => (
                  <div
                    key={index}
                    className="relative rounded-xl overflow-hidden h-40"
                  >
                    <Image
                      src={src}
                      alt={`${room.roomType} detail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      onError={handleImageError}
                    />
                  </div>
                ))}
            </div>

            <div className="relative rounded-xl overflow-hidden h-60 mt-2">
              <Image
                src={getRoomImages(room.roomType)[3]}
                alt={`${room.roomType} secondary view`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                onError={handleImageError}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
