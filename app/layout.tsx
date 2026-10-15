import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { BRAND_NAME, siteUrl } from "@/config/site";
import { LocaleProvider } from "@/lib/locale";
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

const description =
  "Layouts conceptuales GMP: tres variantes, zonificación ISO 14644 y Anexo 1, flujos de personal y material, y un modelo 3D interactivo revisado por un ingeniero senior GMP. España y Latinoamérica.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${BRAND_NAME} — Layout conceptual GMP`,
    template: `%s — ${BRAND_NAME}`,
  },
  description,
  applicationName: BRAND_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${BRAND_NAME} — Layout conceptual GMP`,
    description,
    url: siteUrl,
    siteName: BRAND_NAME,
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} — Layout conceptual GMP`,
    description,
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/brand/layro-isotipo.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0F1A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable} ${mono.variable} font-body bg-slate-50 text-ink antialiased`}>
        <LocaleProvider>{children}</LocaleProvider>
        <Analytics />
      </body>
    </html>
  );
}
