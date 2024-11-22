/** @type {import('tailwindcss').Config} */

module.exports = {
	darkMode: "class",
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",

		// Or if using `src` directory:
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				primary: "#DF6C4F", // Reddish-orange
				accent: "#ECD06F", // Golden yellow
				black: "#000000",  // Black
				neutral: {
					light: "#F5F5F5",
					DEFAULT: "#AAAAAA",
					dark: "#333333",
				},
			},
		},
	},
	plugins: [],
};
