"use client";

import { Percent, Wallet, CalendarRange, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const offers = [
  {
    icon: Percent,
    title: "Student Discounts",
    desc: "Get up to 15% off monthly rent on select listings with verified student profiles.",
  },
  {
    icon: Wallet,
    title: "No Advance Option",
    desc: "Many properties offer zero or reduced security deposit options for students.",
  },
  {
    icon: CalendarRange,
    title: "Flexible Payments",
    desc: "Pay half rent now, and split the remaining balance in 15 days to manage budget easily.",
  },
];

export default function StudentOffers() {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4">
      {/* Heading */}
      <div className="text-center space-y-2 mb-12">
        <div className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Student Benefits
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          Exclusive Perks for Students
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm">
          Verified student profiles unlock discount badges, flexible installment plans, and zero-advance contracts.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {offers.map((offer, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            className="group bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800/80 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
              <offer.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
              {offer.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {offer.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Footnote */}
      <div className="text-center mt-10">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1 rounded-full">
          Look for the green student badge on listing cards!
        </span>
      </div>
    </section>
  );
}
