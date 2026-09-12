import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Skill-Bee | Closed-Loop Adaptive Learning Intelligence Platform',
  description: 'AI-Powered Cognitive Mastery Engine for Higher Engineering Education extending IBM SkillsBuild.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#fbf9f6] text-[#1b1c1a] antialiased">
        {children}
      </body>
    </html>
  );
}
