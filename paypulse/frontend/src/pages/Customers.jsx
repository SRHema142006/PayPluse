import React, { useEffect, useState } from "react";
import { Users, Search, Plus, Phone, Mail, Clock, AlertTriangle, ShieldCheck, X } from "lucide-react";
import { api } from "../services/api";

const inr = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetail, setCustomerDetail] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newCust, setNewCust] = useState({ name: "", company: "", email: "", phone: "" });

  const loadCustomers = async () => {
    try {
      const data = await api.getCustomers(search);
      setCustomers(data);
    } catch {
      setCustomers([
        { id: 1, name: "ABC Enterprises", company: "ABC Group Ltd", email: "finance@abcenterprises.in", phone: "+91 98111 22334", total_invoices: 6, total_outstanding: 45000, avg_payment_delay: 14, reliability_tier: "High Risk" },
        { id: 2, name: "Sharma Textiles", company: "Sharma Mills", email: "accounts@sharmatextiles.com", phone: "+91 98222 33445", total_invoices: 12, total_outstanding: 80000, avg_payment_delay: 5, reliability_tier: "Moderate Risk" },
        { id: 3, name: "Kaveri Foods", company: "Kaveri Retail Pvt Ltd", email: "billing@kaverifoods.in", phone: "+91 98333 44556", total_invoices: 8, total_outstanding: 120000, avg_payment_delay: 0, reliability_tier: "Reliable" },
        { id: 4, name: "Metro Retail Hub", company: "Metro Supermarkets", email: "vendor@metroretail.com", phone: "+91 98444 55667", total_invoices: 15, total_outstanding: 60000, avg_payment_delay: 2, reliability_tier: "Reliable" },
        { id: 5, name: "Lotus Traders", company: "Lotus Export Corp", email: "pay@lotustraders.org", phone: "+91 98555 66778", total_invoices: 5, total_outstanding: 0, avg_payment_delay: 1, reliability_tier: "Reliable" },
        { id: 6, name: "Bharat Auto Parts", company: "Bharat Ancillaries", email: "ap@bharatauto.co.in", phone: "+91 98666 77889", total_invoices: 9, total_outstanding: 100000, avg_payment_delay: 18, reliability_tier: "High Risk" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [search]);

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      await api.createCustomer(newCust);
      setIsAddModalOpen(false);
      setNewCust({ name: "", company: "", email: "", phone: "" });
      loadCustomers();
    } catch {
      setIsAddModalOpen(false);
    }
  };

  const openProfile = async (c) => {
    setSelectedCustomer(c);
    try {
      const detail = await api.getCustomerProfile(c.id);
      setCustomerDetail(detail);
    } catch {
      setCustomerDetail({
        metrics: { total_invoices: c.total_invoices, total_outstanding: c.total_outstanding, overdue_count: c.reliability_tier === "High Risk" ? 2 : 0, late_payment_frequency: "33%", avg_days_to_pay: `${c.avg_payment_delay + 30} days` },
        invoices: [{ number: "INV-1024", due_date: "2026-10-15", amount: c.total_outstanding, status: "Overdue" }]
      });
    }
  };

  const getTierBadge = (tier) => {
    switch (tier) {
      case "Reliable":
        return { bg: "bg-success-light text-success border-success/20", icon: ShieldCheck };
      case "Moderate Risk":
        return { bg: "bg-amber-light text-amber border-amber/20", icon: Clock };
      default:
        return { bg: "bg-coral-light text-coral border-coral/20", icon: AlertTriangle };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-navy">Customer Management</h1>
          <p className="text-xs md:text-sm text-muted font-medium mt-1">
            Track customer payment reliability rankings, overdue balances & payment history
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-coral hover:bg-coral-hover text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-coral-glow transition w-fit"
        >
          <Plus className="h-4 w-4" /> Add Customer
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-border shadow-fintech">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer by name or company..."
            className="w-full bg-cream border border-border rounded-2xl pl-10 pr-4 py-2 text-xs text-navy font-medium focus:outline-none focus:ring-2 focus:ring-coral"
          />
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {customers.map((c) => {
          const badge = getTierBadge(c.reliability_tier);
          const BadgeIcon = badge.icon;
          return (
            <div
              key={c.id}
              onClick={() => openProfile(c)}
              className="bg-white rounded-3xl p-5 border border-border shadow-fintech hover:shadow-fintech-hover transition cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-navy text-base group-hover:text-coral transition">{c.name}</h3>
                    <p className="text-xs text-muted font-medium">{c.company || c.name}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1 ${badge.bg}`}>
                    <BadgeIcon className="h-3 w-3" /> {c.reliability_tier}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-muted pt-2 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-coral shrink-0" /> <span className="truncate">{c.email || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-coral shrink-0" /> <span>{c.phone || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                <div>
                  <span className="text-[11px] text-muted block">Outstanding Balance</span>
                  <span className="font-extrabold text-navy text-sm">{inr(c.total_outstanding)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-muted block">Avg Delay</span>
                  <span className="font-bold text-navy">{c.avg_payment_delay} days</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-navy/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-border">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-extrabold text-navy text-lg">Add New Customer</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-lg text-muted hover:bg-cream">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddCustomer} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-muted">Customer / Contact Name</label>
                <input
                  required
                  value={newCust.name}
                  onChange={(e) => setNewCust({ ...newCust, name: e.target.value })}
                  placeholder="e.g. Kaveri Foods"
                  className="w-full mt-1 border border-border rounded-xl px-3 py-2 font-bold text-navy"
                />
              </div>
              <div>
                <label className="font-bold text-muted">Company Name</label>
                <input
                  value={newCust.company}
                  onChange={(e) => setNewCust({ ...newCust, company: e.target.value })}
                  placeholder="e.g. Kaveri Retail Pvt Ltd"
                  className="w-full mt-1 border border-border rounded-xl px-3 py-2 text-navy"
                />
              </div>
              <div>
                <label className="font-bold text-muted">Email</label>
                <input
                  type="email"
                  value={newCust.email}
                  onChange={(e) => setNewCust({ ...newCust, email: e.target.value })}
                  placeholder="billing@kaverifoods.in"
                  className="w-full mt-1 border border-border rounded-xl px-3 py-2 text-navy"
                />
              </div>
              <div>
                <label className="font-bold text-muted">Phone Number</label>
                <input
                  value={newCust.phone}
                  onChange={(e) => setNewCust({ ...newCust, phone: e.target.value })}
                  placeholder="+91 98333 44556"
                  className="w-full mt-1 border border-border rounded-xl px-3 py-2 text-navy"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-coral hover:bg-coral-hover text-white font-bold py-2.5 rounded-2xl shadow-coral-glow transition">
                  Add Customer Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Profile Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-navy/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 border border-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-extrabold text-navy text-lg">{selectedCustomer.name} Profile</h3>
                <p className="text-xs text-muted">{selectedCustomer.company}</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-1 rounded-lg text-muted hover:bg-cream">
                <X className="h-5 w-5" />
              </button>
            </div>

            {customerDetail && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-cream rounded-2xl">
                    <span className="text-muted block text-[11px]">Total Outstanding</span>
                    <span className="font-extrabold text-navy text-sm">{inr(selectedCustomer.total_outstanding)}</span>
                  </div>
                  <div className="p-3 bg-cream rounded-2xl">
                    <span className="text-muted block text-[11px]">Avg Payment Delay</span>
                    <span className="font-extrabold text-navy text-sm">{selectedCustomer.avg_payment_delay} Days</span>
                  </div>
                  <div className="p-3 bg-cream rounded-2xl">
                    <span className="text-muted block text-[11px]">Reliability Rating</span>
                    <span className="font-bold text-coral text-xs">{selectedCustomer.reliability_tier}</span>
                  </div>
                </div>

                <div className="p-3 border border-border rounded-2xl space-y-1">
                  <p className="font-bold text-navy">Contact Information</p>
                  <p className="text-muted">Email: {selectedCustomer.email || "billing@example.com"}</p>
                  <p className="text-muted">Phone: {selectedCustomer.phone || "+91 98000 00000"}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
