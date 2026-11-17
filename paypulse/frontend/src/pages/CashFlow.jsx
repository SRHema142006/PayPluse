import React, { useEffect, useState } from "react";
import { AlertTriangle, TrendingUp, Calendar, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { api } from "../services/api";

const inr = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

export default function CashFlow() {
  const [period, setPeriod] = useState(30);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getCashFlowForecast(period)
      .then(setForecast)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [period]);

  const timelineData = forecast?.forecast_timeline || [
    { day: "Day 1", date: "2026-10-25", inflow: 0, outflow: 8000, net_cash_flow: -8000, balance: 177000 },
    { day: "Day 5", date: "2026-10-29", inflow: 120000, outflow: 128000, net_cash_flow: -8000, balance: 169000 },
    { day: "Day 10", date: "2026-11-03", inflow: 60000, outflow: 15000, net_cash_flow: 45000, balance: 214000 },
    { day: "Day 15", date: "2026-11-08", inflow: 45000, outflow: 9000, net_cash_flow: 36000, balance: 250000 },
    { day: "Day 30", date: "2026-11-23", inflow: 80000, outflow: 85000, net_cash_flow: -5000, balance: 245000 },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-navy">Cash Flow Forecasting</h1>
          <p className="text-xs md:text-sm text-muted font-medium mt-1">
            Predict cash-flow shortages, upcoming payroll obligations & incoming receivables
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-border shadow-fintech">
          <span className="text-xs font-bold text-muted px-2">Period:</span>
          {[7, 30, 60, 90].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                period === p ? "bg-coral text-white shadow-coral-glow" : "text-navy hover:bg-cream"
              }`}
            >
              {p} Days
            </button>
          ))}
        </div>
      </div>

      {/* Shortage Risk Alert Banner */}
      <div className="bg-amber-light border border-amber/30 rounded-3xl p-5 flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-amber text-white shrink-0">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-extrabold text-navy text-base">PayPlus Forecast Analysis</h3>
          <p className="text-xs text-navy/90 mt-1 leading-relaxed">
            {forecast?.shortage_alert || "Based on recorded invoices and upcoming expenses, you may face a ₹30,000 cash shortage next week due to payroll obligations and delayed customer collections."}
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-border shadow-fintech">
          <span className="text-xs font-bold text-muted uppercase">Opening Balance</span>
          <p className="text-2xl font-extrabold text-navy mt-2">{inr(forecast?.opening_balance || 185000)}</p>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-border shadow-fintech">
          <span className="text-xs font-bold text-muted uppercase">Expected Inflow</span>
          <p className="text-2xl font-extrabold text-success mt-2">{inr(forecast?.total_projected_inflow || 305000)}</p>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-border shadow-fintech">
          <span className="text-xs font-bold text-muted uppercase">Expected Outflow</span>
          <p className="text-2xl font-extrabold text-coral mt-2">{inr(forecast?.total_projected_outflow || 245000)}</p>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-border shadow-fintech">
          <span className="text-xs font-bold text-muted uppercase">Projected Closing Balance</span>
          <p className="text-2xl font-extrabold text-navy mt-2">{inr(forecast?.projected_closing_balance || 245000)}</p>
        </div>
      </div>

      {/* Projected Balance Area Chart */}
      <div className="bg-white rounded-3xl p-6 border border-border shadow-fintech space-y-4">
        <div>
          <h3 className="font-extrabold text-navy text-lg">{period}-Day Cash Flow Balance Trajectory</h3>
          <p className="text-xs text-muted">Daily projected cash balance accounting for confirmed inflows and recurring operational expenses</p>
        </div>
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B5B" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#FF6B5B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E1D5" />
              <XAxis dataKey="day" stroke="#758096" fontSize={12} tickLine={false} />
              <YAxis stroke="#758096" fontSize={12} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
              <Tooltip formatter={(value) => inr(value)} contentStyle={{ borderRadius: "16px", border: "1px solid #E8E1D5" }} />
              <Area type="monotone" dataKey="balance" stroke="#FF6B5B" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Table Breakdown */}
      <div className="bg-white rounded-3xl border border-border shadow-fintech overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-extrabold text-navy text-base">Daily Inflow & Outflow Timeline</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream text-muted uppercase font-bold tracking-wider border-b border-border">
              <tr>
                <th className="p-4">Timeline</th>
                <th className="p-4">Date</th>
                <th className="p-4">Expected Inflow</th>
                <th className="p-4">Expected Outflow</th>
                <th className="p-4">Net Cash Flow</th>
                <th className="p-4 text-right">Projected Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-navy font-medium">
              {timelineData.map((row, idx) => (
                <tr key={idx} className="hover:bg-cream/50 transition">
                  <td className="p-4 font-bold text-navy">{row.day}</td>
                  <td className="p-4">{row.date}</td>
                  <td className="p-4 font-bold text-success">{inr(row.inflow)}</td>
                  <td className="p-4 font-bold text-coral">{inr(row.outflow)}</td>
                  <td className={`p-4 font-bold ${row.net_cash_flow >= 0 ? "text-success" : "text-coral"}`}>
                    {inr(row.net_cash_flow)}
                  </td>
                  <td className="p-4 text-right font-extrabold text-navy text-sm">{inr(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
