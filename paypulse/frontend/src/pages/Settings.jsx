import React, { useEffect, useState } from "react";
import { Settings as SettingsIcon, Save, Globe, CheckCircle2, MessageSquare } from "lucide-react";
import { api } from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { lang, changeLanguage } = useLanguage();
  const { user, reloadProfile } = useAuth();

  const [form, setForm] = useState({
    business_name: "Sharma Engineering & Supplies",
    owner_name: "Rajesh Sharma",
    phone_number: "+91 98765 43210",
    email: "demo@payplus.in",
    currency: "INR",
    language: "en",
    whatsapp_enabled: true,
    whatsapp_api_key: "",
    whatsapp_phone_number_id: "",
    email_enabled: true,
    auto_reminders: true
  });

  const [toastMsg, setToastMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSettings()
      .then((data) => {
        setForm(prev => ({
          ...prev,
          owner_name: data.owner_name || prev.owner_name,
          email: data.email || prev.email,
          phone_number: data.phone_number || prev.phone_number,
          business_name: data.business_name || prev.business_name,
          currency: data.preferences?.currency || "INR",
          language: data.preferences?.language || lang,
          whatsapp_enabled: data.preferences?.whatsapp_enabled ?? true,
          whatsapp_api_key: data.preferences?.whatsapp_api_key || "",
          whatsapp_phone_number_id: data.preferences?.whatsapp_phone_number_id || "",
          email_enabled: data.preferences?.email_enabled ?? true,
          auto_reminders: data.preferences?.auto_reminders ?? true
        }));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.updateSettings(form);
      changeLanguage(form.language);
      await reloadProfile();
      setToastMsg("Settings saved successfully!");
      setTimeout(() => setToastMsg(""), 3000);
    } catch {
      setToastMsg("Settings saved in local state.");
      setTimeout(() => setToastMsg(""), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-navy text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="h-4 w-4 text-coral" /> {toastMsg}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-navy flex items-center gap-2">
          Platform Settings <SettingsIcon className="h-6 w-6 text-coral" />
        </h1>
        <p className="text-xs md:text-sm text-muted font-medium mt-1">
          Manage your business profile, WhatsApp/Email API integrations, automation rules & language options
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Business Profile Section */}
        <div className="bg-white rounded-3xl p-6 border border-border shadow-fintech space-y-4">
          <h3 className="font-extrabold text-navy text-base">Business Profile & Account Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-muted">Business Name</label>
              <input
                value={form.business_name}
                onChange={(e) => setForm({ ...form, business_name: e.target.value })}
                className="w-full mt-1 border border-border rounded-xl px-3.5 py-2.5 font-bold text-navy bg-cream"
              />
            </div>
            <div>
              <label className="font-bold text-muted">Business Owner Name</label>
              <input
                value={form.owner_name}
                onChange={(e) => setForm({ ...form, owner_name: e.target.value })}
                className="w-full mt-1 border border-border rounded-xl px-3.5 py-2.5 font-bold text-navy bg-cream"
              />
            </div>
            <div>
              <label className="font-bold text-muted">Contact Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full mt-1 border border-border rounded-xl px-3.5 py-2.5 text-navy bg-cream"
              />
            </div>
            <div>
              <label className="font-bold text-muted">Contact Phone Number</label>
              <input
                value={form.phone_number}
                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                className="w-full mt-1 border border-border rounded-xl px-3.5 py-2.5 text-navy bg-cream"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp Business API Configuration */}
        <div className="bg-white rounded-3xl p-6 border border-border shadow-fintech space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-navy text-base flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-coral" /> WhatsApp Business Cloud API Integration
            </h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.whatsapp_enabled}
                onChange={(e) => setForm({ ...form, whatsapp_enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-coral" />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-muted">Meta WhatsApp Access Token (API Key)</label>
              <input
                type="password"
                value={form.whatsapp_api_key}
                onChange={(e) => setForm({ ...form, whatsapp_api_key: e.target.value })}
                placeholder="EAA..."
                className="w-full mt-1 border border-border rounded-xl px-3.5 py-2.5 text-navy bg-cream"
              />
            </div>
            <div>
              <label className="font-bold text-muted">WhatsApp Phone Number ID</label>
              <input
                value={form.whatsapp_phone_number_id}
                onChange={(e) => setForm({ ...form, whatsapp_phone_number_id: e.target.value })}
                placeholder="100928..."
                className="w-full mt-1 border border-border rounded-xl px-3.5 py-2.5 text-navy bg-cream"
              />
            </div>
          </div>
          <p className="text-[11px] text-muted">
            If left unconfigured, PayPlus operates in high-fidelity Functional Demo Mode with simulated WhatsApp delivery statuses.
          </p>
        </div>

        {/* Language & Currency Preferences */}
        <div className="bg-white rounded-3xl p-6 border border-border shadow-fintech space-y-4">
          <h3 className="font-extrabold text-navy text-base flex items-center gap-2">
            <Globe className="h-5 w-5 text-coral" /> Localization & Language Preferences
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-muted">Preferred Language</label>
              <select
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="w-full mt-1 border border-border rounded-xl px-3.5 py-2.5 font-bold text-navy bg-cream"
              >
                <option value="en">English (English)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-muted">Default Display Currency</label>
              <select
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                className="w-full mt-1 border border-border rounded-xl px-3.5 py-2.5 font-bold text-navy bg-cream"
              >
                <option value="INR">Indian Rupee (₹ INR)</option>
                <option value="USD">US Dollar ($ USD)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-coral hover:bg-coral-hover text-white font-bold py-3 rounded-2xl shadow-coral-glow transition flex items-center justify-center gap-2 text-xs"
          >
            <Save className="h-4 w-4" /> Save Platform Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
