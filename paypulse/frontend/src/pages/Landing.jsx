import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Zap, Clock, PhoneCall, Landmark, ShieldCheck, FileText, Bell,
  LineChart, Gauge, Globe, ArrowRight, CheckCircle2, Sparkles, Star,
  HelpCircle, ChevronDown, ChevronUp
} from "lucide-react";
import PayPlusLogo from "../components/PayPlusLogo";

const problems = [
  {
    icon: Clock,
    title: "Delayed Customer Payments",
    desc: "Large buyers delay payments by 30-90 days, locking up your critical working capital and forcing severe cash shortages."
  },
  {
    icon: PhoneCall,
    title: "Manual Reminders & Chasing",
    desc: "Business owners spend hours making uncomfortable phone calls & writing manual WhatsApp messages to get paid."
  },
  {
    icon: Landmark,
    title: "Unaccessible Business Loans",
    desc: "Traditional banks reject small business loan applications due to missing formal credit histories and manual record-keeping."
  }
];

const features = [
  { icon: FileText, title: "Smart Invoice OCR", desc: "Drag & drop PDF/JPG invoices for instant AI field extraction." },
  { icon: Bell, title: "Automated AI Chasing", desc: "5-stage escalation reminders via WhatsApp Cloud API & Email." },
  { icon: Zap, title: "Instant Cash Financing", desc: "Get up to 85% cash advance against overdue invoices in 24 hours." },
  { icon: LineChart, title: "Cash Flow Forecasting", desc: "7 to 90-day AI projections predicting upcoming cash shortages." },
  { icon: Gauge, title: "Explainable Credit Score", desc: "0-100 Loan Readiness Score certified for lenders & banks." },
  { icon: Globe, title: "Multilingual AI Assistant", desc: "Voice & text queries in English, Kannada, Hindi, and Tamil." },
];

const testimonials = [
  {
    quote: "PayPlus reduced our average payment collection delay from 38 days down to 12 days within the first month!",
    author: "Anand Murthy",
    role: "MD, Deccan Engineering Supplies",
    location: "Bengaluru"
  },
  {
    quote: "The automated WhatsApp reminders in Kannada & English made follow-ups effortless for our accounts team.",
    author: "Sujata Reddy",
    role: "Founder, Kaveri Food Products",
    location: "Mysuru"
  }
];

const faqs = [
  {
    q: "How does PayPlus extract invoice details automatically?",
    a: "PayPlus uses built-in AI OCR (Optical Character Recognition) to read uploaded PDF or image invoices, extracting customer names, amounts, due dates, and GST numbers for instant confirmation."
  },
  {
    q: "Can I send payment reminders over WhatsApp?",
    a: "Yes! PayPlus integrates directly with Meta WhatsApp Business Cloud API to dispatch personalized 5-stage payment reminders in English, Kannada, Hindi, and Tamil."
  },
  {
    q: "Is invoice financing guaranteed?",
    a: "PayPlus calculates instant advance eligibility (up to 85%) and facilitates submission to integrated credit partners like KredX, Mintifi, and InCred."
  }
];

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-cream text-navy font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-border px-6 py-4 flex items-center justify-between">
        <Link to="/">
          <PayPlusLogo textClass="text-navy font-extrabold text-xl" />
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-navy">
          <a href="#features" className="hover:text-coral transition">Features</a>
          <a href="#how-it-works" className="hover:text-coral transition">How it Works</a>
          <a href="#financing" className="hover:text-coral transition">Instant Cash</a>
          <a href="#pricing" className="hover:text-coral transition">Pricing</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/app" className="text-navy hover:text-coral font-bold text-xs px-3 py-2">
            Sign In
          </Link>
          <Link
            to="/app"
            className="bg-coral hover:bg-coral-hover text-white font-bold text-xs px-5 py-2.5 rounded-2xl shadow-coral-glow transition"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-navy text-white px-6 py-20 md:py-28 relative overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-6 text-center md:text-left relative z-10">
          <div className="inline-flex items-center gap-2 bg-coral/20 text-coral text-xs font-bold px-4 py-1.5 rounded-full border border-coral/30">
            <Sparkles className="h-3.5 w-3.5" /> AI-Powered Financial Assistant for Small Businesses
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight max-w-3xl">
            Stop Chasing Payments. <span className="text-coral">Start Growing Your Business.</span>
          </h1>
          <p className="text-slate-300 text-base md:text-xl max-w-2xl font-medium leading-relaxed">
            PayPlus uses AI to track unpaid invoices, automate payment follow-ups and help small businesses stay financially healthy.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center md:justify-start gap-4">
            <Link
              to="/app"
              className="bg-coral hover:bg-coral-hover text-white font-extrabold text-sm px-8 py-4 rounded-2xl shadow-coral-glow transition-all hover:scale-105 flex items-center gap-2"
            >
              Get Started <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/app"
              className="border border-white/20 text-white font-bold text-sm px-6 py-4 rounded-2xl hover:bg-white/10 transition"
            >
              Explore Dashboard
            </Link>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center md:justify-start gap-6 text-xs text-slate-300 font-semibold">
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-coral" /> WhatsApp Cloud Integration</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-coral" /> INR Currency Support</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-coral" /> 4 Regional Languages</span>
          </div>
        </div>

        {/* Decorative Glow */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-coral/20 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Financial Statistics Bar */}
      <section className="bg-white border-b border-border py-8 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <span className="text-3xl font-extrabold text-navy">₹2.4Cr+</span>
            <span className="block text-xs font-bold text-muted mt-1">Overdue Invoices Tracked</span>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-coral">12 Days</span>
            <span className="block text-xs font-bold text-muted mt-1">Avg Collection Speed</span>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-navy">94%</span>
            <span className="block text-xs font-bold text-muted mt-1">WhatsApp Delivery Rate</span>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-success">85%</span>
            <span className="block text-xs font-bold text-muted mt-1">Instant Cash Advance</span>
          </div>
        </div>
      </section>

      {/* Problem Statements Section */}
      <section className="max-w-5xl mx-auto px-6 py-16 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-4xl font-extrabold text-navy">
            Your Business is Profitable. So Why is Your Money Missing?
          </h2>
          <p className="text-xs md:text-sm text-muted">
            Small business owners lose over 25 days every year manually chasing unpaid customer invoices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-border shadow-fintech space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-coral/10 text-coral flex items-center justify-center">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-extrabold text-navy text-lg">{p.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="max-w-5xl mx-auto px-6 py-16 space-y-8 border-t border-border">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-4xl font-extrabold text-navy">
            One AI Platform. Your Entire Payment Cycle Under Control.
          </h2>
          <p className="text-xs md:text-sm text-muted">
            Designed specifically for Indian MSMEs, manufacturers, distributors, and service providers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-border shadow-fintech hover:shadow-fintech-hover transition space-y-3">
                <div className="h-10 w-10 rounded-2xl bg-coral-light text-coral flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-extrabold text-navy text-base">{f.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white border-t border-b border-border py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-navy">Trusted by Growing Small Business Owners</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-cream border border-border text-left space-y-3">
                <div className="flex text-amber">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-4 w-4 fill-amber" />
                  ))}
                </div>
                <p className="text-xs text-navy font-medium italic leading-relaxed">"{t.quote}"</p>
                <div>
                  <p className="font-bold text-navy text-xs">{t.author}</p>
                  <p className="text-[11px] text-muted">{t.role} • {t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-6 py-16 space-y-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-navy text-center">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-border overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-navy text-xs flex items-center justify-between"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="h-4 w-4 text-coral" /> : <ChevronDown className="h-4 w-4 text-muted" />}
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-muted leading-relaxed border-t border-border/50 pt-2">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy text-slate-400 py-10 px-6 text-center text-xs space-y-2">
        <PayPlusLogo textClass="text-white font-bold text-lg justify-center" />
        <p>© 2026 PayPlus. Stop Chasing Payments. Start Growing Your Business.</p>
      </footer>
    </div>
  );
}
