"use client";

import { motion } from "framer-motion";
import { Search, ClipboardCheck, CreditCard, KeyRound } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Search,
    title: "Search & Filter",
    description:
      "Browse hundreds of verified listings by area, type, and price range. Find exactly what you need near your university.",
    color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600",
    border: "border-blue-100 dark:border-blue-800",
  },
  {
    step: "02",
    icon: ClipboardCheck,
    title: "Book Your Place",
    description:
      "Send a booking request to the owner with your move-in date and message. Get a response within 24 hours.",
    color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600",
    border: "border-emerald-100 dark:border-emerald-800",
  },
  {
    step: "03",
    icon: CreditCard,
    title: "Secure Payment",
    description:
      "Pay securely through SSLCommerz. Your payment is protected and only released to the owner after confirmation.",
    color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600",
    border: "border-purple-100 dark:border-purple-800",
  },
  {
    step: "04",
    icon: KeyRound,
    title: "Move In",
    description:
      "Once payment is confirmed, get the keys and move into your new home. Leave a review to help other students.",
    color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600",
    border: "border-amber-100 dark:border-amber-800",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-20 bg-slate-50 dark:bg-slate-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-emerald-600 font-medium text-sm mb-2"
          >
            ✦ Simple Process
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4"
          >
            How DhakaStay Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto"
          >
            Finding student housing in Dhaka has never been easier. Follow
            these simple steps to find and book your perfect home.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative bg-white dark:bg-slate-800 rounded-2xl p-6 border ${step.border} shadow-sm hover:shadow-md transition-shadow`}
            >
              {/* Step Number */}
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-600 text-white text-xs font-bold flex items-center justify-center">
                {step.step}
              </div>

              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center mb-4`}
              >
                <step.icon className="w-6 h-6" />
              </div>

              {/* Content */}
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {step.description}
              </p>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-slate-200 dark:bg-slate-700 z-10" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}