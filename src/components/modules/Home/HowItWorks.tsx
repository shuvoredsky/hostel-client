"use client";

import { motion } from "framer-motion";
import {
  Percent,
  ShieldCheck,
  Wallet,
  BadgeCheck,
  Users,
  ClipboardCheck,
} from "lucide-react";

const perks = [
  {
    icon: Percent,
    title: "Student Discount",
    description:
      "Owners can offer up to 15% special discount on rent exclusively for verified students. Save more on every booking.",
    color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600",
  },
  {
    icon: ShieldCheck,
    title: "Flexible Advance Policy",
    description:
      "Choose from No Advance, One Month, or Two Month advance options. Find a place that fits your budget, not the other way around.",
    color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600",
  },
  {
    icon: Wallet,
    title: "Flexible Payment Plans",
    description:
      "Pay full rent monthly, or split it into two half-monthly payments. Manage your finances the way that works for you.",
    color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600",
  },
  {
    icon: BadgeCheck,
    title: "Verified Student Badge",
    description:
      "Upload your Student ID and get admin-verified. A Verified Student badge builds trust and gets faster booking approvals.",
    color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600",
  },
  {
    icon: Users,
    title: "Female Student Friendly",
    description:
      "Filter listings by Boys, Girls, or Anyone. Female students can easily find safe, female-only accommodations.",
    color: "bg-pink-50 dark:bg-pink-900/20 text-pink-600",
  },
  {
    icon: ClipboardCheck,
    title: "Admin Verified Listings",
    description:
      "Every listing is reviewed and approved by our admin team before going live, so you only see genuine, trustworthy posts.",
    color: "bg-teal-50 dark:bg-teal-900/20 text-teal-600",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-emerald-600 font-semibold text-sm tracking-wide mb-2 uppercase"
          >
            ✦ Exclusive Perks
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4"
          >
            Designed Specifically For Students
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto"
          >
            DhakaStay isn&apos;t just another rental platform — every feature
            here is built keeping a student&apos;s budget, safety, and comfort
            in mind.
          </motion.p>
        </div>

        {/* Perks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {perks.map((perk, index) => (
            <motion.div
              key={perk.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl ${perk.color} flex items-center justify-center mb-4`}
              >
                <perk.icon className="w-6 h-6" />
              </div>

              {/* Content */}
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                {perk.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {perk.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}