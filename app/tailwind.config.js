module.exports = {
	content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {}
	},
	plugins: [require("@tailwindcss/typography"), require("daisyui")],
	daisyui: {
		styled: true,
		themes: ["emerald"],
		base: true,
		utils: true,
		logs: true,
		rtl: false,
		prefix: ""
	}
};
