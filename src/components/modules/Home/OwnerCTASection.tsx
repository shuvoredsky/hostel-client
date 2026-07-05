"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function OwnerCTASection() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative max-w-7xl mx-auto bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl overflow-hidden"
      >
        {/* Background Icon */}
        <Building2
          className="hidden sm:block absolute right-6 sm:right-10 lg:right-16 top-1/2 -translate-y-1/2 w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 text-white/15"
          strokeWidth={1.5}
        />

        <div className="relative px-6 sm:px-10 lg:px-16 py-12 sm:py-16 max-w-2xl">
          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-white leading-tight mb-4">
            Are you a property owner?
          </h2>

          {/* Description */}
          <p className="text-emerald-50/90 text-base sm:text-lg leading-relaxed mb-8">
            List your rooms with DhakaStay and reach thousands of verified
            students looking for a home. We handle the vetting, so you
            don&apos;t have to.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Link
              href="/register?role=owner"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-slate-900 hover:bg-slate-800 text-white px-7 py-6 rounded-xl font-semibold w-full sm:w-auto"
              )}
            >
              List Your Property
            </Link>
            <Link
              href="#how-it-works"
              className={cn(
                buttonVariants({ size: "lg", variant: "ghost" }),
                "bg-white/15 hover:bg-white/25 text-white px-7 py-6 rounded-xl font-semibold w-full sm:w-auto"
              )}
            >
              How it works for Owners
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}