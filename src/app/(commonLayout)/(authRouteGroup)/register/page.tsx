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