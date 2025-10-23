"use client";

import React, { useState, useRef, useEffect, CSSProperties } from "react";
import { House, Calendar, Search, Users } from "@deemlol/next-icons";
// @ts-ignore
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useRouter, useSearchParams } from "next/navigation";

type DateRangeType = {
  startDate: Date | undefined;
  endDate: Date | undefined;
  key: string;
};

type GuestsType = {
  adults: number;
  children: number;
  room: number;
};

const SearchBox = ({ isHomepage = false }: { isHomepage?: boolean }) => {
  const [roomType, setRoomType] = useState<string>("Standard");
  const [dateRange, setDateRange] = useState<DateRangeType>({
    startDate: undefined,
    endDate: undefined,
    key: "selection",
  });
  const [guests, setGuests] = useState<GuestsType>({
    adults: 2,
    children: 0,
    room: 1,
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);

  // for Guest reservation
  const calendarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);
  const guestsButtonRef = useRef<HTMLDivElement>(null);

  // routing
  const router = useRouter();

  const getCalendarStyle = (): CSSProperties => {
    if (isHomepage) {
      return {
        position: "fixed" as const,
        top: "-100%",
        left: "10%",
        width: "75%",
        maxHeight: "90vh",
        overflowY: "auto",
        zIndex: 50,
      };
    } else {
      return {
        position: "fixed",
        top: "120px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "90vw",
        maxWidth: "600px",
        maxHeight: "calc(100vh - 160px)",
        zIndex: 50,
      };
    }
  };

  // Close calendar on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close guests dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        guestsRef.current &&
        !guestsRef.current.contains(event.target as Node) &&
        guestsButtonRef.current &&
        !guestsButtonRef.current.contains(event.target as Node)
      ) {
        setIsGuestsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // error checking
    if (!dateRange.startDate || !dateRange.endDate) {
      alert("Please select both dates.");
      return;
    }

    if (guests.adults === 0) {
      alert("At least one adult for booking.");
      return;
    }

    const params = new URLSearchParams({
      roomType,
      checkIn: dateRange.startDate.toISOString(),
      checkOut: dateRange.endDate.toISOString(),
      adults: guests.adults.toString(),
      children: guests.children.toString(),
      room: guests.room.toString(),
    });
    console.log(params);
    router.push(`/showrooms?${params.toString()}`);
  };

  const getDisplayText = () => {
    if (dateRange.startDate && dateRange.endDate) {
      const start = dateRange.startDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const end = dateRange.endDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      return `${start} – ${end}`;
    }
    return "Check in – Check out";
  };

  const getGuestsDisplayText = () => {
    const totalGuest = guests.adults + guests.children;
    return (
      `${totalGuest} Guest${totalGuest !== 1 ? "s" : ""} , ` +
      `${guests.room} Room${guests.room !== 1 ? "s" : ""}`
    );
  };

  const handleRangeChange = (item: any) => {
    setDateRange(item.selection);
  };

  const updateGuests = (
    type: "adults" | "children" | "room",
    delta: number
  ) => {
    setGuests((prev) => {
      const newValue = prev[type] + delta;
      if (newValue < 0) return prev;
      if (type === "adults" && newValue === 0) return prev; // at least 1 adult
      return { ...prev, [type]: newValue };
    });
  };

  // Populate state from URL parameters on mount
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlroomType = searchParams.get("roomType");
    if (urlroomType) {
      setRoomType(urlroomType);
    }

    const urlCheckIn = searchParams.get("checkIn");
    const urlCheckOut = searchParams.get("checkOut");
    if (urlCheckIn && urlCheckOut) {
      setDateRange({
        startDate: new Date(urlCheckIn),
        endDate: new Date(urlCheckOut),
        key: "selection",
      });
    }

    const urlAdults = searchParams.get("adults");
    const urlChildren = searchParams.get("children");
    const urlRoom = searchParams.get("room");
    setGuests({
      adults: urlAdults ? parseInt(urlAdults) : 2,
      children: urlChildren ? parseInt(urlChildren) : 0,
      room: urlRoom ? parseInt(urlRoom) : 1,
    });
  }, [searchParams]);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-5 flex flex-col md:flex-row items-center gap-4 relative border border-white/30"
    >
      {/* Rooms */}
      <div className="flex-1 min-w-[180px]">
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Rooms
        </label>
        <div className="relative">
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white/90 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all"
          >
            <option value="Standard">Standard</option>
            <option value="Family">Family</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Suite">Suite</option>
            <option value="Honeymoon">Honeymoon</option>
          </select>

          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600">
            <House size={18} />
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="flex-1 min-w-[250px]">
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Dates
        </label>
        <div
          ref={buttonRef}
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className="flex items-center border border-gray-200 rounded-xl px-4 py-3 cursor-pointer bg-white/90 hover:bg-white transition-all duration-200"
        >
          <Calendar size={18} className="text-amber-600 mr-2" />
          <span className="text-gray-700 font-medium truncate">
            {getDisplayText()}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ml-auto text-gray-500 transition-transform duration-200 ${
              isCalendarOpen ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {isCalendarOpen && (
          <div
            ref={calendarRef}
            className="bg-white rounded-2xl shadow-xl border border-gray-200"
            style={getCalendarStyle()}
          >
            <div
              className="overflow-y-auto p-4"
              style={{ maxHeight: "calc(90vh - 60px)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <DateRangePicker
                ranges={[dateRange]}
                onChange={handleRangeChange}
                direction="horizontal"
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                months={1}
                minDate={new Date()}
                className="rounded-xl"
              />
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsCalendarOpen(false)}
                  className="px-4 py-2 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-colors shadow-md"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Guests */}
      <div className="flex-1 min-w-[240px]">
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Guests
        </label>
        <div
          ref={guestsButtonRef}
          onClick={() => setIsGuestsOpen(!isGuestsOpen)}
          className="flex items-center border border-gray-200 rounded-xl px-4 py-3 cursor-pointer bg-white/90 hover:bg-white transition-all duration-200"
        >
          <Users size={18} className="text-amber-600 mr-2" />
          <span className="text-gray-700 font-medium">
            {getGuestsDisplayText()}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ml-auto text-gray-500 transition-transform duration-200 ${
              isGuestsOpen ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {isGuestsOpen && (
          <div
            ref={guestsRef}
            className="absolute z-20 mt-2 bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200 w-2/5 p-4"
            style={{ top: "100%" }}
          >
            <div className="space-y-4">
              {/* Room */}
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Room</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateGuests("room", -1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                    disabled={guests.room <= 1}
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">
                    {guests.room}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateGuests("room", 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Adults */}
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Adults</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateGuests("adults", -1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                    disabled={guests.adults <= 1}
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">
                    {guests.adults}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateGuests("adults", 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Children</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateGuests("children", -1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                    disabled={guests.children <= 0}
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">
                    {guests.children}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateGuests("children", 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Button */}
      <div className="mt-7">
        <button
          type="submit"
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white p-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center w-12 h-12"
          aria-label="Search"
        >
          <Search size={16} />
        </button>
      </div>
    </form>
  );
};

export default SearchBox;
