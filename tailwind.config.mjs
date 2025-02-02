/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10B981',
          hover: '#059669',
        },
        secondary: {
          DEFAULT: '#1F2937',
          hover: '#374151',
        },
        accent: {
          DEFAULT: '#6366F1',
          hover: '#4F46E5',
        },
        background: {
          light: '#F3F4F6',
          dark: '#111827',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#374151',
        },
        text: {
          light: '#FFFFFF',
          dark: '#1F2937',
        }
      },
    },
  },
  plugins: [],
};