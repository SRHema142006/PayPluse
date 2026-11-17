import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import AppLayout from "./layouts/AppLayout";
import Overview from "./pages/Overview";
import Invoices from "./pages/Invoices";
import Customers from "./pages/Customers";
import Payments from "./pages/Payments";
import FollowUps from "./pages/FollowUps";
import CashFlow from "./pages/CashFlow";
import InstantCash from "./pages/InstantCash";
import CreditScore from "./pages/CreditScore";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Overview />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="customers" element={<Customers />} />
            <Route path="payments" element={<Payments />} />
            <Route path="follow-ups" element={<FollowUps />} />
            <Route path="cash-flow" element={<CashFlow />} />
            <Route path="instant-cash" element={<InstantCash />} />
            <Route path="credit-score" element={<CreditScore />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </LanguageProvider>
    </AuthProvider>
  );
}
