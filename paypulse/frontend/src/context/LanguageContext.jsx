import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const translations = {
  en: {
    brand: "PayPlus",
    tagline: "Get Paid Faster. Grow Smarter.",
    overview: "Overview",
    dashboard: "Dashboard",
    invoices: "Invoices",
    customers: "Customers",
    payments: "Payment Tracking",
    followups: "AI Collections",
    instantCash: "Instant Cash",
    cashFlow: "Cash Flow",
    creditScore: "Loan Readiness",
    reports: "Reports & Analytics",
    assistant: "PayPlus AI Assistant",
    settings: "Settings",
    totalOutstanding: "Total Outstanding",
    overduePayments: "Overdue Payments",
    collectedThisMonth: "Collected This Month",
    upcomingPayments: "Upcoming Payments",
    cashAvailable: "Cash Available",
    uploadInvoice: "Upload Invoice",
    recentActivity: "Recent Activity",
    aiInsights: "PayPlus AI Insights",
    searchPlaceholder: "Search invoices, customers, transactions...",
    demoMode: "Demo Mode Active",
  },
  hi: {
    brand: "पेप्लस (PayPlus)",
    tagline: "तेजी से भुगतान पाएं। समझदारी से बढ़ें।",
    overview: "अवलोकन",
    dashboard: "डैशबोर्ड",
    invoices: "इनवॉइस",
    customers: "ग्राहक",
    payments: "भुगतान ट्रैकिंग",
    followups: "एआई तकादा (Follow-ups)",
    instantCash: "इंस्टेंट कैश (फाइनेंसिंग)",
    cashFlow: "कैश फ्लो पूर्वानुमान",
    creditScore: "ऋण पात्रता स्कोर",
    reports: "रिपोर्ट्स और विश्लेषण",
    assistant: "पेप्लस एआई सहायक",
    settings: "सेटिंग्स",
    totalOutstanding: "कुल बकाया राशि",
    overduePayments: "अतिदेय भुगतान",
    collectedThisMonth: "इस महीने प्राप्त रकम",
    upcomingPayments: "आगामी भुगतान",
    cashAvailable: "उपलब्ध नकदी",
    uploadInvoice: "इनवॉइस अपलोड करें",
    recentActivity: "हाल की गतिविधियां",
    aiInsights: "पेप्लस एआई अंतर्दृष्टि",
    searchPlaceholder: "इनवॉइस, ग्राहक, लेनदेन खोजें...",
    demoMode: "डेमो मोड सक्रिय",
  },
  kn: {
    brand: "ಪೇಪ್ಲಸ್ (PayPlus)",
    tagline: "ವೇಗವಾಗಿ ಹಣ ಪಡೆಯಿರಿ. ಜಾಣತನದಿಂದ ಬೆಳೆಯಿರಿ.",
    overview: "ಅವಲೋಕನ",
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    invoices: "ಇನ್‌ವಾಯ್ಸ್‌ಗಳು",
    customers: "ಗ್ರಾಹಕರು",
    payments: "ಪಾವತಿ ಟ್ರ್ಯಾಕಿಂಗ್",
    followups: "ಎಐ ಕಲೆಕ್ಷನ್ಸ್",
    instantCash: "ಇನ್‌ಸ್ಟೆಂಟ್ ಕ್ಯಾಶ್",
    cashFlow: "ಹಣದ ಹರಿವು (Cash Flow)",
    creditScore: "ಸಾಲ ಅರ್ಹತೆ ಸ್ಕೋರ್",
    reports: "ವರದಿಗಳು",
    assistant: "ಪೇಪ್ಲಸ್ ಎಐ ಸಹಾಯಕ",
    settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    totalOutstanding: "ಒಟ್ಟು ಬಾಕಿ ಮೊತ್ತ",
    overduePayments: "ಮೀರಿದ ಪಾವತಿಗಳು",
    collectedThisMonth: "ಈ ತಿಂಗಳು ಸ್ವೀಕರಿಸಿದ್ದು",
    upcomingPayments: "ಮುಂಬರುವ ಪಾವತಿಗಳು",
    cashAvailable: "ಲಭ್ಯವಿರುವ ನಗದು",
    uploadInvoice: "ಇನ್‌ವಾಯ್ಸ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    recentActivity: "ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ",
    aiInsights: "ಪೇಪ್ಲಸ್ ಎಐ ಒಳನೋಟಗಳು",
    searchPlaceholder: "ಹುಡುಕಿ...",
    demoMode: "ಡೆಮೊ ಮೋಡ್ ಸಕ್ರಿಯವಾಗಿದೆ",
  },
  ta: {
    brand: "பேபிளஸ் (PayPlus)",
    tagline: "வேகமாக பணம் பெறுங்கள். அறிவோடு வளருங்கள்.",
    overview: "மேலோட்டம்",
    dashboard: "டாஷ்போர்டு",
    invoices: "இன்வாய்ஸ்கள்",
    customers: "வாடிக்கையாளர்கள்",
    payments: "பணம் செலுத்தல் கண்காணிப்பு",
    followups: "AI வசூல் நினைவூட்டல்",
    instantCash: "உடனடி பணம்",
    cashFlow: "பணப்புழக்கம்",
    creditScore: "கடன் தகுதி மதிப்பெண்",
    reports: "அறிக்கைகள்",
    assistant: "PayPlus AI உதவியாளர்",
    settings: "அமைப்புகள்",
    totalOutstanding: "மொத்த நிலுவை",
    overduePayments: "காலாவதியான செலுத்துதல்கள்",
    collectedThisMonth: "இந்த மாதம் பெறப்பட்டது",
    upcomingPayments: "வரவிருக்கும் செலுத்துதல்கள்",
    cashAvailable: "கையிருப்பு பணம்",
    uploadInvoice: "இன்வாய்ஸ் பதிவேற்றவும்",
    recentActivity: "சமீபத்திய நடவடிக்கை",
    aiInsights: "PayPlus AI நுண்ணறிவு",
    searchPlaceholder: "தேடுக...",
    demoMode: "டெமோ பயன்முறை செயலில் உள்ளது",
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem("payplus_lang") || "en");

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem("payplus_lang", newLang);
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations["en"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
