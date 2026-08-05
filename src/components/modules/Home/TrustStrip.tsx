import { ShieldCheck, CheckCircle2, Lock, Percent } from "lucide-react";

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Verified Student ID",
    desc: "Verification badge for safety",
  },
  {
    icon: CheckCircle2,
    title: "Approved Listings",
    desc: "100% manually audited details",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    desc: "SSLCommerz payment gateway",
  },
  {
    icon: Percent,
    title: "10% Commission",
    desc: "Transparent commission model",
  },
];

export default function TrustStrip() {
  return (
    <section className="bg-slate-50 dark:bg-slate-900/60 border-y border-slate-100 dark:border-slate-800/80 py-8 my-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {trustItems.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center space-y-2 p-3 transition-transform duration-300 hover:scale-105"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
