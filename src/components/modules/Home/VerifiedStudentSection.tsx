"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, ShieldCheck, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const benefits = [
  "Direct verification with University databases",
  'Exclusive access to "Student-Only" residential zones',
  "Priority customer support & dispute resolution",
];

export default function VerifiedStudentSection() {
  return (
    <section className="relative py-20 sm:py-28 bg-slate-950 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <span className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              Trust &amp; Safety
            </span>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
              The Verified Student Badge
            </h2>

            {/* Description */}
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
              Join a community of trust. Our verification process ensures
              that only genuine students have access to the most exclusive
              properties, creating a safer and more academic environment for
              everyone.
            </p>

            {/* Benefits List */}
            <ul className="space-y-4 mb-10">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </span>
                  <span className="text-slate-200 text-sm sm:text-base">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href="/register?role=student"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 rounded-xl font-semibold"
              )}
            >
              Get Verified Today
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>

          {/* Right Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-slate-900/60 border border-slate-800 rounded-2xl p-10 sm:p-12 backdrop-blur-sm">
              <div className="flex flex-col items-center text-center">
                {/* Shield Icon */}
                <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30">
                  <ShieldCheck className="w-10 h-10 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  Verification Shield
                </h3>

                {/* Subtitle */}
                <p className="text-slate-400 text-sm sm:text-base">
                  Identity confirmed and verified by DhakaStay Safety Team
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}