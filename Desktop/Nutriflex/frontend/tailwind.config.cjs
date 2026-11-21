module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: '#245C45',
        sage: '#75A98B',
        cream: '#F4F3E9',
        mint: '#DCE9D9',
        gold: '#E9B96E',
        charcoal: '#303B35',
      },
      fontFamily: {
        heading: ['"DM Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};