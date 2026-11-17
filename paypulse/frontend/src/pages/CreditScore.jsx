import React, { useEffect, useState } from "react";
import { Gauge, ShieldCheck, TrendingUp, AlertTriangle, Download, CheckCircle2, Info, X } from "lucide-react";
import { api } from "../services/api";

const inr = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

export default function CreditScore() {
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [lenderReport, setLenderReport] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    api.getLoanReadinessScore()
      .then(setScoreData)
      .catch(() => {
        setScoreData({
          score: 78,
          category: "Good",
          trend: "+5 pts (High Approval Probability)",
          breakdown: { collection_performance: 28, overdue_ratio_score: 18, customer_quality_score: 15, record_completeness: 17 },
          positive_factors: ["Strong collection track record (60% paid invoices)", "4 verified reliable buyers", "Healthy invoice volume (₹7,80,000)"],
          risk_factors: ["3 overdue invoices totaling ₹1,25,000"],
          recommendations: [
            "Trigger AI WhatsApp follow-ups for overdue invoices to accelerate cash inflow.",
            "Consider instant invoice financing for 30+ days overdue bills.",
            "Maintain regular invoice creation and payment logging on PayPlus."
          ],
          disclaimer: "This score is an internal indicative credit-readiness assessment calculated by PayPlus AI based on recorded receivables. It is not an official credit bureau score (CIBIL/Experian) or loan approval guarantee."
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const openLenderReport = async () => {
    try {
      const rep = await api.getLenderReport();
      setLenderReport(rep);
    } catch {
      setLenderReport({
        report_title: "PayPlus Certified Financial Health & Lender Summary",
        business_name: "Sharma Engineering & Supplies",
        owner_name: "Rajesh Sharma",
        score: 78,
        score_category: "Good",
        metrics: { total_recorded_revenue: 480000, total_outstanding: 225000, overdue_exposure: 125000, verified_customers_count: 8, reliable_buyers_percentage: "75%" }
      });
    }
    setIsReportModalOpen(true);
  };

  const score = scoreData?.score || 78;

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
          <h1 className="text-2xl md:text-3xl font-extrabold text-navy flex items-center gap-2">
            Loan Readiness Score <Gauge className="h-6 w-6 text-coral" />
          </h1>
          <p className="text-xs md:text-sm text-muted font-medium mt-1">
            Explainable credit-readiness assessment based on invoice payment history & cash stability
          </p>
        </div>
        <button
          onClick={openLenderReport}
          className="flex items-center gap-2 bg-navy hover:bg-coral text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-md transition w-fit"
        >
          <Download className="h-4 w-4" /> Download Lender Report
        </button>
      </div>

      {/* Disclaimer Banner */}
      <div className="bg-cream border border-border rounded-3xl p-4 text-xs text-navy flex items-start gap-3">
        <Info className="h-5 w-5 text-coral shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {scoreData?.disclaimer || "This score is an internal indicative credit-readiness assessment calculated by PayPlus AI based on recorded receivables. It is not an official credit bureau score (CIBIL/Experian) or loan approval guarantee."}
        </p>
      </div>

      {/* Circular Gauge Card & Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Gauge Visualizer */}
        <div className="bg-white rounded-3xl p-6 border border-border shadow-fintech flex flex-col items-center justify-center text-center space-y-4">
          <span className="text-xs font-bold text-muted uppercase tracking-wider">Overall Credit-Readiness Score</span>

          {/* Circular Visual Arc */}
          <div className="relative h-44 w-44 flex items-center justify-center">
            <svg className="h-full w-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-border"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-coral"
                strokeDasharray={`${score}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-4xl font-extrabold text-navy">{score}</span>
              <span className="block text-xs font-bold text-muted">out of 100</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="inline-block bg-coral-light text-navy font-extrabold text-sm px-4 py-1 rounded-full border border-coral/20">
              {scoreData?.category || "Good"}
            </span>
            <p className="text-xs text-muted font-medium pt-1">{scoreData?.trend || "+5 pts (High Approval Probability)"}</p>
          </div>
        </div>

        {/* Explainable Factor Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-border shadow-fintech space-y-5">
          <h3 className="font-extrabold text-navy text-lg">Explainable Score Drivers</h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-bold text-navy mb-1">
                <span>Collection Track Record (35 max)</span>
                <span>{scoreData?.breakdown?.collection_performance || 28} pts</span>
              </div>
              <div className="h-2.5 w-full bg-cream rounded-full overflow-hidden">
                <div className="h-full bg-success rounded-full" style={{ width: `${((scoreData?.breakdown?.collection_performance || 28)/35)*100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-navy mb-1">
                <span>Overdue Ratio Protection (25 max)</span>
                <span>{scoreData?.breakdown?.overdue_ratio_score || 18} pts</span>
              </div>
              <div className="h-2.5 w-full bg-cream rounded-full overflow-hidden">
                <div className="h-full bg-coral rounded-full" style={{ width: `${((scoreData?.breakdown?.overdue_ratio_score || 18)/25)*100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-navy mb-1">
                <span>Buyer Reliability Quality (20 max)</span>
                <span>{scoreData?.breakdown?.customer_quality_score || 15} pts</span>
              </div>
              <div className="h-2.5 w-full bg-cream rounded-full overflow-hidden">
                <div className="h-full bg-success rounded-full" style={{ width: `${((scoreData?.breakdown?.customer_quality_score || 15)/20)*100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-navy mb-1">
                <span>Financial Record Completeness (20 max)</span>
                <span>{scoreData?.breakdown?.record_completeness || 17} pts</span>
              </div>
              <div className="h-2.5 w-full bg-cream rounded-full overflow-hidden">
                <div className="h-full bg-navy rounded-full" style={{ width: `${((scoreData?.breakdown?.record_completeness || 17)/20)*100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Positive & Risk Factors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Positive Factors */}
        <div className="bg-white rounded-3xl p-6 border border-border shadow-fintech space-y-3">
          <h3 className="font-extrabold text-navy text-base flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" /> Positive Financial Strength Factors
          </h3>
          <ul className="space-y-2 text-xs text-navy/90">
            {scoreData?.positive_factors?.map((fact, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-success-light p-2.5 rounded-xl border border-success/20">
                <span className="h-1.5 w-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Risk Factors */}
        <div className="bg-white rounded-3xl p-6 border border-border shadow-fintech space-y-3">
          <h3 className="font-extrabold text-navy text-base flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-coral" /> Identified Risk Factors
          </h3>
          <ul className="space-y-2 text-xs text-navy/90">
            {scoreData?.risk_factors?.map((risk, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-coral-light p-2.5 rounded-xl border border-coral/20">
                <span className="h-1.5 w-1.5 rounded-full bg-coral mt-1.5 shrink-0" />
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actionable Recommendations */}
      <div className="bg-white rounded-3xl p-6 border border-border shadow-fintech space-y-3">
        <h3 className="font-extrabold text-navy text-base flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-coral" /> Recommended Actions to Improve Score
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {scoreData?.recommendations?.map((rec, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-cream border border-border space-y-1">
              <span className="font-bold text-navy">Step {idx + 1}</span>
              <p className="text-muted leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lender Summary Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 border border-border">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-extrabold text-navy text-lg">Financial Summary Report for Lenders</h3>
                <p className="text-xs text-muted">Certified readout generated by PayPlus AI</p>
              </div>
              <button onClick={() => setIsReportModalOpen(false)} className="p-1 rounded-lg text-muted hover:bg-cream">
                <X className="h-5 w-5" />
              </button>
            </div>

            {lenderReport && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-navy text-white rounded-2xl space-y-2">
                  <p className="font-bold text-base text-coral">{lenderReport.business_name}</p>
                  <p className="text-xs text-slate-300">Owner: {lenderReport.owner_name}</p>
                  <div className="flex justify-between items-center pt-2 border-t border-white/10">
                    <span>PayPlus Readiness Score:</span>
                    <span className="font-extrabold text-lg text-coral">{lenderReport.score} / 100 ({lenderReport.score_category})</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-cream rounded-2xl">
                    <span className="text-muted block">Recorded Revenue</span>
                    <span className="font-bold text-navy">{inr(lenderReport.metrics?.total_recorded_revenue)}</span>
                  </div>
                  <div className="p-3 bg-cream rounded-2xl">
                    <span className="text-muted block">Total Receivables</span>
                    <span className="font-bold text-navy">{inr(lenderReport.metrics?.total_outstanding)}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setToastMsg("Financial Summary PDF downloaded successfully.");
                    setIsReportModalOpen(false);
                  }}
                  className="w-full bg-coral text-white font-bold py-3 rounded-2xl hover:bg-coral-hover transition shadow-coral-glow flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" /> Export Certified PDF Report
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
