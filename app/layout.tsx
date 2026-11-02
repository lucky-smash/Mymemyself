import type { Metadata, Viewport } from 'next';
import { Instrument_Serif, Schibsted_Grotesk, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const display = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-display',
});
const sans = Schibsted_Grotesk({ subsets: ['latin'], variable: '--font-sans' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Lakshit Tyagi — AI MarTech',
  description:
    'Lakshit Tyagi builds full-stack products and AI workflows, and grows them with content and creators. Portfolio, experience and contact.',
  openGraph: {
    title: 'Lakshit Tyagi — AI MarTech',
    description: 'Full-stack + AI automation + creator-led growth.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#f2ede4',
};

/* Plays the dot-portrait intro on every page load; never for reduced motion.
   src/components/Intro.tsx cues the exit and lifts the scroll lock; the timeouts are a safety net if the
   client bundle never runs. */
const headScript = `var d=document.documentElement;try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('intro','intro-lock');setTimeout(function(){d.classList.add('intro-formed','intro-exit')},7000);setTimeout(function(){d.classList.remove('intro-lock')},7800)}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // `intro` is added before paint by the inline script on load, so the server markup can't match it.
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: headScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
