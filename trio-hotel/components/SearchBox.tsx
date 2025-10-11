"use client";

import React, { useState, useRef, useEffect } from "react";
import { House, Calendar, Search, Users } from "@deemlol/next-icons"; // 👈 เพิ่ม Users
// @ts-ignore
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

type DateRangeType = {
  startDate: Date | undefined;
  endDate: Date | undefined;
  key: string;
};

type GuestsType = {
  adults: number;
  children: number;
};

const SearchBox = () => {
  const [roomType, setRoomType] = useState<string>("minimal_villa");
  const [dateRange, setDateRange] = useState<DateRangeType>({
    startDate: undefined,
    endDate: undefined,
    key: "selection",
  });
  const [guests, setGuests] = useState<GuestsType>({
    adults: 2,
    children: 0,
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);

  const calendarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);
  const guestsButtonRef = useRef<HTMLDivElement>(null);

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
    if (!dateRange.startDate || !dateRange.endDate) {
      alert("Please select both dates.");
      return;
    }
    console.log({ roomType, dateRange, guests });
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
    const total = guests.adults + guests.children;
    return `${total} guest${total !== 1 ? "s" : ""}`;
  };

  const handleRangeChange = (item: any) => {
    setDateRange(item.selection);
  };

  const updateGuests = (type: "adults" | "children", delta: number) => {
    setGuests((prev) => {
      const newValue = prev[type] + delta;
      if (newValue < 0) return prev;
      if (type === "adults" && newValue === 0) return prev; // at least 1 adult
      return { ...prev, [type]: newValue };
    });
  };

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
            <option value="minimal_villa">Minimal Villa</option>
            <option value="deluxe_suite">Deluxe Suite</option>
            <option value="family_room">Family Room</option>
            <option value="penthouse">Penthouse</option>
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
            className="fixed z-50 bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              maxHeight: "90vh",
              width: "90vw",
              maxWidth: "600px",
            }}
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
      <div className="flex-1 min-w-[180px]">
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
