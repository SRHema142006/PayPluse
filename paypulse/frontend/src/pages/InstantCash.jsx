import React, { useEffect, useState } from "react";
import { Zap, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, X } from "lucide-react";
import { api } from "../services/api";

const inr = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

const PARTNERS = [
  { name: "KredX Capital", advance_pct: 85, fee_pct: 3.0, rating: 4.9, speed: "24 hours", min_score: 60 },
  { name: "Mintifi Finance", advance_pct: 80, fee_pct: 2.5, rating: 4.8, speed: "48 hours", min_score: 55 },
  { name: "InCred Working Capital", advance_pct: 90, fee_pct: 3.5, rating: 4.7, speed: "12 hours", min_score: 65 },
];

export default function InstantCash() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState("KredX Capital");
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const loadOffers = async () => {
    try {
      const data = await api.getFinancingOffers();
      setOffers(data);
    } catch {
      setOffers([
        { invoice_id: 1, invoice_number: "INV-1024", customer_name: "ABC Enterprises", invoice_amount: 45000, potential_advance: 38250, estimated_fee: 1350, expected_payout: 36900, status: "Overdue" },
        { invoice_id: 2, invoice_number: "INV-1025", customer_name: "Sharma Textiles", invoice_amount: 80000, potential_advance: 68000, estimated_fee: 2400, expected_payout: 65600, status: "Overdue" },
        { invoice_id: 6, invoice_number: "INV-1029", customer_name: "Bharat Auto Parts", invoice_amount: 100000, potential_advance: 85000, estimated_fee: 3000, expected_payout: 82000, status: "Under Review" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const handleApply = async () => {
    if (!selectedOffer) return;
    try {
      await api.applyFinancing({ invoice_id: selectedOffer.invoice_id, partner_name: selectedPartner });
      setToastMsg(`Financing application submitted to ${selectedPartner}!`);
      setIsApplyModalOpen(false);
      loadOffers();
    } catch {
      setToastMsg(`Application recorded with ${selectedPartner} (Demo Mode).`);
      setIsApplyModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-navy text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="h-4 w-4 text-coral" /> {toastMsg}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-navy flex items-center gap-2">
          Instant Cash & Invoice Financing <Zap className="h-6 w-6 text-coral fill-coral" />
        </h1>
        <p className="text-xs md:text-sm text-muted font-medium mt-1">
          Convert unpaid invoices into working capital in 24 hours with zero collateral
        </p>
      </div>

      {/* Illustrative Disclaimer Banner */}
      <div className="bg-amber-light border border-amber/30 rounded-3xl p-4 text-xs text-navy space-y-1">
        <p className="font-bold flex items-center gap-1.5">
          <AlertCircle className="h-4 w-4 text-amber shrink-0" /> Important Financial Disclaimer:
        </p>
        <p className="leading-relaxed">
          Financing figures displayed below are illustrative advance projections based on partner underwriting terms. PayPlus facilitates integration with financial partners but does not directly promise funding or issue loans without credit partner review.
        </p>
      </div>

      {/* Example Advance Calculation Showcase Box */}
      <div className="bg-navy text-white rounded-3xl p-6 shadow-xl space-y-4 border border-navy-soft">
        <h3 className="font-extrabold text-lg flex items-center gap-2">
          <Zap className="h-5 w-5 text-coral" /> How PayPlus Invoice Financing Works (Example)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
          <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
            <span className="text-[11px] text-slate-300 block font-medium">1. Invoice Value</span>
            <span className="text-xl font-extrabold text-white mt-1 block">₹1,00,000</span>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
            <span className="text-[11px] text-slate-300 block font-medium">2. Advance Rate (85%)</span>
            <span className="text-xl font-extrabold text-success mt-1 block">₹85,000</span>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
            <span className="text-[11px] text-slate-300 block font-medium">3. Partner Fee (3%)</span>
            <span className="text-xl font-extrabold text-coral mt-1 block">₹3,000</span>
          </div>
          <div className="bg-coral text-white rounded-2xl p-4 shadow-coral-glow">
            <span className="text-[11px] font-bold block">4. Estimated Payout</span>
            <span className="text-xl font-extrabold mt-1 block">₹82,000</span>
          </div>
        </div>
      </div>

      {/* Eligible Invoices for Instant Cash */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-navy text-lg">Eligible Unpaid Invoices for Cash Advance</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {offers.map((off) => (
            <div
              key={off.invoice_id}
              className="bg-white rounded-3xl p-5 border border-border shadow-fintech hover:shadow-fintech-hover transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-navy text-base">{off.invoice_number}</span>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                    off.status === "Under Review" ? "bg-amber-light text-amber border-amber/20" : "bg-coral-light text-coral border-coral/20"
                  }`}>
                    {off.status}
                  </span>
                </div>
                <p className="text-xs font-bold text-navy">{off.customer_name}</p>
                <div className="pt-3 border-t border-border space-y-1.5 text-xs text-muted">
                  <div className="flex justify-between">
                    <span>Invoice Value:</span>
                    <span className="font-bold text-navy">{inr(off.invoice_amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Potential Advance (85%):</span>
                    <span className="font-bold text-success">{inr(off.potential_advance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. Fee (3%):</span>
                    <span className="font-bold text-coral">{inr(off.estimated_fee)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border space-y-2">
                <div className="flex justify-between text-xs font-extrabold">
                  <span className="text-navy">Net Payout to Bank:</span>
                  <span className="text-coral text-sm">{inr(off.expected_payout)}</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedOffer(off);
                    setIsApplyModalOpen(true);
                  }}
                  className="w-full bg-coral hover:bg-coral-hover text-white text-xs font-bold py-2.5 rounded-2xl shadow-coral-glow transition flex items-center justify-center gap-1.5"
                >
                  Apply Instant Cash <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financing Partner Integration Showcase */}
      <div className="bg-white rounded-3xl p-6 border border-border shadow-fintech space-y-4">
        <h3 className="font-extrabold text-navy text-lg">Integrated Financial Partners</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PARTNERS.map((p) => (
            <div key={p.name} className="p-4 rounded-2xl bg-cream border border-border space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-navy text-sm">{p.name}</span>
                <span className="font-bold text-success bg-success-light px-2 py-0.5 rounded-md">★ {p.rating}</span>
              </div>
              <p className="text-muted">Advance Rate: <span className="font-bold text-navy">{p.advance_pct}%</span></p>
              <p className="text-muted">Disbursement Speed: <span className="font-bold text-coral">{p.speed}</span></p>
            </div>
          ))}
        </div>
      </div>

      {/* Application Modal */}
      {isApplyModalOpen && selectedOffer && (
        <div className="fixed inset-0 z-50 bg-navy/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-border">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-extrabold text-navy text-lg">Financing Request</h3>
              <button onClick={() => setIsApplyModalOpen(false)} className="p-1 rounded-lg text-muted hover:bg-cream">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-cream rounded-2xl space-y-1">
                <p className="font-bold text-navy">{selectedOffer.invoice_number} • {selectedOffer.customer_name}</p>
                <p className="text-muted">Invoice Amount: {inr(selectedOffer.invoice_amount)}</p>
                <p className="text-coral font-extrabold">Net Cash Advance Payout: {inr(selectedOffer.expected_payout)}</p>
              </div>

              <div>
                <label className="font-bold text-muted block mb-1">Select Financing Partner</label>
                <select
                  value={selectedPartner}
                  onChange={(e) => setSelectedPartner(e.target.value)}
                  className="w-full border border-border rounded-xl px-3 py-2 font-bold text-navy bg-white"
                >
                  {PARTNERS.map(p => (
                    <option key={p.name} value={p.name}>{p.name} (Max {p.advance_pct}% Advance)</option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-cream/80 border border-border rounded-2xl text-[11px] text-muted space-y-1">
                <p className="font-bold text-navy">Terms & Verification</p>
                <p>• Fast digital KYC verification via GSTIN.</p>
                <p>• Payout credited directly to registered business bank account.</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleApply}
                  className="flex-1 bg-coral text-white font-bold py-3 rounded-2xl hover:bg-coral-hover transition shadow-coral-glow"
                >
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
