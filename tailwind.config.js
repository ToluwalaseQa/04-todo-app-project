module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  theme: {
    extend: {
      colors: {
        'light-blue': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
        },
        'cool-gray': {
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
        },
      },
      backgroundImage: {
        'blue-gray-blend':
          'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 25%, #e2e8f0 75%, #cbd5e1 100%)',
      },
    },
  },
};
