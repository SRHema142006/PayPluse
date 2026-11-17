/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#14213D",
          soft: "#263653",
          dark: "#0E172C"
        },
        cream: {
          DEFAULT: "#F4EDE0",
          light: "#FBF7F0",
          card: "#FFFFFF"
        },
        coral: {
          DEFAULT: "#FF6B5B",
          hover: "#E85A4A",
          light: "#FFE2DC"
        },
        muted: "#758096",
        border: "#E8E1D5",
        success: {
          DEFAULT: "#249B78",
          light: "rgba(36, 155, 120, 0.12)"
        },
        amber: {
          DEFAULT: "#E6A23C",
          light: "rgba(230, 162, 60, 0.12)"
        }
      },
      fontFamily: {
        sans: ["Manrope", "Inter", "Plus Jakarta Sans", "system-ui", "sans-serif"]
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px'
      },
      boxShadow: {
        'fintech': '0 4px 20px -2px rgba(20, 33, 61, 0.05), 0 2px 6px -1px rgba(20, 33, 61, 0.03)',
        'fintech-hover': '0 12px 30px -4px rgba(20, 33, 61, 0.10), 0 4px 12px -2px rgba(20, 33, 61, 0.06)',
        'coral-glow': '0 8px 20px -2px rgba(255, 107, 91, 0.35)'
      }
    }
  },
  plugins: []
};
