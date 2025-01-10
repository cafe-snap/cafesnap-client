/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      animation: {
        bigBounce: "bigBounce 700ms alternate infinite ease",
      },
      keyframes: {
        bigBounce: {
          "0%": {
            top: "28px",
            height: "5px",
            borderRadius: "60px 60px 20px 20px",
            transform: "scaleX(2)",
          },
          "35%": {
            height: "14px",
            borderRadius: "50%",
            transform: "scaleX(1)",
          },
          "100%": {
            top: "4px",
          },
        },
      },
    }
  },
  plugins: [],
};
