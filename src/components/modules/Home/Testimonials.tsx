import { Star, Quote, Heart } from "lucide-react";

const testimonials = [
  {
    initials: "SN",
    name: "Sadman Sakib",
    role: "Student",
    roleColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    quote: "DhakaStay simplified my transition to university. Getting a student discount and splitting the payment half-monthly was an absolute lifesaver for my monthly budget!",
    rating: 5,
  },
  {
    initials: "TA",
    name: "Tariq Anam",
    role: "Owner",
    roleColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    quote: "Managing bookings is incredibly smooth. The admin reviews listing details quickly, and the built-in SSLCommerz automation guarantees my rent is paid on time.",
    rating: 5,
  },
  {
    initials: "FR",
    name: "Farhana Rahman",
    role: "Tenant",
    roleColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    quote: "The interface is gorgeous and easy to navigate. I filtered by nearby metro stations, viewed the google map layout, and moved into my new flat within a week!",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-slate-50/50 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center space-y-2 mb-12">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-current" />
            Reviews
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            What Our Users Say
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm">
            Read positive feedback and stories shared by students, house owners, and working professionals in Dhaka.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                {/* Header info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 font-bold text-sm flex items-center justify-center shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                      {t.name}
                    </h4>
                    <span className={`inline-block text-[10px] font-medium px-2 py-0.5 mt-1 rounded-full ${t.roleColor}`}>
                      {t.role}
                    </span>
                  </div>
                </div>

                {/* Rating stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                {/* Quote text */}
                <p className="text-slate-500 dark:text-slate-400 text-sm italic leading-relaxed relative">
                  <Quote className="w-8 h-8 text-slate-100 dark:text-slate-700/40 absolute -top-4 -left-2 -z-0 pointer-events-none" />
                  <span className="relative z-10">{t.quote}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
