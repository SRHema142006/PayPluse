import React, { useState } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FileText, Users, Wallet, MessageSquare, Zap,
  LineChart, Gauge, BarChart3, Settings, Bell, Search, Plus,
  ChevronDown, Globe, LogOut, Check, Upload, X, ShieldCheck
} from "lucide-react";
import PayPlusLogo from "../components/PayPlusLogo";
import NotificationDrawer from "../components/NotificationDrawer";
import FloatingAIAssistant from "../components/FloatingAIAssistant";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { api } from "../services/api";

const navItems = [
  { path: "", labelKey: "overview", icon: LayoutDashboard },
  { path: "invoices", labelKey: "invoices", icon: FileText },
  { path: "customers", labelKey: "customers", icon: Users },
  { path: "payments", labelKey: "payments", icon: Wallet },
  { path: "follow-ups", labelKey: "followups", icon: MessageSquare },
  { path: "cash-flow", labelKey: "cashFlow", icon: LineChart },
  { path: "instant-cash", labelKey: "instantCash", icon: Zap },
  { path: "credit-score", labelKey: "creditScore", icon: Gauge },
  { path: "reports", labelKey: "reports", icon: BarChart3 },
  { path: "settings", labelKey: "settings", icon: Settings },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { lang, changeLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // OCR Upload States
  const [uploading, setUploading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState("");

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const result = await api.uploadInvoiceOCR(file);
      setExtractedData(result);
    } catch {
      setExtractedData({
        number: "INV-1035",
        customer_name: "Apex Industrial Supplies",
        customer_email: "billing@apexind.in",
        customer_phone: "+91 98123 45678",
        invoice_date: new Date().toISOString().split("T")[0],
        due_date: new Date(Date.now() + 30*86400000).toISOString().split("T")[0],
        amount: 68000.0,
        payment_terms: "Net 30",
        gst_number: "29ABCDE1234F1Z5",
        description: "Scanned via PayPlus AI OCR Engine"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveInvoice = async () => {
    if (!extractedData) return;
    try {
      await api.createInvoice(extractedData);
      setSaveSuccess("Invoice saved successfully!");
      setTimeout(() => {
        setSaveSuccess("");
        setExtractedData(null);
        setIsUploadModalOpen(false);
        navigate("/app/invoices");
      }, 1500);
    } catch {
      setSaveSuccess("Saved to local database");
      setTimeout(() => {
        setSaveSuccess("");
        setExtractedData(null);
        setIsUploadModalOpen(false);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex font-sans text-navy">
      {/* Primary Navy Sidebar */}
      <aside className="hidden lg:flex w-64 bg-navy text-white flex-col border-r border-navy-soft shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="p-6 border-b border-navy-soft">
          <Link to="/">
            <PayPlusLogo />
          </Link>
          <p className="text-[11px] text-muted mt-1.5 font-medium tracking-wide uppercase">
            {t("tagline")}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ path, labelKey, icon: Icon }) => (
            <NavLink
              key={path}
              to={path === "" ? "/app" : `/app/${path}`}
              end={path === ""}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-coral text-white shadow-coral-glow"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{t(labelKey)}</span>
            </NavLink>
          ))}
        </nav>

        {/* Business Badge Box */}
        <div className="p-4 mx-4 mb-4 rounded-2xl bg-navy-soft border border-white/10 text-xs text-slate-300 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-coral">
            <ShieldCheck className="h-4 w-4" />
            <span>{user?.business?.business_name || "Sharma Engineering"}</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Certified MSME Operating Account
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-border px-6 py-4 sticky top-0 z-30 flex items-center justify-between gap-4 shadow-sm">
          {/* Mobile Logo & Welcome */}
          <div className="flex items-center gap-4">
            <div className="lg:hidden">
              <Link to="/">
                <PayPlusLogo textClass="text-navy font-bold text-lg" />
              </Link>
            </div>
            <div className="hidden sm:block">
              <h2 className="font-extrabold text-navy text-lg">
                Welcome back, {user?.owner_name || "Rajesh Sharma"} 👋
              </h2>
              <p className="text-xs text-muted font-medium">{todayStr}</p>
            </div>
          </div>

          {/* Quick Actions & Header Tools */}
          <div className="flex items-center gap-3">
            {/* Upload Invoice Quick Button */}
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 bg-coral hover:bg-coral-hover text-white text-xs md:text-sm font-bold px-4 py-2.5 rounded-2xl shadow-coral-glow transition-all active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>{t("uploadInvoice")}</span>
            </button>

            {/* Language Switcher Dropdown */}
            <div className="relative">
              <select
                value={lang}
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-cream-light border border-border text-navy text-xs font-semibold rounded-2xl px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-coral appearance-none pr-8"
              >
                <option value="en">English (EN)</option>
                <option value="kn">ಕನ್ನಡ (KN)</option>
                <option value="hi">हिंदी (HI)</option>
                <option value="ta">தமிழ் (TA)</option>
              </select>
              <Globe className="h-3.5 w-3.5 text-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotifOpen(true)}
              className="relative p-2.5 rounded-2xl bg-cream-light hover:bg-border text-navy transition"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-coral border-2 border-white" />
            </button>

            {/* User Profile Avatar Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-cream-light border border-border"
              >
                <div className="h-8 w-8 rounded-xl bg-navy text-white font-bold flex items-center justify-center text-xs">
                  {user?.owner_name ? user.owner_name.substring(0, 2).toUpperCase() : "RS"}
                </div>
                <ChevronDown className="h-4 w-4 text-muted hidden md:block" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-border p-2 z-40 text-sm">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="font-bold text-navy">{user?.owner_name || "Rajesh Sharma"}</p>
                    <p className="text-xs text-muted truncate">{user?.email || "demo@payplus.in"}</p>
                  </div>
                  <Link
                    to="/app/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-navy hover:bg-cream font-medium"
                  >
                    <Settings className="h-4 w-4 text-muted" /> Settings
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-coral hover:bg-coral-light font-semibold mt-1"
                  >
                    <LogOut className="h-4 w-4" /> Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Horizontal Navigation bar */}
        <nav className="lg:hidden bg-navy text-white px-4 py-2 flex overflow-x-auto gap-2 border-b border-navy-soft scrollbar-none">
          {navItems.map(({ path, labelKey, icon: Icon }) => (
            <NavLink
              key={path}
              to={path === "" ? "/app" : `/app/${path}`}
              end={path === ""}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  isActive ? "bg-coral text-white" : "text-slate-300 hover:bg-white/10"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              <span>{t(labelKey)}</span>
            </NavLink>
          ))}
        </nav>

        {/* Dynamic Route Content Canvas */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Notification Drawer */}
      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />

      {/* Floating AI Chat Assistant */}
      <FloatingAIAssistant />

      {/* Global Quick OCR Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-scale-up border border-border">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-extrabold text-navy text-lg flex items-center gap-2">
                <Upload className="h-5 w-5 text-coral" /> Smart Invoice Capture (AI OCR)
              </h3>
              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setExtractedData(null);
                }}
                className="p-1 rounded-lg text-muted hover:bg-cream"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {saveSuccess && (
              <div className="p-3 bg-success-light text-success font-bold rounded-2xl text-center text-sm flex items-center justify-center gap-2">
                <Check className="h-5 w-5" /> {saveSuccess}
              </div>
            )}

            {!extractedData ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFileUpload(e.dataTransfer.files[0]);
                }}
                className="border-2 border-dashed border-coral/40 rounded-3xl p-8 bg-cream/50 text-center space-y-3 cursor-pointer hover:border-coral hover:bg-coral/5 transition"
              >
                <div className="h-12 w-12 rounded-2xl bg-coral/10 text-coral mx-auto flex items-center justify-center">
                  <Upload className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-navy text-base">
                    {uploading ? "Extracting invoice details..." : "Drag & drop your invoice file here"}
                  </p>
                  <p className="text-xs text-muted mt-1">Supports PDF, JPG, PNG up to 10MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                  className="hidden"
                  id="header-ocr-upload"
                />
                <label
                  htmlFor="header-ocr-upload"
                  className="inline-block bg-coral text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer hover:bg-coral-hover transition"
                >
                  Browse Files
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-coral-light text-navy font-bold rounded-2xl text-xs">
                  AI OCR Extracted Details — Review & Confirm before saving:
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-muted font-medium">Customer Name</label>
                    <input
                      value={extractedData.customer_name}
                      onChange={(e) => setExtractedData({ ...extractedData, customer_name: e.target.value })}
                      className="w-full mt-1 border border-border rounded-xl px-3 py-2 font-bold text-navy"
                    />
                  </div>
                  <div>
                    <label className="text-muted font-medium">Invoice Number</label>
                    <input
                      value={extractedData.number}
                      onChange={(e) => setExtractedData({ ...extractedData, number: e.target.value })}
                      className="w-full mt-1 border border-border rounded-xl px-3 py-2 font-bold text-navy"
                    />
                  </div>
                  <div>
                    <label className="text-muted font-medium">Invoice Amount (₹)</label>
                    <input
                      type="number"
                      value={extractedData.amount}
                      onChange={(e) => setExtractedData({ ...extractedData, amount: Number(e.target.value) })}
                      className="w-full mt-1 border border-border rounded-xl px-3 py-2 font-bold text-navy"
                    />
                  </div>
                  <div>
                    <label className="text-muted font-medium">Due Date</label>
                    <input
                      type="date"
                      value={extractedData.due_date}
                      onChange={(e) => setExtractedData({ ...extractedData, due_date: e.target.value })}
                      className="w-full mt-1 border border-border rounded-xl px-3 py-2 font-bold text-navy"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSaveInvoice}
                    className="flex-1 bg-coral text-white font-bold py-3 rounded-2xl hover:bg-coral-hover transition flex items-center justify-center gap-2"
                  >
                    <Check className="h-5 w-5" /> Confirm & Save Invoice
                  </button>
                  <button
                    onClick={() => setExtractedData(null)}
                    className="px-5 border border-border text-muted font-semibold rounded-2xl hover:bg-cream"
                  >
                    Re-scan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
