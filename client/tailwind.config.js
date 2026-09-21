/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0F172A',
        darkNavy: '#082B55',
        primaryBlue: '#2563EB',
        brightBlue: '#3B82F6',
        skyBlue: '#0EA5E9',
        purpleAccent: '#7C3AED',
        background: '#F8FAFC',
        textDark: '#172554',
        textGray: '#64748B',
        border: '#E2E8F0',
        success: '#16A34A',
        warning: '#F59E0B',
        error: '#DC2626',
      },
      boxShadow: {
        soft: '0 12px 30px rgba(15, 23, 42, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
