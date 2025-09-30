/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        coral: "#FF7F50",
        "pastel-blue": "#a2d2ff",
        "pastel-purple": "#cdb4db",
      },
      coral: {
        400: "#F08080", // Light Coral
        500: "#FF7F50", // Coral
        600: "#FF6347", // Tomato
        700: "#FF4500", // OrangeRed
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Example of a modern geometric font
      },
    },
  },
  plugins: [],
};
