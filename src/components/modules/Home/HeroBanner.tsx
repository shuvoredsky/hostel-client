"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  MapPin,
  ArrowRight,
  Star,
  Users,
  Home,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IBanner } from "@/services/settings.services";

const stats = [
  { icon: Home, label: "Listings", value: "500+" },
  { icon: Users, label: "Students", value: "2000+" },
  { icon: Star, label: "Reviews", value: "4.8★" },
  { icon: MapPin, label: "Areas", value: "20+" },
];

const popularAreas = [
  "Mirpur",
  "Dhanmondi",
  "Mohammadpur",
  "Uttara",
  "Bashundhara",
];

interface HeroBannerProps {
  banners: IBanner[];
}

export default function HeroBanner({ banners }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeBanners = banners.filter((b) => b.isActive);
  const hasBanners = activeBanners.length > 0;

  useEffect(() => {
    if (!hasBanners || activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeBanners.length, hasBanners]);

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? activeBanners.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      {/* Dynamic Banner Background */}
      {hasBanners && (
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <Image
                src={activeBanners[currentIndex].image}
                alt={activeBanners[currentIndex].title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-slate-900/70" />
            </motion.div>
          </AnimatePresence>

          {/* Slider Controls */}
          {activeBanners.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                {activeBanners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`transition-all rounded-full ${
                      index === currentIndex
                        ? "w-6 h-2 bg-emerald-400"
                        : "w-2 h-2 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Static Background when no banners */}
      {!hasBanners && (
        <>
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-sm font-medium">
              #1 Student Housing Platform in Dhaka
            </span>
          </div>

          {/* Heading */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={hasBanners ? currentIndex : "default"}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              {hasBanners ? (
                activeBanners[currentIndex].title
              ) : (
                <>
                  Find Your Perfect
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                    Student Home
                  </span>
                  in Dhaka
                </>
              )}
            </motion.h1>
          </AnimatePresence>

          {/* Subheading */}
          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Browse hundreds of verified rooms, seats, and apartments near your
            university. Safe, affordable, and student-friendly.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 max-w-2xl mx-auto mb-10">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by area, university..."
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-400 transition-colors"
              />
            </div>
            <Link
              href="/listings"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl whitespace-nowrap"
              )}
            >
              Search Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          {/* Popular Areas */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-16">
            <span className="text-slate-400 text-sm">Popular:</span>
            {popularAreas.map((area) => (
              <Link
                key={area}
                href={`/listings?area=${area}`}
                className="flex items-center gap-1 text-sm text-slate-300 hover:text-emerald-400 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-3 py-1 transition-all"
              >
                <MapPin className="w-3 h-3" />
                {area}
              </Link>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center"
              >
                <stat.icon className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 80"
          className="w-full fill-white dark:fill-slate-950"
        >
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  );
}