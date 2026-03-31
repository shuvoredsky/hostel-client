"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Users,
  Home,
  Star,
  Target,
  Heart,
  Zap,
  CheckCircle,
  Building,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";

const stats = [
  { value: "500+", label: "Verified Listings", icon: Home },
  { value: "2000+", label: "Happy Students", icon: GraduationCap },
  { value: "200+", label: "Trusted Owners", icon: Building },
  { value: "20+", label: "Areas Covered", icon: Shield },
];

const values = [
  {
    icon: Shield,
    title: "Trust & Safety",
    description:
      "Every listing is manually verified. We prioritize your safety by ensuring all properties meet our quality standards before going live.",
    color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600",
  },
  {
    icon: Heart,
    title: "Student First",
    description:
      "Built for students, by someone who understands the struggle. We make finding affordable housing as stress-free as possible.",
    color: "bg-rose-50 dark:bg-rose-900/20 text-rose-600",
  },
  {
    icon: Zap,
    title: "Fast & Simple",
    description:
      "From browsing to booking in minutes. No lengthy paperwork, no confusing processes — just find your place and move in.",
    color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600",
  },
  {
    icon: Target,
    title: "Transparent Pricing",
    description:
      "No hidden fees. What you see is what you pay. Secure online payments via SSLCommerz with full transaction history.",
    color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600",
  },
];

const features = [
  "Verified listings with real photos",
  "Secure online payment via SSLCommerz",
  "Instant booking requests",
  "Direct communication with owners",
  "Rating and review system",
  "24/7 platform availability",
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-sm font-medium">
                Our Story
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Making Student Housing{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                Hassle-Free
              </span>
            </h1>

            <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              DhakaStay was born from a simple frustration — finding safe,
              affordable housing in Dhaka as a student is unnecessarily hard.
              We're here to fix that.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center border border-slate-200 dark:border-slate-700"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-emerald-600 text-sm font-semibold uppercase tracking-wider">
                Our Mission
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-2 mb-6">
                Connecting Students with Safe, Affordable Homes
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-6">
                In a city like Dhaka, finding a good place to stay near your
                university is one of the biggest challenges students face. Scams,
                overpricing, and lack of reliable information make it worse.
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8">
                DhakaStay bridges the gap between students looking for housing
                and property owners with genuine listings — creating a
                transparent, safe, and efficient marketplace for both sides.
              </p>

              <ul className="space-y-3">
                {features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-slate-700 dark:text-slate-300"
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl p-8 text-white">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { label: "Students Housed", value: "2,000+" },
                    { label: "Cities Covered", value: "1" },
                    { label: "Avg. Response Time", value: "< 2hrs" },
                    { label: "Satisfaction Rate", value: "98%" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-white/10 rounded-xl p-4 text-center"
                    >
                      <p className="text-2xl font-bold">{item.value}</p>
                      <p className="text-emerald-100 text-xs mt-1">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-emerald-100 text-sm text-center">
                  Growing every day, one student at a time.
                </p>
              </div>

              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl -z-10" />
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-emerald-600 text-sm font-semibold uppercase tracking-wider">
              What We Stand For
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-2">
              Our Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${value.color}`}
                >
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Ready to Find Your Home?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">
            Join thousands of students who found their perfect place through
            DhakaStay.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/listings"
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors"
            >
              Browse Listings
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}