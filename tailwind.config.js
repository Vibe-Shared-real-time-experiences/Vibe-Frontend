/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- LAYOUT COLORS ---
        // Background main color
        main: '#313338', 
        
        // Sidebar color
        sidebar: '#2B2D31',
        
        // Navigation rail color (Server column - Level 3 - Darkest)
        rail: '#1E1F22', 
        
        // --- INTERACTIVE ---
        // Hover color for items
        hover: '#3F4147',

        // Selected item color
        selected: '#404249',
        
        // --- TYPOGRAPHY ---
        // Primary text (Titles, chat content)
        primary: '#DBDEE1',
        // Secondary text (Timestamp, Unread Channel, Description)
        secondary: '#949BA4',
        
        // --- BRANDING ---
        brand: {
          DEFAULT: '#5865F2', // Primary button color
          hover: '#4752C4',   // Button hover color
        },
        
        // --- STATUS ---
        danger: '#DA373C',
        success: '#23A559',   // Online
        warning: '#F0B232',   // Idle/Away
      }
    },
  },
  plugins: [],
}