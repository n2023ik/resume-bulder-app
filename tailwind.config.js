/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./app.jsx",
  ],
  safelist: [
    'border-indigo-500', 'bg-indigo-500', 'text-indigo-600', 'bg-indigo-700', 'bg-indigo-50', 'border-indigo-200',
    'border-slate-500', 'bg-slate-500', 'text-slate-600', 'bg-slate-700', 'bg-slate-50', 'border-slate-200',
    'border-blue-500', 'bg-blue-500', 'text-blue-600', 'bg-blue-700', 'bg-blue-50', 'border-blue-200',
    'border-emerald-500', 'bg-emerald-500', 'text-emerald-600', 'bg-emerald-700', 'bg-emerald-50', 'border-emerald-200',
    'border-amber-500', 'bg-amber-500', 'text-amber-600', 'bg-amber-700', 'bg-amber-50', 'border-amber-200',
    'border-rose-500', 'bg-rose-500', 'text-rose-600', 'bg-rose-700', 'bg-rose-50', 'border-rose-200',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        serif: ['"Lora"', 'serif'],
      }
    },
  },
  plugins: [],
}

