"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How do I know a listing is truly verified?",
    answer:
      "Every listing goes through a manual review by our admin team before it appears on the homepage. Owners must submit real photos and property details, and only approved, genuine listings are made public — so you never have to worry about fake posts.",
  },
  {
    question: "What documents do I need to get the Student Badge?",
    answer:
      "You'll need to upload a valid Student ID Card along with your University name, department, and current session. Once submitted, our admin team verifies the details and grants you the Verified Student badge, giving you access to student-exclusive discounts and listings.",
  },
  {
    question: "Is there any extra fee for using DhakaStay?",
    answer:
      "Browsing, searching, and sending booking requests are completely free for students. A small commission (10%) is only deducted from the owner's side after a successful payment — students never pay any hidden platform fee on top of the rent.",
  },
  {
    question: "Can I cancel my booking if I don't like the room?",
    answer:
      "Once an owner accepts your booking request and payment is completed through SSLCommerz, the booking is considered confirmed and cannot be cancelled from your dashboard. We recommend reviewing the listing photos, rent details, and messaging the owner with any questions before completing payment.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white text-center mb-12"
        >
          Frequently Asked Questions
        </motion.h2>

        {/* Accordion */}
        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 flex-shrink-0 text-emerald-600 transition-transform duration-300",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}