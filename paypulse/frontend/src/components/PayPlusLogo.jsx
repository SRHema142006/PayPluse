import React from "react";

export default function PayPlusLogo({ className = "h-8", textClass = "text-white text-xl font-extrabold" }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-coral shadow-coral-glow text-white font-black">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          {/* Financial growth trend icon */}
          <path d="M3 17l6-6 4 4 8-8" />
          <path d="M14 7h7v7" />
          <path d="M12 12v6" />
          <path d="M9 15h6" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className={`tracking-tight ${textClass}`}>
          Pay<span className="text-coral">Plus</span>
        </span>
      </div>
    </div>
  );
}
