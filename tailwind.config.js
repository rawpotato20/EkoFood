/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#415946",
                // secondary: "#91BF63",
                secondary: "#415946",
                tertiary: "#DAF2B6",
                black: "#000000",
                shade: "#818288",
                minus: "#EC7F7F",
                danger: "#FF4D4D"
            },
            // backgroundImage: { 'christmas': "url('/christmasbg2.png')" }
        },
    },
    plugins: [],
};
