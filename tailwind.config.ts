import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
		keyframes: {
			zoom: {
			  '0%, 100%': { transform: 'scale(1)' },
			  '50%': { transform: 'scale(1.2)' },
			},
		  },
		  animation: {
			zoom: 'zoom 1.5s infinite',
		  },
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))',

  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))',
				  marineBlue: "hsl(213, 96%, 18%)",
				  purplishBlue: "hsl(243, 100%, 62%)",
				  pastelBlue: "hsl(228, 100%, 84%)",
				  lightBlue: "hsl(206, 94%, 87%)",
				  strawberryRed: "hsl(354, 84%, 57%)"
  			},
			  neutral: {
				coolGray: "hsl(231, 11%, 63%)",
				lightGray: "hsl(229, 24%, 87%)",
				magnolia: "hsl(217, 100%, 97%)",
				alabaster: "hsl(231, 100%, 99%)",
				white: "hsl(0, 0%, 100%)",
			  },
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
			  backgroundImage: {
				'sidebar-desktop': 'url(/images/bg-sidebar-desktop.svg)',
				'sidebar-mobile': 'url(/images/bg-sidebar-mobile.svg)'
			  },
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
	
  },
  
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
