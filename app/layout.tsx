import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LAYRO — AI-powered spatial design",
  description:
    "From natural language to production-ready layouts. LAYRO generates spatial designs for any industry in minutes, not weeks.",
  metadataBase: new URL("https://layro.ai"),
  openGraph: {
    title: "LAYRO — AI-powered spatial design",
    description:
      "From natural language to production-ready layouts. Pharma, industrial, healthcare, commercial, residential. One engine, every standard.",
    url: "https://layro.ai",
    siteName: "LAYRO",
    images: [{ url: "/brand/layro-app-icon-512.png", width: 512, height: 512 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LAYRO — AI-powered spatial design",
    description:
      "From natural language to production-ready layouts in minutes.",
    images: ["/brand/layro-app-icon-512.png"],
  },
  icons: {
    icon: [
      { url: "/brand/layro-isotipo.svg", type: "image/svg+xml" },
      { url: "/brand/layro-app-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} font-body bg-white text-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
