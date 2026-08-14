/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 派对 / 社交游戏的活力配色
        brand: {
          50: '#fff1f3',
          100: '#ffe4e8',
          200: '#fecdd4',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e', // 主色：派对粉
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        accent: {
          400: '#a78bfa',
          500: '#8b5cf6', // 副色：紫
          600: '#7c3aed',
        },
        night: {
          900: '#0b0a1f', // 深色背景
          800: '#15132e',
          700: '#1f1c3d',
          600: '#2a2654',
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'PingFang SC',
          'Microsoft YaHei',
          'sans-serif',
        ],
      },
      // 字号规范：micro(10) xs(12) sm(14) base(16) lg(18) xl(20) 2xl(24)
      // micro 仅用于徽章/LIVE 标/角标，正文最小 xs
      fontSize: {
        micro: ['10px', { lineHeight: '12px' }],
      },
      boxShadow: {
        glow: '0 0 24px rgba(244, 63, 94, 0.45)',
        card: '0 8px 32px rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};
