/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./packages/client/src/**/*.{html,ts,css,scss}",
  ],
  theme: {
    extend: {
      fontSize: {
        smaller: '0.5rem', // Adjust this value as needed (12px in this case)
      },
    },
  },
  plugins: [],
}

