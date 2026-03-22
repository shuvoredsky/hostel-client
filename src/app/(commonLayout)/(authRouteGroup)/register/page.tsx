import RegisterForm from "@/components/modules/Auth/RegisterForm";
import { Home, CheckCircle } from "lucide-react";
import Link from "next/link";

const benefits = [
  "Browse 500+ verified listings",
  "Book directly with owners",
  "Secure payment via SSLCommerz",
  "24/7 customer support",
  "Verified student-friendly homes",
];

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 items-center justify-center p-12">
        <div className="text-white max-w-sm">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold">
              Dhaka<span className="text-emerald-400">Stay</span>
            </span>
          </Link>

          <h2 className="text-3xl font-bold mb-4">
            Start Your Journey With Us
          </h2>
          <p className="text-slate-300 leading-relaxed mb-8">
            Whether you are a student looking for housing or an owner wanting
            to list your property, DhakaStay has you covered.
          </p>

          {/* Benefits */}
          <div className="space-y-3">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-slate-300 text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-white dark:bg-slate-950">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/" className="flex lg:hidden items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              Dhaka<span className="text-emerald-600">Stay</span>
            </span>
          </Link>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}