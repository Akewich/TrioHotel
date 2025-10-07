"use client";

import React, { useState, useRef, useEffect } from "react";
import { House, Calendar, Search } from "@deemlol/next-icons";
// @ts-ignore
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

type DateRangeType = {
  startDate: Date | undefined;
  endDate: Date | undefined;
  key: string;
};

const SearchBox = () => {
  const [roomType, setRoomType] = useState<string>("minimal_villa");
  const [dateRange, setDateRange] = useState<DateRangeType>({
    startDate: undefined,
    endDate: undefined,
    key: "selection",
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const calendarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateRange.startDate || !dateRange.endDate) {
      alert("Please select both dates.");
      return;
    }
    console.log({ roomType, dateRange });
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

  const handleRangeChange = (item: any) => {
    setDateRange(item.selection);
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

      {/* Date */}
      <div className="flex-1 min-w-[220px]">
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
            className="absolute z-20 mt-2 bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-4 border border-gray-200 w-full md:w-[500px] max-w-full"
            style={{ top: "100%", left: 0 }}
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
