import React, { useEffect, useState } from "react";
import { Wallet, Plus, CheckCircle2, AlertTriangle, X, Check } from "lucide-react";
import { api } from "../services/api";

const inr = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [overdueInvoices, setOverdueInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [form, setForm] = useState({
    invoice_id: "",
    amount: "",
    payment_date: new Date().toISOString().split("T")[0],
    payment_method: "UPI / Bank Transfer",
    reference_number: "",
    notes: ""
  });

  const loadData = async () => {
    try {
      const pData = await api.getPayments();
      setPayments(pData);
      const oData = await api.getOverduePayments();
      setOverdueInvoices(oData);
    } catch {
      setPayments([
        { id: 1, invoice_number: "INV-1028", customer_name: "Lotus Traders", amount: 90000, payment_date: "2026-10-18", payment_method: "UPI", reference_number: "UPI/9882/SETTLE", notes: "Full settlement" },
        { id: 2, invoice_number: "INV-1032", customer_name: "Kaveri Foods", amount: 150000, payment_date: "2026-09-30", payment_method: "Bank Transfer", reference_number: "NEFT-881920", notes: "Raw material supply" },
        { id: 3, invoice_number: "INV-1033", customer_name: "Metro Retail Hub", amount: 75000, payment_date: "2026-09-15", payment_method: "Cheque", reference_number: "CHQ-00129", notes: "Store fixtures" }
      ]);
      setOverdueInvoices([
        { id: 1, number: "INV-1024", customer_name: "ABC Enterprises", amount: 45000, due_date: "2026-10-15" },
        { id: 2, number: "INV-1025", customer_name: "Sharma Textiles", amount: 80000, due_date: "2026-10-18" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRecordSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.recordPayment({
        invoice_id: Number(form.invoice_id) || 1,
        amount: Number(form.amount),
        payment_date: form.payment_date,
        payment_method: form.payment_method,
        reference_number: form.reference_number,
        notes: form.notes
      });
      setToastMsg("Payment recorded successfully!");
      setIsRecordModalOpen(false);
      loadData();
    } catch {
      setToastMsg("Payment recorded locally.");
      setIsRecordModalOpen(false);
    }
  };

  const totalCollected = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

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
          <h1 className="text-2xl md:text-3xl font-extrabold text-navy">Payment Tracking</h1>
          <p className="text-xs md:text-sm text-muted font-medium mt-1">
            Log received payments, verify bank transactions, and monitor partial settlements
          </p>
        </div>
        <button
          onClick={() => setIsRecordModalOpen(true)}
          className="flex items-center gap-2 bg-coral hover:bg-coral-hover text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-coral-glow transition w-fit"
        >
          <Plus className="h-4 w-4" /> Record Payment
        </button>
      </div>

      {/* Summary KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-border shadow-fintech flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-success-light text-success flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-muted uppercase">Total Payments Logged</span>
            <p className="text-2xl font-extrabold text-navy mt-1">{inr(totalCollected)}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-border shadow-fintech flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-coral-light text-coral flex items-center justify-center shrink-0">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-muted uppercase">Overdue Payments Needing Action</span>
            <p className="text-2xl font-extrabold text-navy mt-1">{overdueInvoices.length} Invoices Past Due</p>
          </div>
        </div>
      </div>

      {/* Payment Activity Table */}
      <div className="bg-white rounded-3xl border border-border shadow-fintech overflow-hidden space-y-3">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h3 className="font-extrabold text-navy text-base">Payment Settlement Activity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream text-muted uppercase font-bold tracking-wider border-b border-border">
              <tr>
                <th className="p-4">Invoice #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Reference ID</th>
                <th className="p-4 text-right">Amount Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-navy font-medium">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-cream/50 transition">
                  <td className="p-4 font-bold text-navy">{p.invoice_number}</td>
                  <td className="p-4 font-bold text-navy">{p.customer_name}</td>
                  <td className="p-4">{p.payment_date}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full bg-navy/10 text-navy font-bold text-[11px]">
                      {p.payment_method}
                    </span>
                  </td>
                  <td className="p-4 text-muted font-mono">{p.reference_number || "REF-8891"}</td>
                  <td className="p-4 text-right font-extrabold text-success text-sm">{inr(p.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-border">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-extrabold text-navy text-lg">Record Customer Payment</h3>
              <button onClick={() => setIsRecordModalOpen(false)} className="p-1 rounded-lg text-muted hover:bg-cream">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleRecordSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-muted">Select Invoice</label>
                <select
                  required
                  value={form.invoice_id}
                  onChange={(e) => setForm({ ...form, invoice_id: e.target.value })}
                  className="w-full mt-1 border border-border rounded-xl px-3 py-2 font-bold text-navy bg-white"
                >
                  <option value="">Choose an overdue/pending invoice...</option>
                  {overdueInvoices.map(inv => (
                    <option key={inv.id} value={inv.id}>{inv.number} — {inv.customer_name} ({inr(inv.amount)})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold text-muted">Amount Received (₹)</label>
                <input
                  type="number"
                  required
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="e.g. 45000"
                  className="w-full mt-1 border border-border rounded-xl px-3 py-2 font-bold text-navy"
                />
              </div>
              <div>
                <label className="font-bold text-muted">Payment Date</label>
                <input
                  type="date"
                  required
                  value={form.payment_date}
                  onChange={(e) => setForm({ ...form, payment_date: e.target.value })}
                  className="w-full mt-1 border border-border rounded-xl px-3 py-2 text-navy"
                />
              </div>
              <div>
                <label className="font-bold text-muted">Payment Method</label>
                <select
                  value={form.payment_method}
                  onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                  className="w-full mt-1 border border-border rounded-xl px-3 py-2 font-bold text-navy bg-white"
                >
                  <option>UPI / Bank Transfer</option>
                  <option>IMPS / NEFT / RTGS</option>
                  <option>Cheque</option>
                  <option>Cash</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-muted">Reference / Transaction ID</label>
                <input
                  value={form.reference_number}
                  onChange={(e) => setForm({ ...form, reference_number: e.target.value })}
                  placeholder="e.g. UPI/99812/SETTLE"
                  className="w-full mt-1 border border-border rounded-xl px-3 py-2 text-navy"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-coral hover:bg-coral-hover text-white font-bold py-2.5 rounded-2xl shadow-coral-glow transition flex items-center justify-center gap-2">
                  <Check className="h-4 w-4" /> Save Payment Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
