"use client";
import React, { useEffect, useState } from "react";
import SearchBox from "../components/SearchBox";

function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);
  return (
    <main
      className="relative min-h-screen flex items-center justify-center px-4 bg-cover bg-center bg-fixed"
      // *** THIS IS THE CORRECTED LINE ***
      style={{ backgroundImage: "url('/images/background.jpg')" }}
    >
      {/* Semi-transparent overlay */}

      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
          style={{ top: "10%", left: "10%", animationDuration: "4s" }}
        />
        <div
          className="absolute w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
          style={{
            top: "50%",
            right: "10%",
            animationDuration: "6s",
            animationDelay: "2s",
          }}
        />
        <div
          className="absolute w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
          style={{
            bottom: "10%",
            left: "30%",
            animationDuration: "5s",
            animationDelay: "1s",
          }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20">
        {/* Main Heading */}
        <h1
          className={`text-6xl md:text-9xl font-bold text-center mb-6 transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{
            background:
              "linear-gradient(135deg, #AD8054 0%, #C9A068 50%, #D4AF37 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Live In Calm
        </h1>

        {/* Subtitle */}
        <p
          className={`text-xl md:text-2xl text-gray-700 text-center max-w-2xl mb-12 leading-relaxed transition-all duration-1000 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          Where nature slows the world down,
          <br />
          <span className="text-amber-700 font-semibold">
            every moment is a breath of peace
          </span>
        </p>

        <div
          className={`
            mt-12 transition-all duration-1000 delay-500
            ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }
          `}
        >
          <SearchBox isHomepage={true} />
        </div>
      </div>
    </main>
  );
}

export default HomePage;
