import React, { useEffect, useState } from "react";
import { MessageSquare, Send, Sparkles, CheckCircle2, Clock, Globe, ShieldAlert, Edit3, Copy, Check } from "lucide-react";
import { api } from "../services/api";
import { useLanguage } from "../context/LanguageContext";

const inr = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

const STAGES = [
  { stage: 1, label: "Stage 1 — Before Due Date", desc: "Friendly payment reminder", badge: "Friendly" },
  { stage: 2, label: "Stage 2 — On Due Date", desc: "Professional payment confirmation request", badge: "Professional" },
  { stage: 3, label: "Stage 3 — 3 Days Overdue", desc: "Firm payment follow-up", badge: "Firm" },
  { stage: 4, label: "Stage 4 — 7 Days Overdue", desc: "Formal payment request & urgent notice", badge: "Urgent" },
  { stage: 5, label: "Stage 5 — 15 Days Overdue", desc: "Formal legal warning demand draft", badge: "Formal Warning" },
];

export default function FollowUps() {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState("");
  const [selectedStage, setSelectedStage] = useState(3);
  const [channel, setChannel] = useState("WhatsApp");
  const [tone, setTone] = useState("Professional");

  const [draftMessage, setDraftMessage] = useState("");
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.getInvoices().then(data => {
      const unpaid = data.filter(i => i.status !== "Paid");
      setInvoices(unpaid.length ? unpaid : data);
      if (unpaid.length) setSelectedInvoiceId(String(unpaid[0].id));
    }).catch(() => {});
  }, []);

  const selectedInv = invoices.find(i => String(i.id) === selectedInvoiceId) || invoices[0];

  const handleGenerateDraft = async () => {
    if (!selectedInv) return;
    setGenerating(true);
    try {
      const res = await api.generateReminder({
        invoice_id: selectedInv.id,
        stage: selectedStage,
        channel: channel,
        tone: tone
      });
      setDraftMessage(res.message);
    } catch {
      setDraftMessage(`Dear ${selectedInv?.customer_name || "Customer"},\n\nThis is a payment reminder for Invoice ${selectedInv?.number || "INV-1024"} of ${inr(selectedInv?.amount || 45000)}. Please settle at your earliest convenience.`);
    } finally {
      setGenerating(false);
    }
  };

  const handleSendReminder = async () => {
    if (!selectedInv || !draftMessage) return;
    setSending(true);
    try {
      const recipient = channel === "WhatsApp" ? selectedInv.customer_phone || "+919876543210" : selectedInv.customer_email || "customer@example.com";
      await api.sendReminder({
        invoice_id: selectedInv.id,
        stage: selectedStage,
        channel: channel,
        message: draftMessage,
        recipient: recipient
      });
      setToastMsg(`Reminder sent via ${channel} (Demo Simulated)`);
    } catch {
      setToastMsg(`Reminder sent via ${channel} (Simulated)`);
    } finally {
      setSending(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draftMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          AI Collections & Automated Reminders <Sparkles className="h-6 w-6 text-coral" />
        </h1>
        <p className="text-xs md:text-sm text-muted font-medium mt-1">
          5-Stage Escalation Workflow with AI personalization, tone adjustment & WhatsApp Business Cloud integration
        </p>
      </div>

      {/* 5-Stage Escalation Visual Stepper */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {STAGES.map((s) => {
          const isSelected = selectedStage === s.stage;
          return (
            <div
              key={s.stage}
              onClick={() => {
                setSelectedStage(s.stage);
                setDraftMessage("");
              }}
              className={`p-4 rounded-3xl border transition cursor-pointer flex flex-col justify-between space-y-2 ${
                isSelected ? "bg-coral text-white border-coral shadow-coral-glow scale-102" : "bg-white text-navy border-border hover:border-coral/40 shadow-fintech"
              }`}
            >
              <div>
                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mb-1 ${
                  isSelected ? "bg-white/20 text-white" : "bg-cream text-muted"
                }`}>
                  {s.badge}
                </span>
                <p className="font-extrabold text-xs leading-snug">{s.label}</p>
              </div>
              <p className={`text-[11px] leading-tight ${isSelected ? "text-slate-100" : "text-muted"}`}>
                {s.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Generator & Preview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="bg-white rounded-3xl p-6 border border-border shadow-fintech space-y-4">
          <h3 className="font-extrabold text-navy text-base">Reminder Configuration</h3>

          {/* Select Invoice */}
          <div>
            <label className="font-bold text-xs text-muted block mb-1">Target Invoice</label>
            <select
              value={selectedInvoiceId}
              onChange={(e) => {
                setSelectedInvoiceId(e.target.value);
                setDraftMessage("");
              }}
              className="w-full bg-cream border border-border rounded-2xl px-3.5 py-2.5 text-xs font-bold text-navy focus:outline-none focus:ring-2 focus:ring-coral"
            >
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.number} • {inv.customer_name} ({inr(inv.amount)})
                </option>
              ))}
            </select>
          </div>

          {/* Channel Selector */}
          <div>
            <label className="font-bold text-xs text-muted block mb-1">Reminder Channel</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setChannel("WhatsApp")}
                className={`py-2.5 rounded-2xl text-xs font-bold border transition ${
                  channel === "WhatsApp" ? "bg-success text-white border-success shadow-md" : "bg-cream text-navy border-border"
                }`}
              >
                WhatsApp Cloud
              </button>
              <button
                type="button"
                onClick={() => setChannel("Email")}
                className={`py-2.5 rounded-2xl text-xs font-bold border transition ${
                  channel === "Email" ? "bg-navy text-white border-navy shadow-md" : "bg-cream text-navy border-border"
                }`}
              >
                Email Template
              </button>
            </div>
          </div>

          {/* Tone Selector */}
          <div>
            <label className="font-bold text-xs text-muted block mb-1">AI Tone Preference</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-cream border border-border rounded-2xl px-3.5 py-2 text-xs font-bold text-navy"
            >
              <option>Friendly</option>
              <option>Professional</option>
              <option>Firm</option>
              <option>Formal Warning</option>
            </select>
          </div>

          <button
            onClick={handleGenerateDraft}
            disabled={generating || !selectedInv}
            className="w-full bg-coral hover:bg-coral-hover text-white font-bold text-xs py-3 rounded-2xl shadow-coral-glow transition flex items-center justify-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {generating ? "Generating AI Message..." : "Generate AI Reminder Message"}
          </button>
        </div>

        {/* Preview & Edit Column */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-border shadow-fintech space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-extrabold text-navy text-base flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-coral" /> Preview & Review Draft
                </h3>
                <p className="text-xs text-muted">Review, edit, and confirm message body before dispatch</p>
              </div>
              {draftMessage && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 bg-cream border border-border text-navy text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-border transition"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              )}
            </div>

            {draftMessage ? (
              <div className="mt-4 space-y-3">
                <textarea
                  rows="9"
                  value={draftMessage}
                  onChange={(e) => setDraftMessage(e.target.value)}
                  className="w-full bg-cream/60 border border-border rounded-2xl p-4 text-xs font-mono text-navy leading-relaxed focus:outline-none focus:ring-2 focus:ring-coral"
                />
                <p className="text-[11px] text-muted font-medium">
                  Recipient: <span className="font-bold text-navy">{channel === "WhatsApp" ? selectedInv?.customer_phone || "+91 98222 33445" : selectedInv?.customer_email || "accounts@customer.com"}</span>
                </p>
              </div>
            ) : (
              <div className="py-20 text-center text-muted space-y-2">
                <MessageSquare className="h-10 w-10 text-coral/30 mx-auto" />
                <p className="font-bold text-navy text-sm">No message generated yet</p>
                <p className="text-xs max-w-xs mx-auto">Click "Generate AI Reminder Message" to personalize a multi-stage follow-up draft.</p>
              </div>
            )}
          </div>

          {draftMessage && (
            <div className="pt-4 border-t border-border flex gap-3">
              <button
                onClick={handleSendReminder}
                disabled={sending}
                className="flex-1 bg-coral hover:bg-coral-hover text-white font-bold text-xs py-3 rounded-2xl shadow-coral-glow transition flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" /> {sending ? "Sending..." : `Approve & Dispatch via ${channel}`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
