import React, { useState, useEffect } from "react";
import { Bell, CheckCheck, X, AlertTriangle, Info, CheckCircle2, Zap } from "lucide-react";
import { api } from "../services/api";

export default function NotificationDrawer({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch {
      // Fallback notifications if backend unreachable
      setNotifications([
        { id: 1, title: "Cash-Flow Alert", message: "Potential ₹30,000 cash shortage predicted next week.", type: "warning", is_read: false, created_at: "10 mins ago" },
        { id: 2, title: "Invoice Overdue", message: "Sharma Textiles (INV-1025) is now 2 days overdue.", type: "alert", is_read: false, created_at: "1 hour ago" },
        { id: 3, title: "Financing Available", message: "INV-1029 is eligible for ₹85,000 advance.", type: "info", is_read: false, created_at: "3 hours ago" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen]);

  const markRead = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    try { await api.markNotificationRead(id); } catch {}
  };

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    try { await api.markAllNotificationsRead(); } catch {}
  };

  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case "warning":
      case "alert": return <AlertTriangle className="h-5 w-5 text-amber-soft" />;
      case "success": return <CheckCircle2 className="h-5 w-5 text-mint" />;
      default: return <Info className="h-5 w-5 text-royal" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-navy/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col p-5 border-l border-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-navy" />
            <h3 className="font-bold text-navy text-lg">Notification Center</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center justify-between py-3 text-xs font-semibold text-muted">
          <span>{notifications.filter(n => !n.is_read).length} Unread</span>
          <button onClick={markAllRead} className="text-royal hover:underline flex items-center gap-1">
            <CheckCheck className="h-4 w-4" /> Mark all read
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {loading ? (
            <p className="text-sm text-muted text-center py-10">Loading notifications...</p>
          ) : notifications.length === 0 ? (
            <p className="text-sm text-muted text-center py-10">No notifications yet.</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex gap-3 ${
                  n.is_read ? "bg-white border-slate-100 opacity-75" : "bg-offwhite border-royal/20 shadow-sm"
                }`}
              >
                <div className="mt-0.5">{getIcon(n.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-navy text-sm">{n.title}</p>
                    {!n.is_read && <span className="h-2 w-2 rounded-full bg-royal" />}
                  </div>
                  <p className="text-xs text-charcoal/80 mt-1 leading-relaxed">{n.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
