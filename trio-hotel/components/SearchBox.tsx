"use client";

import React from "react";

function SearchBox() {
  return (
    <div className="min-h-full md:flex border border-amber-500 rounded-lg p-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="f1 ">
          <p className="font-bold text-start">Check In</p>
        </div>
        <div className="f2 ">
          <p className="font-bold text-start">Check Out</p>
        </div>
        <div className="f3 ">
          <p className="font-bold text-start">Rooms</p>
        </div>
        <div className="f4 ">
          <p className="font-bold text-start">Price</p>
        </div>
      </div>
    </div>
  );
}

export default SearchBox;
