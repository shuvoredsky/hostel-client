import LoginForm from "@/components/modules/Auth/LoginForm";
import { Home } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-white dark:bg-slate-950">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              Dhaka<span className="text-emerald-600">Stay</span>
            </span>
          </Link>
          <LoginForm />
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 items-center justify-center p-12">
        <div className="text-center text-white max-w-sm">
          {/* Decorative */}
          <div className="w-24 h-24 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-8">
            <Home className="w-12 h-12 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Your Home Away From Home
          </h2>
          <p className="text-slate-300 leading-relaxed mb-8">
            Join thousands of students who found their perfect housing in Dhaka
            through DhakaStay.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "500+", label: "Listings" },
              { value: "2000+", label: "Students" },
              { value: "4.8★", label: "Rating" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/5 border border-white/10 rounded-xl p-3"
              >
                <div className="text-xl font-bold text-emerald-400">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}