import { Cormorant_Garamond, DM_Sans, Nanum_Pen_Script } from 'next/font/google';

// Shared typefaces for the portfolio and project pages.
export const display = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'], variable: '--f-display', display: 'swap' });
export const sans = DM_Sans({ subsets: ['latin'], variable: '--f-sans', display: 'swap' });
export const hand = Nanum_Pen_Script({ subsets: ['latin'], weight: '400', variable: '--f-hand', display: 'swap' });

export const fontVars = `${display.variable} ${sans.variable} ${hand.variable}`;
