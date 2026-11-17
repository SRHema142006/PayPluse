import React, { useEffect, useState } from "react";
import { Download, Printer, Calendar, CheckCircle2 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { api } from "../services/api";

const inr = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

const REPORT_TYPES = [
  "Monthly Revenue Report",
  "Outstanding Invoice Report",
  "Overdue Payment Report",
  "Customer Payment Behaviour Report",
  "Collection Performance Report",
  "Cash Flow Report",
  "Loan Readiness Report"
];

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState("Monthly Revenue Report");
  const [reportsData, setReportsData] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    api.getReportsSummary()
      .then(setReportsData)
      .catch(() => {});
  }, []);

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Invoice,Customer,Amount,Status\n"
      + "INV-1024,ABC Enterprises,45000,Overdue\n"
      + "INV-1025,Sharma Textiles,80000,Overdue\n"
      + "INV-1026,Kaveri Foods,120000,Pending\n"
      + "INV-1028,Lotus Traders,90000,Paid\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `PayPlus_${selectedReport.replace(/ /g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToastMsg("CSV report exported successfully!");
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const monthlyTrend = reportsData?.monthly_trend || [
    { month: "Jun", invoiced: 240000, collected: 180000 },
    { month: "Jul", invoiced: 280000, collected: 210000 },
    { month: "Aug", invoiced: 260000, collected: 195000 },
    { month: "Sep", invoiced: 310000, collected: 260000 },
    { month: "Oct", invoiced: 240000, collected: 240000 },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-navy text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="h-4 w-4 text-coral" /> {toastMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-navy">Reports & Financial Analytics</h1>
          <p className="text-xs md:text-sm text-muted font-medium mt-1">
            Generate financial summaries, collection performance analytics & lender export packages
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-coral hover:bg-coral-hover text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-coral-glow transition"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-navy hover:bg-navy-soft text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-md transition"
          >
            <Printer className="h-4 w-4" /> Print Report
          </button>
        </div>
      </div>

      {/* Report Selector Tabs */}
      <div className="flex overflow-x-auto gap-2 bg-white p-2 rounded-3xl border border-border shadow-fintech scrollbar-none">
        {REPORT_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedReport(type)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition ${
              selectedReport === type ? "bg-navy text-white shadow-md" : "text-navy hover:bg-cream"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Report Summary Visualizer */}
      <div className="bg-white rounded-3xl p-6 border border-border shadow-fintech space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h3 className="font-extrabold text-navy text-lg">{selectedReport}</h3>
            <p className="text-xs text-muted">Filtered by financial period: Fiscal Year 2026</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-muted">
            <Calendar className="h-4 w-4" /> <span>Oct 2026</span>
          </div>
        </div>

        {/* Chart View */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E1D5" />
              <XAxis dataKey="month" stroke="#758096" fontSize={12} tickLine={false} />
              <YAxis stroke="#758096" fontSize={12} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
              <Tooltip formatter={(v) => inr(v)} contentStyle={{ borderRadius: "16px", border: "1px solid #E8E1D5" }} />
              <Bar dataKey="invoiced" name="Invoiced Amount" fill="#14213D" radius={[6, 6, 0, 0]} />
              <Bar dataKey="collected" name="Collected Amount" fill="#249B78" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Summary Table */}
      <div className="bg-white rounded-3xl border border-border shadow-fintech overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-extrabold text-navy text-base">Detailed Breakdown Table</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream text-muted uppercase font-bold tracking-wider border-b border-border">
              <tr>
                <th className="p-4">Period / Customer</th>
                <th className="p-4">Invoiced Amount</th>
                <th className="p-4">Collected Amount</th>
                <th className="p-4 text-right">Collection Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-navy font-medium">
              {monthlyTrend.map((m, idx) => (
                <tr key={idx} className="hover:bg-cream/50 transition">
                  <td className="p-4 font-bold text-navy">{m.month} 2026</td>
                  <td className="p-4 font-bold text-navy">{inr(m.invoiced)}</td>
                  <td className="p-4 font-bold text-success">{inr(m.collected)}</td>
                  <td className="p-4 text-right font-extrabold text-coral">{`${((m.collected / Math.max(1, m.invoiced)) * 100).toFixed(0)}%`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
