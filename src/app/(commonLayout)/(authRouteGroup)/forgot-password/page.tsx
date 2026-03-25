import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Forgot Password</h1>
      <p className="mt-4 text-sm text-slate-600">
        This page is under construction.
      </p>
      <Link href="/login" className="mt-4 inline-block text-blue-600">
        Back to login
      </Link>
    </div>
  );
}
