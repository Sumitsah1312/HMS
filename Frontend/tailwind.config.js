/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#f0fdfa',
                    100: '#ccfbf1',
                    200: '#99f6e4',
                    300: '#5eead4',
                    400: '#2dd4bf',
                    500: '#14b8a6',
                    600: '#0d9488', // Calm Teal
                    700: '#0f766e',
                    800: '#115e59',
                    900: '#134e4a',
                },
                clinical: {
                    slate: '#64748b',
                    surface: '#f8fafc',
                    card: '#ffffff',
                    border: '#e2e8f0',
                    text: '#0f172a',
                    accent: '#0d9488',
                },
                status: {
                    waiting: '#f1f5f9',
                    consulting: '#f0fdf4',
                    completed: '#ecfdf5',
                    urgent: '#fff1f2',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'subtle': '0 2px 4px 0 rgba(0, 0, 0, 0.02)',
                'card': '0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -4px rgba(0, 0, 0, 0.02)',
                'premium': '0 25px 50px -12px rgba(0, 0, 0, 0.06)',
                'glass': '0 8px 32px 0 rgba(13, 148, 136, 0.08)',
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
            },
            animation: {
                'fade-in': 'fade-in 0.3s ease-out',
                'slide-up': 'slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                'pulse-subtle': 'pulse-subtle 2s infinite',
            },
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'slide-up': {
                    '0%': { transform: 'translateY(12px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'pulse-subtle': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.8' },
                }
            }
        },
    },
    plugins: [],
}
