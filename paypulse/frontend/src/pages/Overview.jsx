import React, { useEffect, useState } from "react";
import {
  TrendingUp, TrendingDown, ArrowUpRight, Clock, AlertTriangle,
  CheckCircle2, Wallet, Send, Zap, Sparkles
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, CartesianGrid
} from "recharts";
import { api } from "../services/api";
import { useLanguage } from "../context/LanguageContext";

const inr = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

export default function Overview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    api.getDashboardSummary()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const kpis = data?.kpis || {
    total_outstanding: 225000,
    total_outstanding_change: "+4.2%",
    overdue_payments: 125000,
    overdue_payments_change: "-2.1%",
    collected_this_month: 240000,
    collected_change: "+12.5%",
    upcoming_payments: 60000,
    upcoming_change: "+5.0%",
    cash_available: 185000,
    cash_change: "+3.8%"
  };

  const revenueData = data?.charts?.revenue_vs_expenses || [
    { month: "Jun", revenue: 450000, expenses: 280000 },
    { month: "Jul", revenue: 520000, expenses: 310000 },
    { month: "Aug", revenue: 490000, expenses: 295000 },
    { month: "Sep", revenue: 610000, expenses: 340000 },
    { month: "Oct", revenue: 240000, expenses: 380000 },
  ];

  const donutData = data?.charts?.paid_vs_unpaid || [
    { name: "Paid", value: 3, amount: 240000, color: "#249B78" },
    { name: "Pending", value: 2, amount: 115000, color: "#263653" },
    { name: "Overdue", value: 3, amount: 125000, color: "#FF6B5B" },
  ];

  const activities = data?.recent_activities || [
    { id: 1, type: "invoice_uploaded", title: "Invoice Uploaded", description: "INV-1031 for Deccan Logistics added via OCR", time: "2 hours ago" },
    { id: 2, type: "reminder_sent", title: "WhatsApp Reminder Sent", description: "Friendly reminder delivered to Sharma Textiles for INV-1025", time: "5 hours ago" },
    { id: 3, type: "payment_received", title: "Payment Received", description: "Lotus Traders settled INV-1028 of ₹90,000", time: "Yesterday" },
    { id: 4, type: "invoice_overdue", title: "Invoice Marked Overdue", description: "ABC Enterprises (INV-1024, ₹45,000) reached 10 days past due", time: "2 days ago" },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-navy">Financial Overview</h1>
          <p className="text-xs md:text-sm text-muted font-medium mt-1">
            Real-time cash flow monitoring, payment collection & receivables tracking
          </p>
        </div>
      </div>

      {/* PayPlus AI Insights Panel */}
      <div className="bg-navy text-white rounded-3xl p-5 md:p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 border border-navy-soft">
        <div className="space-y-2 z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-coral/20 text-coral text-xs font-bold px-3 py-1 rounded-full border border-coral/30">
            <Sparkles className="h-3.5 w-3.5" /> PayPlus AI Real-time Insight
          </div>
          <p className="text-sm md:text-base font-semibold text-slate-100 leading-relaxed">
            "{data?.ai_insight || "Your business may face a ₹30,000 cash shortage next week based on upcoming expenses and expected collection delays."}"
          </p>
        </div>
        <div className="z-10 shrink-0">
          <a
            href="/app/follow-ups"
            className="inline-flex items-center gap-2 bg-coral hover:bg-coral-hover text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-coral-glow transition"
          >
            <Send className="h-4 w-4" /> Trigger WhatsApp Reminders
          </a>
        </div>
        <div className="absolute right-0 bottom-0 h-48 w-48 rounded-full bg-coral/10 blur-2xl -mr-10 -mb-10 pointer-events-none" />
      </div>

      {/* 5 Financial Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Outstanding */}
        <div className="bg-white rounded-3xl p-5 border border-border shadow-fintech hover:shadow-fintech-hover transition">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-bold uppercase tracking-wider">{t("totalOutstanding")}</span>
            <div className="p-2 rounded-2xl bg-navy/10 text-navy">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-navy mt-3">{inr(kpis.total_outstanding)}</p>
          <div className="flex items-center gap-1 text-xs font-semibold text-coral mt-2">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>{kpis.total_outstanding_change} vs last month</span>
          </div>
        </div>

        {/* Card 2: Overdue Payments */}
        <div className="bg-white rounded-3xl p-5 border border-border shadow-fintech hover:shadow-fintech-hover transition">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-bold uppercase tracking-wider">{t("overduePayments")}</span>
            <div className="p-2 rounded-2xl bg-coral-light text-coral">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-navy mt-3">{inr(kpis.overdue_payments)}</p>
          <div className="flex items-center gap-1 text-xs font-semibold text-coral mt-2">
            <span>3 Invoices Past Due</span>
          </div>
        </div>

        {/* Card 3: Collected This Month */}
        <div className="bg-white rounded-3xl p-5 border border-border shadow-fintech hover:shadow-fintech-hover transition">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-bold uppercase tracking-wider">{t("collectedThisMonth")}</span>
            <div className="p-2 rounded-2xl bg-success-light text-success">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-navy mt-3">{inr(kpis.collected_this_month)}</p>
          <div className="flex items-center gap-1 text-xs font-semibold text-success mt-2">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>{kpis.collected_change} growth</span>
          </div>
        </div>

        {/* Card 4: Upcoming Payments */}
        <div className="bg-white rounded-3xl p-5 border border-border shadow-fintech hover:shadow-fintech-hover transition">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-bold uppercase tracking-wider">{t("upcomingPayments")}</span>
            <div className="p-2 rounded-2xl bg-navy-soft/10 text-navy-soft">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-navy mt-3">{inr(kpis.upcoming_payments)}</p>
          <div className="flex items-center gap-1 text-xs font-semibold text-navy-soft mt-2">
            <span>Due in 15 days</span>
          </div>
        </div>

        {/* Card 5: Cash Available */}
        <div className="bg-white rounded-3xl p-5 border border-border shadow-fintech hover:shadow-fintech-hover transition">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-bold uppercase tracking-wider">{t("cashAvailable")}</span>
            <div className="p-2 rounded-2xl bg-navy/10 text-navy">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-navy mt-3">{inr(kpis.cash_available)}</p>
          <div className="flex items-center gap-1 text-xs font-semibold text-success mt-2">
            <span>Bank Reserve Healthy</span>
          </div>
        </div>
      </div>

      {/* Visualizations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue vs Expenses Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-border shadow-fintech space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-navy text-lg">Monthly Revenue vs Expenses</h3>
              <p className="text-xs text-muted">Comparison of income collection against operating costs</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-success" /> Revenue</span>
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-navy" /> Expenses</span>
            </div>
          </div>
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E1D5" />
                <XAxis dataKey="month" stroke="#758096" fontSize={12} tickLine={false} />
                <YAxis stroke="#758096" fontSize={12} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip formatter={(value) => inr(value)} contentStyle={{ borderRadius: "16px", border: "1px solid #E8E1D5" }} />
                <Bar dataKey="revenue" name="Revenue" fill="#249B78" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#14213D" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Paid vs Unpaid Donut Chart */}
        <div className="bg-white rounded-3xl p-6 border border-border shadow-fintech space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-navy text-lg">Invoice Status Breakdown</h3>
            <p className="text-xs text-muted">Paid, pending, and overdue ratio</p>
          </div>
          <div className="h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, name, item) => [inr(item.payload.amount), item.payload.name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <span className="text-2xl font-extrabold text-navy">8</span>
              <span className="block text-xs font-semibold text-muted">Total Invoices</span>
            </div>
          </div>
          <div className="space-y-2 pt-2 border-t border-border text-xs">
            {donutData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-medium text-navy">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name} ({item.value})
                </span>
                <span className="font-bold text-navy">{inr(item.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Timeline & Instant Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-border shadow-fintech space-y-4">
          <h3 className="font-extrabold text-navy text-lg">Recent Payment & System Activity</h3>
          <div className="space-y-3">
            {activities.map((act) => (
              <div key={act.id} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-cream border border-border">
                <div className="h-9 w-9 rounded-xl bg-coral/10 text-coral flex items-center justify-center shrink-0 mt-0.5">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-navy text-sm">{act.title}</p>
                    <span className="text-xs text-muted">{act.time}</span>
                  </div>
                  <p className="text-xs text-navy/80 mt-0.5">{act.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Access Card: Instant Financing Promo */}
        <div className="bg-navy text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4 border border-navy-soft">
          <div className="space-y-2">
            <div className="h-10 w-10 rounded-2xl bg-coral text-white flex items-center justify-center font-bold shadow-coral-glow">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-extrabold text-xl pt-2">Need Instant Cash?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Don't wait 30 days for customer payments. Get up to 85% cash advance against your overdue invoices today.
            </p>
          </div>
          <a
            href="/app/instant-cash"
            className="w-full bg-coral hover:bg-coral-hover text-white text-xs font-bold py-3 rounded-2xl text-center shadow-coral-glow transition"
          >
            Explore Invoice Financing Offers
          </a>
        </div>
      </div>
    </div>
  );
}
