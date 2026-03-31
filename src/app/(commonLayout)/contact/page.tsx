"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Globe,
  Github,
  Linkedin,
  Send,
  Code2,
  Server,
  Smartphone,
  Database,
  ExternalLink,
  CheckCircle,
  Loader2,
  MessageSquare,
  User,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const skills = [
  { icon: Code2, label: "Frontend", tech: "Next.js, React, TypeScript, Tailwind" },
  { icon: Server, label: "Backend", tech: "Node.js, Express, REST APIs" },
  { icon: Database, label: "Database", tech: "PostgreSQL, MongoDB, Prisma" },
  { icon: Smartphone, label: "Tools", tech: "Git, Docker, Vercel, Render" },
];

const socialLinks = [
  {
    icon: Globe,
    label: "Portfolio",
    href: "https://shuvoredsky.netlify.app/",
    value: "shuvoredsky.netlify.app",
    color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:shuvo@example.com",
    value: "Get in touch via email",
    color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
  },
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/",
    value: "View my open source work",
    color: "text-slate-700 bg-slate-100 dark:bg-slate-700 dark:text-slate-300",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://linkedin.com/",
    value: "Connect professionally",
    color: "text-blue-700 bg-blue-50 dark:bg-blue-900/20",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    // Simulate submission
    await new Promise((res) => setTimeout(res, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    toast.success("Message sent successfully!");
  };

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
                Get In Touch
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Let's{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                Talk
              </span>
            </h1>

            <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
              Have a question about DhakaStay? Want to collaborate on a project?
              I'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Developer Card — Left */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
              >
                {/* Cover */}
                <div className="h-20 bg-gradient-to-r from-emerald-500 to-emerald-700" />

                <div className="px-6 pb-6">
                  <div className="-mt-8 mb-4">
                    <div className="w-16 h-16 rounded-2xl border-4 border-white dark:border-slate-800 bg-emerald-600 flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-white">S</span>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Shuvo Chakrabrati
                  </h2>
                  <p className="text-emerald-600 font-medium text-sm mt-0.5">
                    Full Stack Developer
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 leading-relaxed">
                    Passionate full stack developer who loves building
                    clean, scalable web applications. Currently open to
                    freelance projects and full-time opportunities.
                  </p>

                  <Link
                    href="https://shuvoredsky.netlify.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    View Portfolio
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </motion.div>

              {/* Skills */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
              >
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-600" />
                  Tech Stack
                </h3>
                <div className="space-y-3">
                  {skills.map((skill) => (
                    <div key={skill.label} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0 mt-0.5">
                        <skill.icon className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {skill.label}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {skill.tech}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
              >
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                  Connect
                </h3>
                <div className="space-y-3">
                  {socialLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group"
                    >
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${link.color}`}
                      >
                        <link.icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {link.label}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {link.value}
                        </p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Contact Form — Right */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3"
            >
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Send a Message
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      I'll get back to you as soon as possible
                    </p>
                  </div>
                </div>

                {submitted ? (
                  <div className="py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                      Thanks for reaching out. I'll respond within 24 hours.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setForm({ name: "", email: "", subject: "", message: "" });
                      }}
                      className="px-6 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      Send Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Your Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Subject
                      </label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                      >
                        <option value="">Select a subject</option>
                        <option value="listing">Question about a listing</option>
                        <option value="booking">Booking issue</option>
                        <option value="payment">Payment problem</option>
                        <option value="collab">Project collaboration</option>
                        <option value="hire">Hiring inquiry</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={6}
                        placeholder="Tell me what's on your mind..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}