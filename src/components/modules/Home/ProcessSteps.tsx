"use client";

import { motion } from "framer-motion";
import { Search, CalendarCheck, CreditCard, KeyRound } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: Search,
    title: "Search & Filter",
    description: "Filter listings by area, university, budget, and room type to find your match.",
  },
  {
    number: 2,
    icon: CalendarCheck,
    title: "Booking Request",
    description: "Send a booking request to the owner with your move-in date and message.",
  },
  {
    number: 3,
    icon: CreditCard,
    title: "Secure Payment",
    description: "Once approved, pay securely through SSLCommerz right from your dashboard.",
  },
  {
    number: 4,
    icon: KeyRound,
    title: "Move In",
    description: "Get confirmation, collect your keys, and move into your new home.",
  },
];

export default function ProcessSteps() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white text-center mb-16"
        >
          Your Path to a Better Room
        </motion.h2>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Number Badge */}
              <div className="absolute -top-4 -left-4 z-10 w-9 h-9 rounded-full bg-slate-900 dark:bg-slate-700 text-white text-sm font-bold flex items-center justify-center shadow-md">
                {step.number}
              </div>

              {/* Card */}
              <div className="h-full bg-white dark:bg-slate-800 rounded-2xl px-6 pt-10 pb-8 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow text-center">
                {/* Icon */}
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-4">
                  <step.icon className="w-6 h-6 text-emerald-600" />
                </div>

                {/* Title */}
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}